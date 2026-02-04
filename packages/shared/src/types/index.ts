// Core user types
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_path?: string;
  created_at: Date | string;
  additionalInfo?: string;
};

// Activity categories
export type ActivityCategories =
  | "music"
  | "sport"
  | "theater"
  | "marathon"
  | "tournament"
  | "conference"
  | "exhibition"
  | "festival"
  | "party"
  | "protest"
  | "discussion"
  | "hiking"
  | "coding"
  | "seminar"
  | "training"
  | "concert"
  | "movie"
  | "lottery"
  | "workshop"
  | "other";

export type ImageType = string | File | null;

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: ActivityCategories;
}

// Activity participants
export interface ActivityParticipantsEntity {
  user_id: string;
  activity_id: string;
  additional_info?: string;
  created_at: Date | string;
}

export interface UserParticipationHistory {
  userId: string;
  userName: string;
  userAvatar: string | undefined;
  activity: ActivityEntity;
  activityCategories: Partial<Category[]>;
  participationDate: string;
  participantCount?: number;
}

// Platform-agnostic location type
export interface LatLngLiteral {
  lat: number;
  lng: number;
}

// Activity entity (core)
export interface ActivityEntity {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  date: Date | string | null;
  time: Date | string;
  endTime: Date | string | null;
  endDate?: Date | string | null;
  recurringDays?: string[] | null;
  location: string;
  googleLocation?: LatLngLiteral | null;
  categories?: ActivityCategories[] | string[];
  targetAudience?: string | null;
  host?: "organization" | "individual";
  entryFee?: boolean;
  hostName?: string;
  hostContact?: {
    email?: string;
    phone?: string;
    name: string;
    image?: string;
  };
  image: ImageType;
  link?: string | null;
  maxAttendees?: number | null;
  tags?: string[];
  maxTags?: 10;
  comments?: string[];
  rating?: number;
  reviews?: string[];
  status?: "active" | "inactive" | "pending";
  created_at?: Date | string;
  updated_at?: Date | string;
  participants?: ActivityParticipantsEntity[] | null;
  likes?: number;
  dislikes?: number;
  featured?: boolean;
}

// Comment entity
export interface CommentEntity {
  id: string;
  activity_id: string;
  user_id: string;
  text: string;
  created_at: Date | string | null;
  updated_at?: Date | string | null;
  parent_comment_id?: string | null;
}

export type NewActivityEntity = Omit<ActivityEntity, "id">;

export interface SavedActivityEntity {
  user_id: string;
  activity_id: string;
}

// Point of interest (for maps)
export type Poi = {
  key: string;
  location: LatLngLiteral;
  categoryColor?: string;
  categoryIcon?: string;
};

// Followers
export type FollowersEntity = {
  user_id: string;
  follower_id: string;
  created_at: Date | string | null;
};

// Feed posts
export interface FeedPostEntity {
  id: string;
  user_id: string;
  activity_id: string;
  comment: string | null;
  isUpdatedPost: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface FeedPostWithActivity extends FeedPostEntity {
  activity: ActivityEntity;
  author: UserProfile;
}

// Native file type for React Native image picking
export interface NativeFile {
  uri: string;
  name?: string;
  type?: string;
}

// Auth types
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
