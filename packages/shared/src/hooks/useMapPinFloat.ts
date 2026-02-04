import { useMemo } from "react";

export default function useMapPinFloat() {
  return useMemo(
    () => ({
      cursorPos: null,
      clickedLatLng: null,
      mouseMoveHandler: () => {},
      onClickHandler: () => {},
    }),
    [],
  );
}
