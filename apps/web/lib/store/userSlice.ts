import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../types";
import { AppSession } from "../types/api";
import {
  getSession,
  fetchUserProfile as apiFetchUserProfile,
} from "../auth/auth";

interface UserState {
  user: UserProfile | null;
  session: AppSession;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isProfileFetched: boolean; // Track if we've completed a profile fetch
}

const initialState: UserState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  isProfileFetched: false,
};

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const [userProfile] = await apiFetchUserProfile();
      return userProfile;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user profile",
      );
    }
  },
);

// Async thunk to fetch session
export const fetchUserSession = createAsyncThunk(
  "user/fetchUserSession",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      return session;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch session",
      );
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setSession: (state, action: PayloadAction<AppSession>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isProfileFetched = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      // If payload is undefined (empty array was returned), set user to null
      state.user = action.payload ?? null;
      state.isAuthenticated = !!action.payload;
      state.error = null;
      state.isProfileFetched = true;
      // Only set isLoading to false if we've completed the profile fetch
      // This ensures we don't show NotAuth prematurely
      state.isLoading = false;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.user = null;
      state.isAuthenticated = false;
      state.isProfileFetched = true;
    });

    // Fetch session
    // Note: fetchUserSession doesn't affect isLoading to avoid race conditions
    // Only fetchUserProfile controls isLoading since that's what components use
    builder.addCase(fetchUserSession.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchUserSession.fulfilled, (state, action) => {
      state.session = action.payload;
      // Only update isAuthenticated if we haven't fetched profile yet
      // Otherwise, let fetchUserProfile control isAuthenticated
      if (!state.isProfileFetched) {
        state.isAuthenticated = !!action.payload;
      }
      state.error = null;
    });
    builder.addCase(fetchUserSession.rejected, (state, action) => {
      state.error = action.payload as string;
      state.session = null;
      // Only update isAuthenticated if we haven't fetched profile yet
      if (!state.isProfileFetched) {
        state.isAuthenticated = false;
      }
    });
  },
});

export const userActions = userSlice.actions;
const userReducer = userSlice.reducer;

export default userReducer;
