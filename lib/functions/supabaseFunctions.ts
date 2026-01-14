import { PostgrestError } from "@supabase/supabase-js";
import { getUserById } from "../auth/auth";
import { supabase } from "../supabase/supabaseClient";
import {
  ActivityCategories,
  ActivityEntity,
  Category,
  CommentEntity,
  ImageType,
  NewActivityEntity,
  UserProfile,
  FeedPostWithActivity,
  ActivityParticipantsEntity,
  UserParticipationHistory,
} from "../types";
import { isString, isValidImage } from "./helperFunctions";

/**
 * Fetch all categories from the database
 * @returns Promise resolving to an array of Category objects
 */
export const getCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
};

export const getCategoryById = async (categoryId: number | string) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId);

  if (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }

  return data as Category[];
};

/**
 * Get categories by activity ID using a join to avoid N+1 queries
 * @param activityId - The ID of the activity
 * @returns Promise resolving to an array of Category objects associated with the activity
 */
export const getCategoriesByActivityId = async (
  activityId: number | string,
) => {
  // Use a join query instead of multiple queries to avoid N+1 problem
  const { data, error } = await supabase
    .from("activity_categories")
    .select(
      `
      category_id,
      categories (
        id,
        name,
        icon,
        color,
        category
      )
    `,
    )
    .eq("activity_id", activityId);

  if (error) {
    console.error("Error fetching categories for activity:", error);
    return [];
  }

  // Transform the joined data to match Category type
  return (data || [])
    .map((item: any) => {
      const category = item.categories;
      if (!category) return null;
      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        category: category.category,
      };
    })
    .filter((cat: Category | null) => cat !== null) as Category[];
};

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ActivityFilters {
  search?: string;
  date?: string;
  categories?: string[];
  userId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

/**
 * Get activities with pagination and server-side filtering support
 */
export const getActivities = async (
  params?: PaginationParams & { filters?: ActivityFilters },
): Promise<ActivityEntity[] | PaginatedResult<ActivityEntity>> => {
  const limit = params?.limit || 20;
  const offset =
    params?.offset || (params?.page ? (params.page - 1) * limit : 0);
  const filters = params?.filters;

  let query = supabase
    .from("activities")
    .select("*", { count: params ? "exact" : undefined });

  // Apply server-side filters
  if (filters) {
    // Filter by user ID
    if (filters.userId) {
      query = query.eq("user_id", filters.userId);
    }

    // Filter by date (exact match)
    if (
      filters.date &&
      filters.date !== "weekend" &&
      filters.date !== "month"
    ) {
      // For exact date match
      const dateStr = filters.date.split("T")[0];
      query = query
        .gte("date", `${dateStr}T00:00:00`)
        .lt("date", `${dateStr}T23:59:59`);
    } else if (filters.date === "weekend") {
      // Weekend filter: Saturday (6) or Sunday (0)
      // This requires a more complex query - for now, we'll do client-side
      // In production, consider a database function or computed column
    } else if (filters.date === "month") {
      // Current month filter
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query = query
        .gte("date", firstDay.toISOString())
        .lte("date", lastDay.toISOString());
    }

    // Filter by categories (if provided)
    // Note: This requires a join, so we'll handle it separately if needed
    // For now, categories filtering is done via getActivitiesByCategoryId
  }

  // Order by updated_at descending
  query = query.order("date", { ascending: false });

  if (params) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching activities:", error);
    return params
      ? { data: [], page: params.page || 1, limit, total: 0, hasMore: false }
      : [];
  }

  let filteredData = data || [];

  // Apply client-side filters that can't be done server-side efficiently
  if (filters) {
    // Search filter (text search across title, location, description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredData = filteredData.filter(
        (a) =>
          a.title?.toLowerCase().includes(searchLower) ||
          a.location?.toLowerCase().includes(searchLower) ||
          a.description?.toLowerCase().includes(searchLower),
      );
    }

    // Weekend filter (client-side for now)
    if (filters.date === "weekend") {
      filteredData = filteredData.filter((a) => {
        if (!a.date) return false;
        const day = new Date(a.date).getDay();
        return day === 0 || day === 6; // Sunday or Saturday
      });
    }

    // Category filtering via join (if categories are provided and not already filtered)
    // This is handled separately via getActivitiesByCategoryId
  }

  if (params && count !== null) {
    // Adjust count for client-side filtering
    const adjustedCount =
      filters?.search || filters?.date === "weekend"
        ? filteredData.length
        : count;

    return {
      data: filteredData,
      page: params.page || 1,
      limit,
      total: adjustedCount,
      hasMore: offset + limit < adjustedCount,
    };
  }

  return filteredData;
};

/**
 * Fetch a single activity by its ID
 * @param activityId - The ID of the activity to fetch
 * @returns Promise resolving to the ActivityEntity or null if not found
 */
export const getActivityById = async (activityId: number | string) => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", activityId);

  if (error) {
    console.error("Error fetching activity by ID:", error);
    return null;
  }

  return data;
};

/**
 * Get activities by category ID using a join to avoid N+1 queries
 * @param categoryId - The ID of the category
 * @returns Promise resolving to an array of ActivityEntity objects in the specified category
 */
export const getActivitiesByCategoryId = async (categoryId: string) => {
  // Use a join query instead of multiple queries to avoid N+1 problem
  const { data, error } = await supabase
    .from("activity_categories")
    .select(
      `
      activity_id,
      activities (
*
      )
    `,
    )
    .eq("category_id", categoryId);

  if (error) {
    console.error("Error fetching activities by category:", error);
    return [];
  }

  // Transform the joined data to match ActivityEntity type
  return (data || [])
    .map((item: any) => {
      const activity = item.activities;
      if (!activity || Array.isArray(activity)) return null;
      return activity as ActivityEntity;
    })
    .filter(
      (activity: ActivityEntity | null) => activity !== null,
    ) as ActivityEntity[];
};

export const getActivitiesByUserId = async (userId: string) => {
  const { data, error: activityIdsError } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId);

  if (activityIdsError) {
    console.error("Error fetching activity categories:", activityIdsError);
    return [];
  }

  return data as ActivityEntity[];
};

/**
 * Get activities from users that the current user follows
 * @param userId - The ID of the user whose followed users' activities to fetch
 * @returns Promise resolving to an array of ActivityEntity objects from followed users
 */
export const getActivitiesFromFollowedUsers = async (userId: string) => {
  // First, get all users that the current user follows
  const { data: followings, error: followingsError } = await supabase
    .from("followers")
    .select("user_id")
    .eq("follower_id", userId);

  if (followingsError) {
    console.error("Error fetching followings:", followingsError);
    return [];
  }

  // If user doesn't follow anyone, return empty array
  if (!followings || followings.length === 0) {
    return [];
  }

  // Extract user IDs from followings
  const followedUserIds = followings.map((f) => f.user_id);

  // Get activities from followed users, ordered by most recent
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .in("user_id", followedUserIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activities from followed users:", error);
    return [];
  }

  return data as ActivityEntity[];
};

export const getImageUrl = async (imageLocation: ImageType) => {
  const image = isString(imageLocation) ? imageLocation : "";
  if (!image) return null;

  // Try to return a cached optimized URL first (synchronous) to avoid extra signed-url calls
  try {
    const cached = getCachedOptimizedImageUrl(image, {
      quality: 50,
      format: "webp",
      width: 200,
      height: 200,
    });
    if (cached) return cached;
  } catch (e) {
    // ignore cache read errors
    console.debug("getCachedOptimizedImageUrl cache read error:", e);
  }

  // Fall back to generating an optimized URL (this will create a signed URL and cache it)
  try {
    const optimized = await getOptimizedImageUrl(image, {
      quality: 50,
      format: "webp",
      width: 200,
      height: 200,
    });
    return optimized;
  } catch (e) {
    console.debug("getOptimizedImageUrl generation error:", e);
    // As a last resort, attempt to generate a short-lived signed URL without optimization
    try {
      const res = await fetch(`/api/get-image-signed-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: image, expiresIn: 60 * 60 }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      const signedUrl = json?.signedUrl;
      return isValidImage(signedUrl) || null;
    } catch (err) {
      console.debug("fallback signed URL generation failed:", err);
      return null;
    }
  }
};
/**
 * Get optimized image URL with automatic quality adjustment
 * Reduces cache egress by ~35% using WebP format + quality 75
 */
export const getOptimizedImageUrl = async (
  imageLocation: ImageType,
  options?: {
    quality?: number;
    format?: "webp" | "jpg" | "png";
    width?: number;
    height?: number;
  },
) => {
  const image = isString(imageLocation) ? imageLocation : "";

  if (!image) return null;
  // Cache key incorporates image path and transformation options
  const makeCacheKey = (img: string, opts?: typeof options) =>
    `${img}::w${opts?.width ?? ""}::h${opts?.height ?? ""}::q${
      opts?.quality ?? 50
    }::f${opts?.format ?? "webp"}`;

  // In-memory cache for generated optimized URLs (per instance)
  // Stored value contains the generated URL and an expiration timestamp
  type CacheEntry = { url: string; expiresAt: number };

  // Keep cache in module scope to persist across calls during the process lifetime
  if (!(global as any).__optimizedImageUrlCache) {
    (global as any).__optimizedImageUrlCache = new Map<string, CacheEntry>();
  }

  const imageUrlCache: Map<string, CacheEntry> = (global as any)
    .__optimizedImageUrlCache;

  // Signed URLs are created with a 1 hour TTL; keep a small buffer and reuse until near expiry
  const SIGNED_URL_TTL_MS = 60 * 60 * 1000; // 1 hour
  const CACHE_BUFFER_MS = 5 * 60 * 1000; // 5 minutes buffer
  const CACHE_TTL_MS = SIGNED_URL_TTL_MS - CACHE_BUFFER_MS;

  const cacheKey = makeCacheKey(image, options);
  const now = Date.now();

  const cached = imageUrlCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.url;
  }

  const res = await fetch(`/api/get-image-signed-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filePath: image,
      expiresIn: SIGNED_URL_TTL_MS / 1000,
    }),
  });

  if (!res.ok) return null;
  const respJson = await res.json();
  const signedUrl = respJson?.signedUrl;
  if (!signedUrl) return null;

  const activityImage = isValidImage(signedUrl);

  if (!activityImage) return null;

  if (process.env.NODE_ENV === "development") {
    try {
      console.debug("getOptimizedImageUrl: obtained signedUrl for image", {
        image,
        signedUrl,
      });
    } catch (e) {
      console.error("Logging signedUrl error:", e);
    }
  }

  const { generateOptimizedImageUrl } = await import(
    "../functions/imageOptimization"
  );

  const optimized = generateOptimizedImageUrl(activityImage, {
    quality: options?.quality || 50,
    format: options?.format || "webp",
    width: options?.width,
    height: options?.height,
    cache: true,
  });

  // Cache the result until shortly before the signed URL expires
  imageUrlCache.set(cacheKey, {
    url: optimized,
    expiresAt: now + CACHE_TTL_MS,
  });

  return optimized;
};

/**
 * Synchronously return a cached optimized URL if available and not expired.
 * This avoids async calls when a URL was already generated earlier in the session.
 */
export const getCachedOptimizedImageUrl = (
  imageLocation: ImageType,
  options?: {
    quality?: number;
    format?: "webp" | "jpg" | "png";
    width?: number;
    height?: number;
  },
) => {
  const image = isString(imageLocation) ? imageLocation : "";
  if (!image) return null;

  const makeCacheKey = (img: string, opts?: typeof options) =>
    `${img}::w${opts?.width ?? ""}::h${opts?.height ?? ""}::q${
      opts?.quality ?? 50
    }::f${opts?.format ?? "webp"}`;

  if (!(global as any).__optimizedImageUrlCache) return null;

  const imageUrlCache: Map<string, { url: string; expiresAt: number }> = (
    global as any
  ).__optimizedImageUrlCache;

  const cacheKey = makeCacheKey(image, options);
  const entry = imageUrlCache.get(cacheKey);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    imageUrlCache.delete(cacheKey);
    return null;
  }

  return entry.url;
};

export const deleteImageFromStorage = async (imagePath: string | null) => {
  if (!imagePath) return;
  try {
    const res = await fetch(`/api/delete-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath: imagePath }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.error || `Failed to delete ${imagePath}`);
    }
    return true;
  } catch (err) {
    console.error("deleteImageFromStorage error:", err);
    throw err;
  }
};

export const postNewActivity = async (activity: NewActivityEntity) => {
  const { data, error } = await supabase
    .from("activities")
    .insert([activity])
    .select("*");

  if (error) throw error;

  return data as ActivityEntity[];
};

export const postActivityCategory = async (
  activityId: string,
  category: string,
) => {
  const { data, error } = await supabase
    .from("activity_categories")
    .insert([
      {
        activity_id: activityId,
        category_id: category,
      },
    ])
    .select("*");

  if (error) return error;

  return data;
};

export const postNewActivityCategories = async (
  activityId: string,
  categories: ActivityCategories[] | string[],
) => {
  const data = (
    await Promise.all(
      categories!.map((category) =>
        postActivityCategory(activityId, category).then((category) => category),
      ),
    )
  ).flat();

  return data;
};

export const deleteActivityByUser = async (
  userId: string,
  activityId: string,
) => {
  try {
    // Fetch the activity first so we can clean up its image and related data
    const { data: activity, error: fetchError } = await supabase
      .from("activities")
      .select("id, image")
      .eq("id", activityId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching activity before delete:", fetchError);
    }

    // Best-effort image cleanup – don't fail the whole delete if this throws
    if (activity?.image) {
      try {
        await deleteImageFromStorage(activity.image as string);
      } catch (imageErr) {
        console.error(
          "Failed to delete activity image from storage:",
          imageErr,
        );
      }
    }

    // Delete related activity categories (foreign-key rows)
    try {
      await deleteActivityCategories(activityId);
    } catch (catErr) {
      console.error("Failed to delete activity categories:", catErr);
    }

    // Finally, delete the activity row
    const { data: deleted, error } = await supabase
      .from("activities")
      .delete()
      .eq("id", activityId)
      .eq("user_id", userId)
      .select("*");

    if (error) {
      console.error("Error deleting an activity:", error);
      return [];
    }

    return deleted as ActivityEntity[];
  } catch (err) {
    console.error("Unexpected error deleting activity:", err);
    return [];
  }
};

export const updateActivtiy = async (
  activityId: string,
  updates: Partial<ActivityEntity>,
) => {
  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", activityId)
    .eq("user_id", updates.user_id)
    .select("*")
    .single();

  if (error) throw error;

  return data;
};

export const deleteActivityCategories = async (activityId: string) => {
  const { error } = await supabase
    .from("activity_categories")
    .delete()
    .eq("activity_id", activityId);

  if (error) throw error;
};

export const toggleActivityReaction = async (
  activityId: string,
  reaction: "like" | "dislike",
  userId: string,
) => {
  const { data, error } = await supabase.rpc("toggle_reaction", {
    p_activity_id: activityId,
    p_user_id: userId,
    p_reaction: reaction,
  });

  if (error) console.log("RPC error", error);
  return data;
};

export const getActivityReactions = async (activityId: string) => {
  const { data, error } = await supabase
    .from("activities")
    .select("likes, dislikes")
    .eq("id", activityId)
    .single();

  if (error) throw error;

  return data;
};

export const getUserReaction = async (activityId: string, userId: string) => {
  const { data, error } = await supabase
    .from("user_activity_reactions")
    .select("reaction")
    .eq("activity_id", activityId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return null;
  return data?.reaction ?? null;
};

export const getCommentsByActivityId = async (activityId: string) => {
  if (!activityId) return [];

  const { data, error } = await supabase
    .from("activity_comments")
    .select(
      "id, activity_id, user_id, text, created_at, updated_at, parent_comment_id",
    )
    .eq("activity_id", activityId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  const comments = (data || []).map((c: CommentEntity) => ({
    id: c.id,
    activity_id: c.activity_id,
    user_id: c.user_id,
    text: c.text,
    created_at: c.created_at,
    updated_at: c.updated_at,
    parent_comment_id: c.parent_comment_id || null,
  }));

  return comments;
};

export const postComment = async (
  activityId: string,
  userId: string,
  text: string,
  parent_comment_id?: string | null,
) => {
  if (!activityId || !userId || !text)
    throw new Error("Missing required fields");

  const insertObj: Partial<CommentEntity> = {
    activity_id: activityId,
    user_id: userId,
    text,
    parent_comment_id: parent_comment_id || null,
  };

  try {
    const { data, error } = await supabase
      .from("activity_comments")
      .insert([insertObj])
      .select()
      .single();

    if (error) {
      console.error("postComment error:", error);
      throw error;
    }

    return {
      id: data.id,
      activity_id: data.activity_id,
      user_id: data.user_id,
      text: data.text,
      created_at: data.created_at,
      updated_at: data.updated_at,
      parent_comment_id: data.parent_comment_id || null,
    };
  } catch (e) {
    console.error("postComment unexpected error:", e);
    throw e;
  }
};

export const updateComment = async (
  commentId: string,
  userId: string,
  text: string,
) => {
  if (!commentId || !userId || !text)
    throw new Error("Missing required fields");

  const { data, error } = await supabase
    .from("activity_comments")
    .update({ text })
    .eq("id", commentId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    activity_id: data.activity_id,
    user_id: data.user_id,
    text: data.text,
    created_at: data.created_at,
    updated_at: data.updated_at,
    parent_comment_id: data.parent_comment_id || null,
  };
};

export const deleteComment = async (commentId: string, userId: string) => {
  if (!commentId || !userId) throw new Error("Missing required fields");

  const { data, error } = await supabase
    .from("activity_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId)
    .select();

  if (error) throw error;

  return data;
};

/**
 * Feed Posts Functions
 */

/**
 * Create a new feed post
 * @param activityId - The ID of the activity to post
 * @param userId - The ID of the user creating the post
 * @param comment - Optional comment text
 * @returns Promise resolving to the created FeedPostEntity
 */
export const createFeedPost = async (
  activityId: string,
  userId: string,
  comment?: string | null,
) => {
  if (!activityId || !userId) {
    throw new Error("Missing required fields: activityId and userId");
  }

  const { data, error } = await supabase
    .from("feed_posts")
    .insert([
      {
        user_id: userId,
        activity_id: activityId,
        comment: comment || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating feed post:", error);
    throw error;
  }

  return data;
};

/**
 * Get feed posts from users that the current user follows
 * @param userId - The ID of the user whose followed users' posts to fetch
 * @returns Promise resolving to an array of FeedPostWithActivity objects
 */
export const getFeedPostsFromFollowedUsers = async (userId: string) => {
  // First, get all users that the current user follows
  const { data: followings, error: followingsError } = await supabase
    .from("followers")
    .select("user_id")
    .eq("follower_id", userId);

  if (followingsError) {
    console.error("Error fetching followings:", followingsError);
    return [];
  }

  // Extract user IDs from followings and include the current user's own posts
  const followedUserIds = followings ? followings.map((f) => f.user_id) : [];
  const allUserIds = [...followedUserIds, userId]; // Include current user

  // Get posts from followed users AND current user with activity and author info
  const { data, error } = await supabase
    .from("feed_posts")
    .select(
      `
      *,
      activities (*)
    `,
    )
    .in("user_id", allUserIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feed posts from followed users:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get user IDs from posts
  const userIds = [...new Set(data.map((item: any) => item.user_id))];

  // Fetch user profiles separately
  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, email, name, avatar_path, created_at")
    .in("id", userIds);

  if (usersError) {
    console.error("Error fetching users for feed posts:", usersError);
    return [];
  }

  // Create a map of user_id to user profile
  const usersMap = new Map(
    (usersData || []).map((user: any) => [user.id, user as UserProfile]),
  );

  // Transform the data to match FeedPostWithActivity type
  const transformedPosts = (data || [])
    .map((item: any) => {
      const activity = Array.isArray(item.activities)
        ? item.activities[0]
        : item.activities;
      const author = usersMap.get(item.user_id);

      if (!activity || !author) {
        console.warn("Missing activity or author for post:", item.id, {
          hasActivity: !!activity,
          hasAuthor: !!author,
          userId: item.user_id,
        });
        return null;
      }

      return {
        id: item.id,
        user_id: item.user_id,
        activity_id: item.activity_id,
        comment: item.comment,
        created_at: item.created_at,
        updated_at: item.updated_at,
        activity: activity as ActivityEntity,
        author: author as UserProfile,
      };
    })
    .filter((post: any): post is FeedPostWithActivity => post !== null)
    // Sort so that updated_at (when present) takes precedence over created_at
    .sort((a, b) => {
      const aTs = new Date(a.updated_at || a.created_at).getTime();
      const bTs = new Date(b.updated_at || b.created_at).getTime();
      return bTs - aTs;
    });

  return transformedPosts;
};

/**
 * Get a single feed post by ID
 * @param postId - The ID of the post to fetch
 * @returns Promise resolving to FeedPostWithActivity or null
 */
export const getFeedPostById = async (postId: string) => {
  const { data, error } = await supabase
    .from("feed_posts")
    .select(
      `
      *,
      activities (*)
    `,
    )
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Error fetching feed post:", error);
    return null;
  }

  if (!data) return null;

  const activity = Array.isArray(data.activities)
    ? data.activities[0]
    : data.activities;

  if (!activity) {
    console.error("Activity not found for feed post:", postId);
    return null;
  }

  // Fetch user profile separately
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, name, avatar_path, created_at")
    .eq("id", data.user_id)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user for feed post:", userError);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    activity_id: data.activity_id,
    comment: data.comment,
    created_at: data.created_at,
    updated_at: data.updated_at,
    activity: activity as ActivityEntity,
    author: userData as UserProfile,
  };
};

/**
 * Update a feed post's comment
 * @param postId - The ID of the post to update
 * @param userId - The ID of the user updating the post
 * @param comment - The new comment text
 * @returns Promise resolving to the updated FeedPostEntity
 */
export const updateFeedPost = async (
  postId: string,
  userId: string,
  comment: string | null,
) => {
  if (!postId || !userId) {
    throw new Error("Missing required fields: postId and userId");
  }

  const { data, error } = await supabase
    .from("feed_posts")
    .update({
      comment: comment || null,
      // Mark the post as updated so ordering can use updated_at
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating feed post:", error);
    throw error;
  }

  return data;
};

/**
 * Delete a feed post
 * @param postId - The ID of the post to delete
 * @param userId - The ID of the user deleting the post
 * @returns Promise resolving to the deleted post data
 */
export const deleteFeedPost = async (postId: string, userId: string) => {
  if (!postId || !userId) {
    throw new Error("Missing required fields: postId and userId");
  }

  const { data, error } = await supabase
    .from("feed_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error deleting feed post:", error);
    throw error;
  }

  return data;
};

/**
 * Check if an activity has been posted by a user
 * @param activityId - The ID of the activity to check
 * @param userId - The ID of the user to check
 * @returns Promise resolving to FeedPostEntity or null
 */
export const checkIfActivityPosted = async (
  activityId: string,
  userId: string,
) => {
  if (!activityId || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("feed_posts")
    .select("*")
    .eq("activity_id", activityId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking if activity posted:", error);
    return null;
  }

  return data;
};

/**
 * Get feed posts by user ID
 * @param userId - The ID of the user whose posts to fetch
 * @returns Promise resolving to an array of FeedPostWithActivity objects
 */
export const getFeedPostsByUserId = async (userId: string) => {
  if (!userId) {
    return [];
  }

  // Get posts from the user with activity and author info
  const { data, error } = await supabase
    .from("feed_posts")
    .select(
      `
      *,
      activities (*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feed posts by user ID:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Get user profile
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, name, avatar_path, created_at")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user for feed posts:", userError);
    return [];
  }

  // Transform the data to match FeedPostWithActivity type
  const transformedPosts = (data || [])
    .map((item: any) => {
      const activity = Array.isArray(item.activities)
        ? item.activities[0]
        : item.activities;

      if (!activity) {
        console.warn("Missing activity for post:", item.id);
        return null;
      }

      return {
        id: item.id,
        user_id: item.user_id,
        activity_id: item.activity_id,
        comment: item.comment,
        created_at: item.created_at,
        updated_at: item.updated_at,
        activity: activity as ActivityEntity,
        author: userData as UserProfile,
      };
    })
    .filter((post: any): post is FeedPostWithActivity => post !== null);

  return transformedPosts;
};

export const getFollowedUsersParticipation = async (userId: string) => {
  if (!userId) return;

  const { data: followings, error: followingsError } = await supabase
    .from("followers")
    .select("user_id")
    .eq("follower_id", userId);

  if (followingsError) {
    console.error("Error fetching followings:", followingsError);
    return [];
  }

  const followedUserIds: string[] = followings
    ? followings.map((f) => f.user_id)
    : [];

  if (followedUserIds.length === 0) {
    return [];
  }

  const data = (
    await Promise.all(
      followedUserIds.map(async (fid) => {
        const { data } = await supabase
          .from("activity_participants")
          .select(`*`)
          .eq("user_id", fid)
          .order("created_at", { ascending: false });
        return data as ActivityParticipantsEntity[];
      }),
    )
  ).flat();

  // Collect all unique activity IDs and user IDs to avoid N+1 queries
  const activityIds = [...new Set(data.map((p) => p.activity_id))];
  const userIds = [...new Set(data.map((p) => p.user_id))];

  // Batch fetch all users in one query
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .in("id", userIds);

  const userMap = new Map(
    (users || []).map((u) => [u.id, u as UserProfile]),
  );

  // Batch fetch all activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .in("id", activityIds);

  // Batch fetch all participant records to count them
  const { data: allParticipants } = await supabase
    .from("activity_participants")
    .select("activity_id")
    .in("activity_id", activityIds);

  // Count participants per activity
  const participantCounts = new Map<number | string, number>();
  (allParticipants || []).forEach((p) => {
    participantCounts.set(p.activity_id, (participantCounts.get(p.activity_id) || 0) + 1);
  });

  // Batch fetch categories for all activities
  const { data: activityCategoriesData } = await supabase
    .from("activity_categories")
    .select(
      `
      activity_id,
      category_id,
      categories (
        id,
        name,
        icon,
        color,
        category
      )
    `,
    )
    .in("activity_id", activityIds);

  // Group categories by activity ID
  const categoriesByActivity = new Map<number | string, Category[]>();
  (activityCategoriesData || []).forEach((item: any) => {
    const category = item.categories;
    if (!category) return;

    const activityId = item.activity_id;
    if (!categoriesByActivity.has(activityId)) {
      categoriesByActivity.set(activityId, []);
    }
    categoriesByActivity.get(activityId)!.push({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      category: category.category,
    });
  });

  // Create a map for quick activity lookup
  const activityMap = new Map(
    (activities || []).map((activity) => [activity.id, activity]),
  );

  // Map participation data with fetched information
  const fullInfo = data.map((participation) => {
    const user = userMap.get(participation.user_id);
    const activity = activityMap.get(participation.activity_id);
    const categories = categoriesByActivity.get(participation.activity_id) || [];
    const count = participantCounts.get(participation.activity_id) || 0;

    return {
      userId: user?.id,
      userName: user?.name,
      userAvatar: user?.avatar_path,
      activityId: activity?.id,
      activityTitle: activity?.title,
      activityImage: typeof activity?.image === "string" ? activity?.image : null,
      activityLocation: activity?.location || "",
      activityCategories: categories.map((c) => c?.name || "").filter(Boolean),
      participationDate: participation.created_at,
      activityStatus: activity?.status,
      activityDate: activity?.date,
      activityTime: activity?.time,
      participantCount: count,
    };
  }) as UserParticipationHistory[];

  // Sort by participation date (most recent first)
  return fullInfo.sort(
    (a, b) =>
      new Date(b.participationDate).getTime() -
      new Date(a.participationDate).getTime(),
  );
};

export const getUserParticipationHistory = async (userId: string) => {
  const { data, error } = (await supabase
    .from("activity_participants")
    .select(`*`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })) as {
    data: ActivityParticipantsEntity[];
    error: PostgrestError | null;
  };

  if (error) {
    console.error("Error fetching user participation history:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const user = (await getUserById(userId)) as UserProfile;

  // Collect all unique activity IDs to avoid N+1 queries
  const activityIds = [...new Set(data.map((p) => p.activity_id))];

  // Batch fetch all activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .in("id", activityIds);

  // Batch fetch all participant records to count them
  const { data: allParticipants } = await supabase
    .from("activity_participants")
    .select("activity_id")
    .in("activity_id", activityIds);

  // Count participants per activity
  const participantCounts = new Map<number | string, number>();
  (allParticipants || []).forEach((p) => {
    participantCounts.set(p.activity_id, (participantCounts.get(p.activity_id) || 0) + 1);
  });

  // Batch fetch categories for all activities
  const { data: activityCategoriesData } = await supabase
    .from("activity_categories")
    .select(
      `
      activity_id,
      category_id,
      categories (
        id,
        name,
        icon,
        color,
        category
      )
    `,
    )
    .in("activity_id", activityIds);

  // Group categories by activity ID
  const categoriesByActivity = new Map<number | string, Category[]>();
  (activityCategoriesData || []).forEach((item: any) => {
    const category = item.categories;
    if (!category) return;

    const activityId = item.activity_id;
    if (!categoriesByActivity.has(activityId)) {
      categoriesByActivity.set(activityId, []);
    }
    categoriesByActivity.get(activityId)!.push({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      category: category.category,
    });
  });

  // Create a map for quick activity lookup
  const activityMap = new Map(
    (activities || []).map((activity) => [activity.id, activity]),
  );

  // Map participation data with fetched information
  const fullInfo = data.map((participation) => {
    const activity = activityMap.get(participation.activity_id);
    const categories = categoriesByActivity.get(participation.activity_id) || [];
    const count = participantCounts.get(participation.activity_id) || 0;

    return {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar_path,
      activityId: activity?.id,
      activityTitle: activity?.title,
      activityImage: typeof activity?.image === "string" ? activity?.image : null,
      activityLocation: activity?.location || "",
      activityCategories: categories.map((c) => c?.name || "").filter(Boolean),
      participationDate: participation?.created_at,
      activityStatus: activity?.status,
      activityDate: activity?.date,
      activityTime: activity?.time,
      participantCount: count,
    };
  }) as UserParticipationHistory[];

  return fullInfo;
};
