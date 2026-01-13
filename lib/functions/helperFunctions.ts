import { CommentEntity, Poi, UserProfile } from "../types";

export const isString = (value: unknown) => {
  return typeof value === "string";
};

export const isFile = (value: unknown) => {
  return value instanceof File;
};

export const isValidImage = (url?: string) => {
  if (!url) return null;

  if (url.endsWith("/")) return null;

  const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
  if (validExtensions.some((ext) => url.toLowerCase().includes(ext)))
    return url;
};

export const zoomToLocation = (map: google.maps.Map | null, location: Poi) => {
  map?.setCenter(location.location);
  map?.setZoom(16);
};

export const handleUploadFile = async (
  folderDestination: string,
  file: File,
  user: UserProfile,
) => {
  if (!user) throw new Error("User ID is required");
  if (!file) throw new Error("No file selected");

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${folderDestination}/${user.id}/${fileName}`;

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: JSON.stringify({ filePath, fileType: file.type }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to request signed URL");
  }

  const { signedUrl } = await res.json();

  // Upload the file directly to the signed URL
  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (process.env.NODE_ENV === "development") {
    try {
      console.debug("handleUploadFile: upload response", {
        filePath,
        status: uploadRes.status,
        statusText: uploadRes.statusText,
      });
    } catch (e) {
      console.error(e);
      // ignore dev-only logging failures
    }
  }

  if (!uploadRes.ok) {
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
  if (typeof document === "undefined" || typeof window === "undefined")
    return "unknown";

  const ref = typeof document.referrer === "string" ? document.referrer : "";

  if (ref.startsWith("android-app://")) return "twa";
  if (
    ref.includes("ios-app") ||
    ref.includes("wkwebview") ||
    ref.includes("safari-view-controller")
  )
    return "twa";

  try {
    const m = (q: string) => window.matchMedia(q).matches;
    if (m("(display-mode: browser)")) return "browser";
    if (m("(display-mode: standalone)")) return "standalone";
    if (m("(display-mode: minimal-ui)")) return "minimal-ui";
    if (m("(display-mode: fullscreen)")) return "fullscreen";
    if (m("(display-mode: window-controls-overlay)"))
      return "window-controls-overlay";
  } catch {
    // ignore matchMedia errors
  }

  if (typeof navigator !== "undefined") {
    const nav = navigator as any;
    if (nav.standalone) return "standalone"; // iOS home-screen PWA
  }

  return "unknown";
};
