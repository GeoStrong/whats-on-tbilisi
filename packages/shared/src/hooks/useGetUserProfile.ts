import { useMemo } from "react";
import type { UserProfile } from "../types";

const useGetUserProfile = () => {
  return useMemo(
    () => ({
      user: null as UserProfile | null,
      isLoading: false,
      error: null as string | null,
      isAuthenticated: false,
    }),
    [],
  );
};

export default useGetUserProfile;
