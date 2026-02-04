import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  isUserFollowing: boolean | null;
  lastChangedUserId: string | null;
  lastChangedAt: number | null;
} = {
  isUserFollowing: null,
  lastChangedUserId: null,
  lastChangedAt: null,
};

export const followerSlice = createSlice({
  name: "follower",
  initialState,
  reducers: {
    setIsUserFollowing: (
      state,
      action: PayloadAction<{ userId: string; isFollowing: boolean }>,
    ) => {
      state.isUserFollowing = action.payload.isFollowing;
      state.lastChangedUserId = action.payload.userId;
      state.lastChangedAt = Date.now();
    },
  },
});

export const followerActions = followerSlice.actions;
const followerReducer = followerSlice.reducer;

export default followerReducer;
