"use client";

import { Calendar, Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserProfile } from "@/lib/types";
import defaultUserImg from "@/public/images/default-user.png";
import { handleUploadUserAvatar } from "@/lib/profile/profile";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  deleteImageFromStorage,
  getImageUrl,
} from "@/lib/functions/supabaseFunctions";
import OptimizedImage from "../ui/optimizedImage";
import UsersRealtimeFollows from "../users/usersRealtimeFollows";

interface ProfileHeaderProps {
  user: UserProfile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      setUploading(true);

      if (!user) throw new Error("Not signed in");

      if (avatarUrl !== "") {
        await deleteImageFromStorage(`${user.avatar_path}`, user.id);
      }

      const uploadedUrl = await handleUploadUserAvatar(user, file);

      setAvatarUrl(uploadedUrl);
      setPreviewUrl(null);
      toast.success("New profile image has been set");
    } catch (err) {
      console.error("Error uploading avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const image = await getImageUrl(user?.avatar_path || "");
      setAvatarUrl(image || "");
    })();
  }, [user]);

  return (
    <>
      <Card className="w-full dark:bg-gray-800 md:w-1/2">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Avatar className="h-32 w-32 border dark:border-gray-600">
                  <Dialog>
                    <DialogTrigger>
                      <AvatarImage
                        src={previewUrl || avatarUrl || defaultUserImg.src}
                        alt={user?.name}
                        className="object-cover"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Your Profile Picture
                        </DialogTitle>
                        <DialogDescription>
                          <OptimizedImage
                            src={previewUrl || avatarUrl || defaultUserImg.src}
                            width={100}
                            height={100}
                            alt="profile"
                            quality={50}
                            priority={true}
                            objectFit="cover"
                            objectPosition="center"
                            containerClassName="h-full w-full"
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </Avatar>

                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full"
                  disabled={uploading}
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-base">
              <div className="space-y-2">
                <h2 className="text-lg">{user?.name}</h2>
                {user && (
                  <div className="w-full">
                    <UsersRealtimeFollows
                      userId={user.id}
                      userName={user.name}
                    />
                  </div>
                )}

                {user && <p className="text-muted-foreground">{user.email}</p>}
              </div>

              {user?.additionalInfo && (
                <p className="text-muted-foreground">{user?.additionalInfo}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-base">
                    Joined{" "}
                    {user?.created_at &&
                      new Date(user?.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileHeader;
