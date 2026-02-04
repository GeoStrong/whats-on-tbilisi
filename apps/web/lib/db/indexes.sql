-- Database indexes for performance optimization
-- Run these migrations in your Supabase SQL editor

-- Activities table indexes
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_updated_at ON activities(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);

-- Followers table indexes
CREATE INDEX IF NOT EXISTS idx_followers_user_id ON followers(user_id);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_created_at ON followers(created_at DESC);
-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_followers_user_follower ON followers(user_id, follower_id);

-- Activity categories table indexes
CREATE INDEX IF NOT EXISTS idx_activity_categories_activity_id ON activity_categories(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_categories_category_id ON activity_categories(category_id);
-- Composite index for join queries
CREATE INDEX IF NOT EXISTS idx_activity_categories_composite ON activity_categories(category_id, activity_id);

-- Activity participants table indexes
CREATE INDEX IF NOT EXISTS idx_activity_participants_activity_id ON activity_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_participants_user_id ON activity_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_participants_created_at ON activity_participants(created_at DESC);

-- Activity comments table indexes
CREATE INDEX IF NOT EXISTS idx_activity_comments_activity_id ON activity_comments(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_comments_user_id ON activity_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_comments_parent_id ON activity_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_activity_comments_created_at ON activity_comments(created_at ASC);

-- Saved activities table indexes
CREATE INDEX IF NOT EXISTS idx_saved_activities_user_id ON saved_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_activities_activity_id ON saved_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_saved_activities_created_at ON saved_activities(created_at DESC);

-- Users table indexes (if not already present)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

