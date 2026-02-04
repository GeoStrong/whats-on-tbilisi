"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCheckActivityPosted,
  useCreateFeedPost,
} from "@/lib/hooks/useFeedPosts";
import PostToFeedDialog from "@/components/feed/PostToFeedDialog";
import { Loader2, Share2 } from "lucide-react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";

interface PostToFeedButtonProps {
  activityId: string;
  activityTitle?: string;
}

const PostToFeedButton: React.FC<PostToFeedButtonProps> = ({
  activityId,
  activityTitle,
}) => {
  const { user } = useGetUserProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: existingPost, isLoading } = useCheckActivityPosted(
    user!,
    activityId,
  );
  useCreateFeedPost(user!);

  const handlePost = async () => {
    if (existingPost) {
      alert("This activity has already been posted to your feed.");
      return;
    }
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (existingPost) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Share2 className="mr-2 h-4 w-4" />
        Already Posted
      </Button>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handlePost}>
        <Share2 className="mr-2 h-4 w-4" />
        Post to Feed
      </Button>
      <PostToFeedDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activityId={activityId}
        activityTitle={activityTitle}
      />
    </>
  );
};

export default PostToFeedButton;
