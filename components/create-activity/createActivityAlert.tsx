"use client";

import React, { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { useCreateFeedPost } from "@/lib/hooks/useFeedPosts";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateActivityAlertProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  isActivityCreated: boolean;
  activityId?: string;
  activityTitle?: string;
  handleCloseDrawer?: () => void;
}

const CreateActivityAlert: React.FC<CreateActivityAlertProps> = ({
  buttonRef,
  isActivityCreated,
  activityId,
  activityTitle,
  handleCloseDrawer,
}) => {
  const router = useRouter();
  const { user } = useGetUserProfile();
  const [postComment, setPostComment] = useState("");

  const createdOnLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  const createPostMutation = useCreateFeedPost(user!);

  const handleGoToFeed = async () => {
    if (handleCloseDrawer) handleCloseDrawer();

    if (!activityId || !user) {
      router.push("/");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        activityId,
        comment: postComment,
      });
    } catch (error: any) {
      // Ignore unique-constraint errors (already posted), log others
      if (error?.code !== "23505") {
        console.error("Error creating automatic feed post:", error);
      }
    } finally {
      router.push("/");
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger ref={buttonRef} className="hidden">
          Open
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActivityCreated
                ? "You created Activity!"
                : "You updated Activity"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActivityCreated
                ? "You have successfully created an Activity 🎉. It will be shared to your feed with a small label and an optional comment."
                : "You have successfully updated an Activity 🎉. You can also share this update to your feed with an optional comment."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {activityId && (
            <div className="space-y-2 py-2">
              <p className="text-sm text-muted-foreground">
                A post will be created like:
              </p>
              <div className="rounded-md bg-muted p-2 text-sm">
                <p className="font-semibold">
                  {activityTitle || "New activity"}
                </p>
                <p>
                  {isActivityCreated
                    ? `Created this activity on ${createdOnLabel}.`
                    : `Updated this activity on ${createdOnLabel}.`}
                </p>
              </div>
              <div className="space-y-1">
                <label htmlFor="post-comment" className="text-sm font-medium">
                  Add a post comment (optional)
                </label>
                <Textarea
                  id="post-comment"
                  value={postComment}
                  onChange={(e) => setPostComment(e.target.value)}
                  placeholder="Share a few words about this activity..."
                  className="min-h-[80px]"
                  disabled={createPostMutation.isPending}
                />
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogAction asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={handleGoToFeed}
                disabled={createPostMutation.isPending || !activityId}
              >
                {createPostMutation.isPending || !activityId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting to feed...
                  </>
                ) : (
                  "Go to Feed"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default CreateActivityAlert;
