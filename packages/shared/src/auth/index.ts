import { getSupabaseClient } from "../supabase/client";
import { UserProfile } from "../types";

const supabase = getSupabaseClient();

/**
 * Sign up a new user
 * @param email - User's email address
 * @param password - User's password
 * @param name - User's full name
 * @returns Promise resolving to the signup response data
 * @throws Error if signup fails
 */
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Sign in an existing user
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to the signin response data
 * @throws Error if signin fails
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Sign out the current user
 * @throws Error if signout fails
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the current session
 */
export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

/**
 * Get the current authenticated user
 */
export const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * Fetch the current user's profile
 * Creates a user profile if it doesn't exist
 * @returns Promise resolving to an array containing the user profile or empty array if not authenticated
 */
export const fetchUserProfile = async (): Promise<UserProfile[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profile === null) {
      const { data: createdUser } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            name: user.user_metadata.name,
            email: user.email,
          },
        ])
        .select()
        .single();

      return createdUser ? [createdUser as UserProfile] : [];
    }

    return [profile as UserProfile];
  }

  return [];
};

/**
 * Get a user by their ID
 */
export const getUserById = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data === null) {
    return null;
  }

  if (error) throw error;

  return data as UserProfile;
};

/**
 * Subscribe to auth state changes
 * Returns an unsubscribe function
 */
export const onAuthStateChange = (
  callback: (event: string, session: unknown) => void
) => {
  const { data: subscription } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.subscription.unsubscribe();
};
