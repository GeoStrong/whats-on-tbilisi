export type UserProfile = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_path?: string;
  created_at: Date | string;
  additionalInfo?: string;
};

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
  // activityId: string;
  // activityTitle: string;
  // activityImage: string | null;
  // activityLocation: string;
  activityCategories: Partial<Category[]>;
  participationDate: string;
  // activityStatus?: "active" | "inactive" | "pending";
  // activityDate: string;
  // activityTime: string;
  participantCount?: number;
}

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
  googleLocation?: google.maps.LatLngLiteral | null;
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
  createdAt?: Date;
  updatedAt?: Date;
  participants?: ActivityParticipantsEntity[] | null;
  likes?: number;
  dislikes?: number;
}

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

export type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  categoryColor?: string;
  categoryIcon?: string;
};

export type FollowersEntity = {
  user_id: string;
  follower_id: string;
  created_at: Date | string | null;
};

export interface FeedPostEntity {
  id: string;
  user_id: string;
  activity_id: string;
  comment: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface FeedPostWithActivity extends FeedPostEntity {
  activity: ActivityEntity;
  author: UserProfile;
}
