import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  center: { lat: number; lng: number } | null;
  zoom: number | null;
  latLng: { lat: number; lng: number } | null;
  isFloatingEnabled: boolean;
  isFullscreen: boolean;
}

const initialState: MapState = {
  center: null,
  zoom: null,
  latLng: null,
  isFloatingEnabled: false,
  isFullscreen: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCenter: (
      state,
      action: PayloadAction<{ lat: number; lng: number } | null>,
    ) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number | null>) => {
      state.zoom = action.payload;
    },
    setLatLng: (
      state,
      action: PayloadAction<{ lat: number; lng: number } | null>,
    ) => {
      state.latLng = action.payload;
    },
    setIsFloatingEnabled: (state, action: PayloadAction<boolean>) => {
      state.isFloatingEnabled = action.payload;
    },
    setIsFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
  },
});

export const mapActions = mapSlice.actions;
export const mapReducer = mapSlice.reducer;
