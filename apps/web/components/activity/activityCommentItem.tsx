import { BiDotsVerticalRounded } from "react-icons/bi";
import { CommentEntity, UserProfile } from "@/lib/types";
import React, { useEffect, useState } from "react";
import defaultUserImg from "@/public/images/default-user.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import { fetchUserInfo } from "@/lib/profile/profile";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import Link from "next/link";

interface ActivityCommentItemProps {
  activityHostId: string;
  comment: CommentEntity;
  isReply?: boolean;
  onEdit?: (commentId: string, text: string) => void;
  onDelete?: (commentId: string) => void;
  onReplyTo?: (commentId: string, username?: string) => void;
}

const ActivityCommentItem: React.FC<ActivityCommentItemProps> = ({
  activityHostId,
  comment,
  isReply,
  onEdit,
  onDelete,
  onReplyTo,
}) => {
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const { user: currentUser } = useGetUserProfile();

  useEffect(() => {
    (async () => {
      const profile = await fetchUserInfo(comment.user_id);
      setProfile(profile);
    })();
  }, [comment.user_id]);

  const { imageUrl: avatarUrl } = useOptimizedImage(
    profile?.avatar_path || "",
    {
      quality: 50,
      width: 18,
      height: 18,
      fallback: defaultUserImg.src,
    },
  );

  const commentFormattedDate =
    comment.created_at &&
    new Date().getFullYear() === new Date(comment.created_at).getFullYear()
      ? new Date(comment.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : new Date(comment?.created_at || "").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

  return (
    <div className="flex items-start gap-3">
      <Link href={`/users/${comment.user_id}`}>
        <OptimizedImage
          src={avatarUrl}
          quality={50}
          width={18}
          height={18}
          alt="profile"
          priority={false}
          objectFit="cover"
          containerClassName={`${isReply ? "h-7 w-7" : "h-8 w-8"} rounded-full`}
        />
      </Link>

      <div className="w-[90%] rounded-md text-left md:w-[90%]">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <Link href={`/users/${comment.user_id}`}>
              <h4
                className={`text-base ${isReply ? "font-semibold" : "font-bold"}`}
              >
                {profile?.name || "User"}
                <span className="pl-2 text-xs font-light text-gray-600 dark:text-gray-400">
                  {commentFormattedDate}
                  {activityHostId === comment.user_id && (
                    <span className="ml-2 rounded-xl border px-2 text-xs font-light text-gray-600 dark:border-gray-400 dark:text-gray-400">
                      Author
                    </span>
                  )}
                </span>
              </h4>
            </Link>

            <p className="text-base">{comment.text}</p>
          </div>
          {currentUser?.id === comment.user_id && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BiDotsVerticalRounded />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-gray-700">
                <DropdownMenuLabel className="hidden">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    if (onEdit) onEdit(comment.id, comment.text);
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (onDelete) onDelete(comment.id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <button
          className="mt-1 text-base text-gray-600 dark:text-gray-400"
          onClick={() => onReplyTo && onReplyTo(comment.id, profile?.name)}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ActivityCommentItem;
