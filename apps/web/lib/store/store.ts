import { configureStore } from "@reduxjs/toolkit";
import { mapReducer } from "@whatson/shared/store";
import authReducer from "./authSlice";
import followerReducer from "./followerSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    auth: authReducer,
    follower: followerReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
