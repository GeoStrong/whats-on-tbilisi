"use client";

import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  useMap,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import PoiMarkers from "./poiMarkers";
import { Poi } from "@/lib/types";
import { useDispatch } from "react-redux";
import { mapActions } from "@/lib/store/mapSlice";
import { useLocalStorage } from "react-use";
import { zoomToLocation } from "@/lib/functions/helperFunctions";
import FloatingCursorPin from "./floatingCursorPin";
import useMapPinFloat from "@/lib/hooks/useMapPinFloat";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import useActivitiesFilter from "@/lib/hooks/useActvitiesFilter";
import MapLoadingLayout from "./mapLayoutLoading";
import Papa from "papaparse";
import { useTheme } from "next-themes";
import { ZoomIn, ZoomOut, Maximize, Minimize, Home } from "lucide-react";
import { MdMyLocation } from "react-icons/md";
import { toast } from "sonner";
import MapUserLocation from "./mapUserLocation";

interface MapProps {
  displayActivities?: boolean;
  mapHeight?: string;
  selectedActivity?: Poi[];
  displayMapButtons?: boolean;
  showStaticMarker?: boolean;
}

const GEORGIA_BOUNDS = {
  north: 43.59,
  south: 41.05,
  west: 40.01,
  east: 46.73,
};

const MapComponent: React.FC<MapProps> = ({
  displayActivities = true,
  mapHeight = "h-dvh md:min-h-[500px]",
  selectedActivity,
  displayMapButtons = true,
  showStaticMarker = false,
}) => {
  const map = useMap();
  const dispatch = useDispatch();
  const { isFloatingEnabled, latLng } = useSelector(
    (state: RootState) => state.map,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, _, removeValue] = useLocalStorage<Poi | null>("location", null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { cursorPos, clickedLatLng, mouseMoveHandler, onClickHandler } =
    useMapPinFloat(containerRef);

  const { activityLocations } = useActivitiesFilter();
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const hasSetTbilisiRef = useRef(false);
  const { resolvedTheme } = useTheme();
  const { isFullscreen } = useSelector((state: RootState) => state.map);

  useEffect(() => {
    if (!map) return;
    dispatch(mapActions.setMap(map));
  }, [dispatch, map]);

  useEffect(() => {
    if (!map || hasSetTbilisiRef.current || selectedActivity || value) return;

    const timerId = window.setTimeout(() => {
      if (map && !selectedActivity && !value) {
        map.setCenter({ lat: 41.73809, lng: 44.7808 });
        map.setZoom(11);
        hasSetTbilisiRef.current = true;
      }
    }, 100);

    // If the user interacts with the map before the timer fires, cancel it so we don't override their action.
    const clickListener = map.addListener("click", () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      hasSetTbilisiRef.current = true;
    });

    const mouseDownListener = map.addListener("mousedown", () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      hasSetTbilisiRef.current = true;
    });

    return () => {
      clearTimeout(timerId);
      if (clickListener && typeof clickListener.remove === "function") {
        clickListener.remove();
      }
      if (mouseDownListener && typeof mouseDownListener.remove === "function") {
        mouseDownListener.remove();
      }
    };
  }, [map, selectedActivity, value]);

  useEffect(() => {
    if (value && map) {
      zoomToLocation(map, value);
      // Mark that we've set a location so Tbilisi centering doesn't override it
      hasSetTbilisiRef.current = true;
      // Use a ref to avoid dependency on removeValue
      const timeoutId = setTimeout(() => {
        removeValue();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, value]); // removeValue is stable from useLocalStorage, safe to omit

  useEffect(() => {
    if (latLng && map && !displayActivities) {
      map.setCenter(latLng);
      map.setZoom(16);
    }
  }, [latLng, map, displayActivities]);

  const handleLocateMe = useCallback(() => {
    if (!map) return;

    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(userLocation);
          map.setZoom(16);
          setUserLocation(userLocation);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          toast.warning(
            "Unable to get your location. Please check your browser permissions.",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  }, [map]);

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom() || 12;
    map.setZoom(Math.min(currentZoom + 1, 20));
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom() || 12;
    map.setZoom(Math.max(currentZoom - 1, 6));
  }, [map]);

  const handleFullscreen = useCallback(() => {
    const mapContainer = containerRef.current;
    if (!mapContainer) return;

    if (!document.fullscreenElement) {
      mapContainer.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
        toast.error("Unable to enter fullscreen mode");
      });
      dispatch(mapActions.setIsFullscreen(true));
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
      dispatch(mapActions.setIsFullscreen(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetToTbilisi = useCallback(() => {
    if (!map) return;
    map.setCenter({ lat: 41.73809, lng: 44.7808 });
    map.setZoom(12);
    setUserLocation(null);
    toast.success("Map reset to Tbilisi");
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    if (currentCenter && currentZoom) {
      map.setZoom(currentZoom);
    }
  }, [map, resolvedTheme]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      dispatch(mapActions.setIsFullscreen(!!document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [dispatch]);

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
          clickable: false,
        });

        setTimeout(() => {
          polygon?.setMap(map);
        }, 1);
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
            : { lat: 41.73809, lng: 44.7808 } // Tbilisi coordinates
        }
        disableDefaultUI={true}
        gestureHandling={"greedy"}
        defaultZoom={selectedActivity ? 16 : 11}
        minZoom={6}
        streetViewControl={displayMapButtons}
        streetViewControlOptions={{
          position: ControlPosition.INLINE_END_BLOCK_CENTER,
        }}
        className={`${mapHeight} w-full`}
        onMousemove={(e) => {
          mouseMoveHandler(e);
        }}
        onClick={(e) => {
          onClickHandler(e);
        }}
        restriction={{
          latLngBounds: GEORGIA_BOUNDS,
          strictBounds: false,
        }}
      >
        {displayActivities ? (
          <PoiMarkers pois={activityLocations} />
        ) : selectedActivity ? (
          <PoiMarkers pois={selectedActivity} enableClick={false} />
        ) : null}

        {/* Static marker for address selection (no floating cursor) */}
        {showStaticMarker && latLng && !isFloatingEnabled && (
          <AdvancedMarker position={latLng}>
            <FloatingCursorPin />
          </AdvancedMarker>
        )}

        {/* Floating marker for interactive pin placement */}
        {(latLng || clickedLatLng) && isFloatingEnabled && (
          <AdvancedMarker position={latLng || clickedLatLng!}>
            <FloatingCursorPin />
          </AdvancedMarker>
        )}

        {userLocation && <MapUserLocation userLocation={userLocation} />}

        {cursorPos && isFloatingEnabled && (
          <div
            style={{
              position: "absolute",
              left: cursorPos.x,
              top: cursorPos.y,
              pointerEvents: "none",
              transform: "translate(-50%, -100%)",
            }}
          >
            <FloatingCursorPin />
          </div>
        )}

        {displayMapButtons && (
          <MapControl position={ControlPosition.RIGHT_CENTER}>
            <div className="m-2 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={handleZoomOut}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={handleFullscreen}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                aria-label={
                  isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Maximize className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                )}
              </button>
              <button
                onClick={handleResetToTbilisi}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                title="Reset to Tbilisi"
                aria-label="Reset to Tbilisi"
              >
                <Home className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="m-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              title="Locate Me"
              aria-label="Locate Me"
            >
              <MdMyLocation
                className={`h-5 w-5 text-gray-700 dark:text-gray-200 ${
                  isLocating ? "animate-pulse" : ""
                }`}
              />
            </button>
          </MapControl>
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
  displayMapButtons?: boolean;
  showStaticMarker?: boolean;
}> = ({
  API_KEY,
  height,
  displayActivities,
  selectedActivityLocation,
  skipAPIProvider = false,
  displayMapButtons = true,
  showStaticMarker = false,
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
      displayMapButtons={displayMapButtons}
      showStaticMarker={showStaticMarker}
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
