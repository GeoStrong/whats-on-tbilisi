import { MapMouseEvent } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mapActions } from "../../../../packages/shared/src/store/mapSlice";

const useMapPinFloat = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [clickedLatLng, setClickedLatLng] =
    useState<google.maps.LatLngLiteral | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      setCursorPos({ x, y });
    };

    const onLeave = () => {
      setCursorPos(null);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [containerRef]);

  const mouseMoveHandler = (event: MapMouseEvent) => {
    if (!event.domEvent) return;
    const mouseEvent = event.domEvent as MouseEvent;
    setCursorPos({ x: mouseEvent.clientX, y: mouseEvent.clientY });
  };

  const onClickHandler = (event: MapMouseEvent | google.maps.MapMouseEvent) => {
    // Support multiple event shapes from different map callbacks
    // Try common locations for latLng: event.latLng, event.detail?.latLng, event.domEvent?.latLng
    let rawLatLng: any =
      (event as any).latLng ||
      (event as any).detail?.latLng ||
      (event as any).domEvent?.latLng;

    // If still no latLng, try accessing it through the event object directly
    if (!rawLatLng && event && typeof event === "object") {
      rawLatLng = (event as any)["latLng"];
    }

    if (!rawLatLng) {
      console.warn("No latLng found in click event:", event);
      return;
    }

    let latLng: google.maps.LatLngLiteral;

    if (
      typeof rawLatLng.lat === "function" &&
      typeof rawLatLng.lng === "function"
    ) {
      latLng = { lat: rawLatLng.lat(), lng: rawLatLng.lng() };
    } else if (rawLatLng.lat !== undefined && rawLatLng.lng !== undefined) {
      latLng = { lat: Number(rawLatLng.lat), lng: Number(rawLatLng.lng) };
    } else {
      console.warn("Invalid latLng format:", rawLatLng);
      return;
    }

    setClickedLatLng(latLng);
    dispatch(mapActions.setLatLng(latLng));
    setCursorPos(null);
  };

  return {
    cursorPos,
    clickedLatLng,
    mouseMoveHandler,
    onClickHandler,
  };
};

export default useMapPinFloat;
