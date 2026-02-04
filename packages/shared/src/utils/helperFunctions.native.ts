import * as FileSystem from "expo-file-system";
import { CommentEntity, Poi, UserProfile, NativeFile } from "../types";
import { apiFetch } from "../api/apiFetch";
import { mapActions } from "../store/mapSlice";
import type { Dispatch } from "@reduxjs/toolkit";

export const isString = (value: unknown) => {
  return typeof value === "string";
};

export const isFile = (value: unknown): value is NativeFile => {
  return !!value && typeof value === "object" && "uri" in (value as NativeFile);
};

export const isValidImage = (url?: string) => {
  if (!url) return null;
  if (url.endsWith("/")) return null;
  const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  if (validExtensions.some((ext) => url.toLowerCase().includes(ext)))
    return url;
};

export const zoomToLocation = (location: Poi, dispatch: Dispatch) => {
  dispatch(mapActions.setCenter(location.location));
  dispatch(mapActions.setZoom(16));
};

const makeRandomId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const handleUploadFile = async (
  folderDestination: string,
  file: NativeFile,
  user: UserProfile,
) => {
  if (!user) throw new Error("User ID is required");
  if (!file?.uri) throw new Error("No file selected");

  const fileExt = file.name?.split(".").pop() || "bin";
  const fileName = `${makeRandomId()}.${fileExt}`;
  const filePath = `${folderDestination}/${user.id}/${fileName}`;

  const res = await apiFetch("/api/upload-image", {
    method: "POST",
    body: JSON.stringify({
      filePath,
      fileType: file.type || "application/octet-stream",
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to request signed URL");
  }

  const { signedUrl } = await res.json();

  const uploadRes = await FileSystem.uploadAsync(signedUrl, file.uri, {
    httpMethod: "PUT",
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });

  if (uploadRes.status < 200 || uploadRes.status >= 300) {
    throw new Error("File upload to R2 failed");
  }

  return filePath;
};

const isCommentDescendant = (
  all: CommentEntity[],
  comment: CommentEntity,
  rootId: string,
): boolean => {
  let current = comment;
  while (current.parent_comment_id) {
    const parent = all.find((c) => c.id === current.parent_comment_id);
    if (!parent) return false;
    if (parent.id === rootId) return true;
    current = parent;
  }
  return false;
};

export const groupCommentsOneLevel = (comments: CommentEntity[]) => {
  const roots = comments.filter((c) => !c.parent_comment_id);

  return roots.map((root) => {
    const replies = comments.filter(
      (c) =>
        c.parent_comment_id === root.id ||
        isCommentDescendant(comments, c, root.id),
    );

    return { root, replies };
  });
};

export const getPWADisplayMode = () => {
  return "native";
};

export const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
