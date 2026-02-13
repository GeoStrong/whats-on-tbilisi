import { supabase } from "../supabase/supabaseClient";

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
 * Send a verification email using the Supabase Edge Function.
 * Requires a valid user session.
 */
export const sendVerificationEmail = async () => {
  const { data, error } = await supabase.functions.invoke("send-verification");
  if (error) throw error;
  return data;
};

/**
 * Request a password reset email.
 * Response is intentionally generic to avoid account enumeration.
 */
export const requestPasswordReset = async (email: string) => {
  const { data, error } = await supabase.functions.invoke(
    "request-password-reset",
    {
      body: { email },
    },
  );

  if (error) throw error;
  return data;
};

/**
 * Reset password using one-time reset token.
 */
export const resetPasswordWithToken = async (
  token: string,
  password: string,
  confirmPassword: string,
) => {
  const { data, error } = await supabase.functions.invoke("reset-password", {
    body: { token, password, confirmPassword },
  });

  if (error) throw error;
  return data;
};

/**
 * Change the current user's password after reauthenticating.
 * @param email - User's email address
 * @param currentPassword - User's current password
 * @param newPassword - User's new password
 * @throws Error if reauthentication or update fails
 */
export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
) => {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) throw signInError;

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) throw updateError;
};

export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

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
export const fetchUserProfile = async () => {
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
        .select();

      return [createdUser];
    }

    return [profile];
  }

  return [];
};

export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data === null) {
    return null;
  }

  if (error) throw error;

  return data;
};
