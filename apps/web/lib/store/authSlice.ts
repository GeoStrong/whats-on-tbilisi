import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: { authDialogOpen: boolean; signupSuccessOpen: boolean } = {
  authDialogOpen: false,
  signupSuccessOpen: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.authDialogOpen = action.payload;
    },
    setSignupSuccessOpen: (state, action: PayloadAction<boolean>) => {
      state.signupSuccessOpen = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
