"use client";

import { useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchUserProfile } from "../store/userSlice";

const useGetUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Memoize the return object to prevent unnecessary rerenders
  return useMemo(
    () => ({
      user,
      isLoading,
      error,
      isAuthenticated,
    }),
    [user, isLoading, error, isAuthenticated],
  );
};

export default useGetUserProfile;
