import { useCallback, useEffect, useState } from "react";
import type { CommentEntity } from "../types";
import {
  getCommentsByActivityId,
  postComment,
  updateComment,
  deleteComment,
} from "../data/supabaseFunctions";

interface UseCommentsResult {
  comments: CommentEntity[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  addComment: (
    userId: string,
    text: string,
    parent_comment_id?: string | null,
  ) => Promise<CommentEntity | null>;
  editComment: (
    commentId: string,
    userId: string,
    text: string,
  ) => Promise<CommentEntity | null>;
  removeComment: (commentId: string, userId: string) => Promise<void>;
}

const useComments = (
  activityId: string | null | undefined,
): UseCommentsResult => {
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!activityId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCommentsByActivityId(activityId);
      setComments(data as CommentEntity[]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch comments"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addComment = useCallback(
    async (userId: string, text: string, parent_comment_id?: string | null) => {
      if (!activityId) return null;
      try {
        const created = await postComment(
          activityId,
          userId,
          text,
          parent_comment_id,
        );
        setComments((prev) => [...prev, created as CommentEntity]);
        return created as CommentEntity;
      } catch (err) {
        // Diagnostic: log raw error to browser console for easier debugging
        console.error("addComment failed", {
          err,
          payload: { activityId, userId, text, parent_comment_id },
        });
        setError(
          err instanceof Error ? err : new Error("Failed to post comment"),
        );
        return null;
      }
    },
    [activityId],
  );

  const editComment = useCallback(
    async (commentId: string, userId: string, text: string) => {
      try {
        const updated = await updateComment(commentId, userId, text);
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? (updated as CommentEntity) : c,
          ),
        );
        return updated as CommentEntity;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update comment"),
        );
        return null;
      }
    },
    [],
  );

  const removeComment = useCallback(
    async (commentId: string, userId: string) => {
      try {
        await deleteComment(commentId, userId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to delete comment"),
        );
      }
    },
    [],
  );

  return {
    comments,
    isLoading,
    error,
    refresh: fetch,
    addComment,
    editComment,
    removeComment,
  };
};

export default useComments;
