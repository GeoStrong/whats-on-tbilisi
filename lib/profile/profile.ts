import { handleUploadFile } from "../functions/helperFunctions";
import { getActivityById } from "../functions/supabaseFunctions";
import { supabase } from "../supabase/supabaseClient";
import {
  ActivityEntity,
  FollowersEntity,
  SavedActivityEntity,
  UserProfile,
} from "../types";

export const handleUploadUserAvatar = async (user: UserProfile, file: File) => {
  const filePath = await handleUploadFile("avatars", file, user);

  const publicUrl = `${process.env.NEXT_PUBLIC_R2_DEV_URL}/${filePath}`;

  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_path: filePath })
    .eq("id", user.id);

  if (updateError) throw updateError;

  return publicUrl;
};

export const handleUploadUserInformation = async (
  user: UserProfile,
  name?: string,
  phone?: string,
  bio?: string,
) => {
  const { data, error } = await supabase
    .from("users")
    .update([
      {
        name,
        phone,
        additionalInfo: bio,
      },
    ])
    .eq("id", user.id);

  if (error) throw error;

  return data;
};

export const handleSavedActivities = async (
  user: UserProfile,
  activityId: string,
  save: boolean,
) => {
  if (save) {
    const { error } = await supabase.from("saved_activities").insert([
      {
        user_id: user.id,
        activity_id: activityId,
      },
    ]);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("saved_activities")
      .delete()
      .eq("user_id", user.id)
      .eq("activity_id", activityId);

    if (error) throw error;
  }
};

export const fetchSavedActivities = async (userId: string) => {
  const { data: savedActivitiesId, error: savedActivitiesError } =
    await supabase
      .from("saved_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

  if (savedActivitiesError) throw savedActivitiesError;

  const savedActivities = (
    await Promise.all(
      savedActivitiesId.map(
        async (activity: SavedActivityEntity) =>
          await getActivityById(activity.activity_id),
      ),
    )
  ).flat() as ActivityEntity[];

  return savedActivities;
  // const savedActivities  = await getActivityById()
};

export const isActivitySaved = async (userId: string, activityId: string) => {
  const { data, error } = await supabase
    .from("saved_activities")
    .select("activity_id")
    .eq("user_id", userId)
    .eq("activity_id", activityId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return !!data;
};

export const fetchUserInfo = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, phone, avatar_path, email_verified_at")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
};

export const fetchAllParticipantsByActivityId = async (activityId: string) => {
  const { data, error } = await supabase
    .from("activity_participants")
    .select("*")
    .eq("activity_id", activityId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const checkUserParticipation = async (
  userId: string,
  activityId: string,
) => {
  const { data, error } = await supabase
    .from("activity_participants")
    .select("*")
    .eq("user_id", userId)
    .eq("activity_id", activityId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }
  return !!data;
};

export const participationSignUp = async (
  userId: string,
  activityId: string,
  additionalInfo?: string,
) => {
  const { error } = await supabase.from("activity_participants").insert([
    {
      user_id: userId,
      activity_id: activityId,
      additional_info: additionalInfo || null,
    },
  ]);
  if (error) throw error;
  return true;
};

export const fetchAllFollowersByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as FollowersEntity[];
};

export const fetchAllFollowingsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as FollowersEntity[];
};

export const checkUserFollow = async (userId: string, followerId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .eq("user_id", userId)
    .eq("follower_id", followerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  if (data.length === 0) {
    return false;
  }

  return true;
};

export const handleFollowUser = async (userId: string, followerId: string) => {
  const { error } = await supabase.from("followers").insert([
    {
      user_id: userId,
      follower_id: followerId,
    },
  ]);

  if (error) throw error;
};

export const handleUnfollowUser = async (
  userId: string,
  followerId: string,
) => {
  const { error } = await supabase
    .from("followers")
    .delete()
    .eq("user_id", userId)
    .eq("follower_id", followerId);

  if (error) throw error;
};
