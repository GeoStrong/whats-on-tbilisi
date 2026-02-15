"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FeedPostWithActivity, UserProfile } from "@/lib/types";
import UserAvatar from "../users/userAvatar";
import ActivityEngagement from "../activity/activityEngagement";
import { Button } from "../ui/button";
import { useDeleteFeedPost, useUpdateFeedPost } from "@/lib/hooks/useFeedPosts";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { FaRegComment } from "react-icons/fa";
import ActivityComments from "../activity/activityComments";
import FeedActivityCard from "./FeedActivityCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useTranslation } from "react-i18next";

interface FeedPostProps {
  user: UserProfile | null;
  post: FeedPostWithActivity;
}

const FeedPost: React.FC<FeedPostProps> = ({ user, post }) => {
  const userId = useMemo(() => user?.id, [user?.id]);
  const deletePostMutation = useDeleteFeedPost(user!);
  const updatePostMutation = useUpdateFeedPost(user!);
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(post.comment || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { t } = useTranslation(["feed", "errors", "common"]);

  const isOwnPost = useMemo(
    () => userId === post.user_id,
    [userId, post.user_id],
  );

  const postComment = useMemo(() => post.comment || "", [post.comment]);

  useEffect(() => {
    if (!isEditing) {
      setEditComment(postComment);
    }
  }, [postComment, isEditing]);

  const handleDelete = useCallback(async () => {
    try {
      await deletePostMutation.mutateAsync(post.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(t("errors:errorDeletingPost"), error);
    }
  }, [deletePostMutation, post.id, t]);

  const handleSaveEdit = useCallback(async () => {
    try {
      await updatePostMutation.mutateAsync({
        postId: post.id,
        comment: editComment.trim() || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(t("errors:errorUpdatingPost"), error);
    }
  }, [updatePostMutation, post.id, editComment, t]);

  const handleCancelEdit = useCallback(() => {
    setEditComment(postComment);
    setIsEditing(false);
  }, [postComment]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const formattedDate = useMemo(() => {
    const activityDate = post.created_at;

    if (!activityDate) return;

    const date = new Date(activityDate);

    const isUpdated = post.isUpdatedPost;

    return `${isUpdated ? t("feed:updatedAt") : t("feed:createdAt")} ${date.toLocaleDateString(
      "ka-GE",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    )}`;
  }, [post.created_at, post.isUpdatedPost, t]);

  return (
    <div className="border-b bg-card p-2 pb-4 dark:border-slate-700 dark:bg-slate-800 md:p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar avatarPath={post.author?.avatar_path} size={12} />
          <div>
            <p className="font-semibold">{post.author?.name}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        {isOwnPost && (
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartEdit}
                  className="h-8 w-8 p-0"
                  aria-label="Edit post"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="h-8 w-8 p-0 text-destructive"
                  aria-label="Delete post"
                  disabled={deletePostMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-4 space-y-2">
          <Textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={updatePostMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              {t("common:actions:cancel")}
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={updatePostMutation.isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              {t("common:actions:save")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {postComment && (
            <div className="mb-4 rounded-lg bg-muted p-3">
              <p className="leading-relaxed">{postComment}</p>
            </div>
          )}
          <FeedActivityCard activity={post.activity} />
        </>
      )}

      <div className="flex items-center justify-between px-4 pt-4">
        <ActivityEngagement
          user={user!}
          activityId={post.activity?.id}
          activityLikes={post.activity?.likes || 0}
          activityDislikes={post.activity?.dislikes || 0}
        />
        {post.activity && (
          <ActivityComments
            user={user}
            activity={post.activity}
            customIcon={<FaRegComment className="text-xl" />}
          />
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("feed:postDelete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("feed:postDelete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePostMutation.isPending}>
              {t("common:actions:cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePostMutation.isPending
                ? t("common:actions:loading")
                : t("common:actions:delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeedPost;
