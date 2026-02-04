"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFeedPost } from "@/lib/hooks/useFeedPosts";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";

interface PostToFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityId: string;
  activityTitle?: string;
}

const PostToFeedDialog: React.FC<PostToFeedDialogProps> = ({
  open,
  onOpenChange,
  activityId,
  activityTitle,
}) => {
  const { user } = useGetUserProfile();
  const [comment, setComment] = useState("");
  const createPostMutation = useCreateFeedPost(user!);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPostMutation.mutateAsync({
        activityId,
        comment: comment.trim() || null,
      });
      setComment("");
      onOpenChange(false);
    } catch (error: any) {
      // Handle error - check if it's a unique constraint violation
      if (error?.code === "23505") {
        toast("This activity has already been posted to your feed.");
      } else {
        console.error("Error creating post:", error);
        toast("Failed to post activity. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Activity to Feed</DialogTitle>
          <DialogDescription>
            {activityTitle
              ? `Share "${activityTitle}" with your followers`
              : "Share this activity with your followers"}
            . Add an optional comment to personalize your post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="comment" className="text-sm font-medium">
                Comment (optional)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What do you think about this activity?"
                className="mt-2 min-h-[100px]"
                disabled={createPostMutation.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createPostMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPostMutation.isPending}>
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post to Feed"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostToFeedDialog;
