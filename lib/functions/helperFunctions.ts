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
  if (typeof window === "undefined") return "unknown";

  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const ref = typeof document !== "undefined" ? document.referrer || "" : "";

  // Dev-only debug output to help refine heuristics
  if (process.env.NODE_ENV === "development") {
    try {
      // eslint-disable-next-line no-console
      console.debug("[getPWADisplayMode] ua:", ua, "ref:", ref);
    } catch {}
  }

  // Android Trusted Web Activity explicit referrer
  if (ref.startsWith("android-app://")) return "twa";

  // Heuristic: some iOS wrappers embed indicators in referrer
  if (/ios-app|wkwebview|safari-view-controller|applewebdata/i.test(ref)) {
    return "twa";
  }

  // iOS home-screen PWA (legacy Safari API)
  if (typeof navigator !== "undefined" && (navigator as any).standalone)
    return "standalone";

  // Prefer explicit display-mode matches first
  try {
    const m = (q: string) => window.matchMedia(q).matches;
    if (m("(display-mode: standalone)")) return "standalone";
    if (m("(display-mode: minimal-ui)")) return "minimal-ui";
    if (m("(display-mode: fullscreen)")) return "fullscreen";
    if (m("(display-mode: window-controls-overlay)"))
      return "window-controls-overlay";
  } catch {
    // ignore matchMedia errors
  }

  // Known in-app browser signatures -> mark as in-app (not a regular browser)
  const inAppIndicators = [
    "FBAN",
    "FBAV",
    "Instagram",
    "Twitter",
    "LinkedInApp",
    "Line",
    "Pinterest",
    "GSA",
    "MicroMessenger",
    "WhatsApp",
  ];
  if (inAppIndicators.some((i) => ua.includes(i))) return "in-app";

  // Heuristic for iOS webviews (SFSafariViewController / WKWebView)
  if (/iphone|ipad|ipod/i.test(ua)) {
    // If UA mentions Safari but not Version/ (common in SFSafariViewController), treat as in-app
    if (/Safari/i.test(ua) && !/Version\//i.test(ua) && /Mobile/i.test(ua))
      return "in-app";
  }

  // Fallback: explicit browser display-mode
  try {
    if (window.matchMedia("(display-mode: browser)").matches) return "browser";
  } catch {}

  return "unknown";
};
