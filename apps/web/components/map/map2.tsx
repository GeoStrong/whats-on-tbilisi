"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import PoiMarkers from "./poiMarkers";
import { Poi } from "@/lib/types";
import { useDispatch } from "react-redux";
import { mapActions } from "@whatson/shared/store";
import { useLocalStorage } from "react-use";
import { zoomToLocation } from "@/lib/functions/helperFunctions";
import FloatingCursorPin from "./floatingCursorPin";
import Papa from "papaparse";
import useMapPinFloat from "@/lib/hooks/useMapPinFloat";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import useActivitiesFilter from "@/lib/hooks/useActvitiesFilter";
import MapLoadingLayout from "./mapLayoutLoading";

interface MapProps {
  displayActivities?: boolean;
  mapHeight?: string;
  selectedActivity?: Poi[];
}

// const GEORGIA_BOUNDS = {
//   north: 43.59,
//   south: 41.05,
//   west: 40.01,
//   east: 46.73,
// };

const MapComponent: React.FC<MapProps> = ({
  displayActivities = true,
  mapHeight = "h-dvh md:min-h-[500px]",
  selectedActivity,
}) => {
  const map = useMap();
  const dispatch = useDispatch<AppDispatch>();
  const { isFloatingEnabled, center, zoom } = useSelector(
    (state: RootState) => state.map,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, _, removeValue] = useLocalStorage<Poi | null>("location", null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { cursorPos, clickedLatLng, mouseMoveHandler, onClickHandler } =
    useMapPinFloat(containerRef);

  const { activityLocations } = useActivitiesFilter();

  useEffect(() => {
    if (!map) return;
    // Sync Redux state when map loads
    const center = map.getCenter();
    if (center) {
      dispatch(mapActions.setCenter({ lat: center.lat(), lng: center.lng() }));
    }
    dispatch(mapActions.setZoom(map.getZoom() || 11));
  }, [dispatch, map]);

  // Listen to Redux center/zoom changes and update map
  useEffect(() => {
    if (!map || !center || !zoom) return;
    map.setCenter(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  useEffect(() => {
    if (value && map) {
      zoomToLocation(value, dispatch);
    }
    setTimeout(() => {
      removeValue();
    }, 500);
  }, [map, removeValue, value, dispatch]);

  useEffect(() => {
    let polygon: google.maps.Polygon | null = null;
    if (!map) return;

    (async () => {
      try {
        const res = await fetch("/ge.csv");
        const text = await res.text();
        const parsed = Papa.parse(text, {
          header: false,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        const coords = (parsed.data as google.maps.LatLngLiteral[][])
          .map((row) => {
            const [lat, lng] = row;
            return { lat: Number(lat), lng: Number(lng) };
          })
          .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));

        if (coords.length === 0) return;

        polygon = new window.google.maps.Polygon({
          paths: coords,
          strokeColor: "#000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#000",
          fillOpacity: 0.05,
        });

        polygon.setMap(map);
      } catch (err) {
        console.error("Failed to load or parse ge.csv", err);
      }
    })();

    return () => {
      if (polygon) polygon.setMap(null);
    };
  }, [map, displayActivities]);

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl">
      <GoogleMap
        mapId="58f416a6016f63d8ac38d7c5"
        defaultCenter={
          selectedActivity
            ? selectedActivity[0].location
            : { lat: 41.73809, lng: 44.7808 }
        }
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        defaultZoom={selectedActivity ? 16 : 12}
        streetViewControl={true}
        minZoom={8}
        className={`${mapHeight} w-full`}
        onMousemove={(e) => {
          mouseMoveHandler(e);
        }}
        onClick={(e) => {
          onClickHandler(e);
        }}
      >
        {displayActivities ? (
          <PoiMarkers pois={activityLocations} />
        ) : (
          <PoiMarkers pois={selectedActivity!} enableClick={false} />
        )}

        {clickedLatLng && isFloatingEnabled && (
          <AdvancedMarker position={clickedLatLng}>
            <FloatingCursorPin />
          </AdvancedMarker>
        )}

        {cursorPos && isFloatingEnabled && (
          <div
            style={{
              position: "absolute",
              left: cursorPos.x,
              top: cursorPos.y,
              pointerEvents: "none",
              zIndex: 9999,
              transform: "translate(-50%, -100%)",
            }}
          >
            <FloatingCursorPin />
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

const MapWrapper: React.FC<{
  API_KEY: string;
  height?: string;
  displayActivities?: boolean;
  selectedActivityLocation?: Poi[];
  skipAPIProvider?: boolean;
}> = ({
  API_KEY,
  height,
  displayActivities,
  selectedActivityLocation,
  skipAPIProvider = false,
}) => {
  const [mapError, setMapError] = useState<string | null>(null);

  const normalizedApiKey = useMemo(() => {
    if (!API_KEY) return "";
    return String(API_KEY).trim();
  }, [API_KEY]);

  const isValidKeyFormat = useMemo(() => {
    if (!normalizedApiKey) return false;
    return normalizedApiKey.startsWith("AIza") && normalizedApiKey.length >= 35;
  }, [normalizedApiKey]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("InvalidKeyMapError") ||
        event.message?.includes("Google Maps JavaScript API error")
      ) {
        setMapError(
          "Invalid Google Maps API key. Please check your API key in .env.local and ensure it's valid and has the Maps JavaScript API enabled.",
        );
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (!normalizedApiKey) {
    console.error(
      "Google Maps API key is missing. Please set GOOGLE_MAPS_API_KEY in your .env.local file.",
    );
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <div className="p-4 text-center">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Google Maps API Key Missing
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please set GOOGLE_MAPS_API_KEY in your .env.local file.
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Get your API key from{" "}
            <a
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (!isValidKeyFormat) {
    console.warn(
      "Google Maps API key format appears invalid. Please verify your API key.",
    );
  }

  if (mapError) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <div className="p-4 text-center">
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Google Maps API Error
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mapError}
          </p>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            <a
              href="https://console.cloud.google.com/google/maps-apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Check your API key settings
            </a>
            {" | "}
            <a
              href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Enable Maps JavaScript API
            </a>
          </p>
        </div>
      </div>
    );
  }

  const mapContent = mapError ? (
    <div className="flex h-full items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
      <div className="p-4 text-center">
        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
          Google Maps API Error
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {mapError}
        </p>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          <a
            href="https://console.cloud.google.com/google/maps-apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Check your API key settings
          </a>
          {" | "}
          <a
            href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Enable Maps JavaScript API
          </a>
        </p>
      </div>
    </div>
  ) : (
    <MapComponent
      mapHeight={height}
      displayActivities={displayActivities}
      selectedActivity={selectedActivityLocation}
    />
  );

  if (skipAPIProvider) {
    return <Suspense fallback={<MapLoadingLayout />}>{mapContent}</Suspense>;
  }

  return (
    <Suspense fallback={<MapLoadingLayout />}>
      <APIProvider apiKey={normalizedApiKey} libraries={["places"]}>
        {mapContent}
      </APIProvider>
    </Suspense>
  );
};

export default MapWrapper;
