"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { fetchUserSession } from "@/lib/store/userSlice";

export const UserInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialize user session on app start
    dispatch(fetchUserSession());
  }, [dispatch]);

  return null; // This component doesn't render anything
};
