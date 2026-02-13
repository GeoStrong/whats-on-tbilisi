import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = (Deno.env.get("RESEND_API_KEY") || "").trim();
const RESEND_FROM = (Deno.env.get("RESEND_FROM") || "").trim();
const SITE_URL = (Deno.env.get("SITE_URL") || "").replace(/\/+$/, "");
const RESEND_DEV_ALLOWLIST = Deno.env.get("RESEND_DEV_ALLOWLIST") || "";

const RESET_REQUESTS_PER_EMAIL_PER_HOUR = 3;
const RESET_REQUESTS_PER_IP_PER_HOUR = 20;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

const devAllowlist = RESEND_DEV_ALLOWLIST.split(",")
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

function jsonResponse(body: Record<string, unknown>, status: number = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (!forwardedFor) return "";
  return forwardedFor.split(",")[0].trim();
}

async function sendResetEmail(recipientEmail: string, resetLink: string) {
  const recipient = recipientEmail.toLowerCase();

  if (
    RESEND_FROM.toLowerCase().endsWith("@resend.dev") &&
    devAllowlist.length === 0
  ) {
    return;
  }

  if (devAllowlist.length > 0 && !devAllowlist.includes(recipient)) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": await sha256Hex(`${recipientEmail}:${resetLink}`),
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [recipientEmail],
      subject: "Reset your password",
      html: `<div style="margin:0;padding:0;background-color:#eef2ff;color:#1e293b;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#eef2ff;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:20px;box-shadow:0 16px 32px rgba(99,102,241,0.25);overflow:hidden;border:none;">
                <tr>
                  <td style="padding:28px 36px;background:linear-gradient(90deg,#6366f1 0%,#8b5cf6 100%);color:#fff;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight:900;font-size:24px;letter-spacing:-0.02em;text-align:center;">
                    WhatsOnTbilisi
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 36px 40px 36px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;text-align:center;">
                    <p style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#1e293b;">Reset your password</p>
                    <p style="margin:0 0 28px 0;font-size:16px;line-height:1.6;color:#475569;">
                      We received a request to reset your password. Click below to create a new password.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px auto;">
                      <tr>
                        <td align="center" bgcolor="#6366f1" style="border-radius:14px; box-shadow:0 6px 10px rgba(131,114,255,0.3);">
                          <a href="${resetLink}" style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius:14px; background: linear-gradient(90deg, #6366f1, #8b5cf6); transition:background 0.3s ease; box-shadow: 0 6px 10px rgba(131, 114, 255, 0.3);">
                            Reset password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 10px 0;font-size:12px;color:#64748b;">This link expires in 1 hour. If the button doesn't work, copy and paste this link:</p>
                    <p style="margin:0 0 28px 0;font-size:12px;color:#6366f1;word-break:break-word;background:#f4f6ff;padding:14px 18px;border-radius:12px;user-select:all;font-family:monospace;">
                      ${resetLink}
                    </p>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">
                      If you didn't request a password reset, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 36px 24px 36px;border-top:1px solid #e0e7ff;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-size:11px;color:#94a3b8;text-align:center;">
                    Sent by WhatsOnTbilisi
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>`,
    }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed" }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ ok: false, message: "Server not configured" }, 500);
  }

  if (!RESEND_API_KEY || !RESEND_FROM || !SITE_URL) {
    return jsonResponse({ ok: true, message: GENERIC_MESSAGE }, 200);
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email || "")
      .trim()
      .toLowerCase();
  } catch {
    return jsonResponse({ ok: true, message: GENERIC_MESSAGE }, 200);
  }

  if (!email || !isValidEmail(email)) {
    return jsonResponse({ ok: true, message: GENERIC_MESSAGE }, 200);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const ip = getClientIp(req);

  const emailHash = await sha256Hex(email);
  const ipHash = ip ? await sha256Hex(ip) : null;
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count: emailCount } = await adminClient
    .from("password_reset_requests")
    .select("id", { count: "exact", head: true })
    .eq("email_hash", emailHash)
    .gte("created_at", hourAgo);

  let ipCount = 0;
  if (ipHash) {
    const { count } = await adminClient
      .from("password_reset_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", hourAgo);
    ipCount = count || 0;
  }

  await adminClient.from("password_reset_requests").insert({
    email_hash: emailHash,
    ip_hash: ipHash,
  });

  const isRateLimited =
    (emailCount || 0) >= RESET_REQUESTS_PER_EMAIL_PER_HOUR ||
    ipCount >= RESET_REQUESTS_PER_IP_PER_HOUR;

  if (isRateLimited) {
    return jsonResponse({ ok: true, message: GENERIC_MESSAGE }, 200);
  }

  const { data: authUserRows, error: authUserError } = await adminClient.rpc(
    "get_auth_user_for_password_reset",
    { p_email: email },
  );

  if (authUserError || !authUserRows || authUserRows.length === 0) {
    return jsonResponse({ ok: true, message: GENERIC_MESSAGE }, 200);
  }

  const authUser = authUserRows[0];

  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const token = base64UrlEncode(tokenBytes);
  const tokenHash = await sha256Hex(token);

  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

  await adminClient
    .from("password_reset_tokens")
    .update({ consumed_at: new Date().toISOString() })
    .eq("user_id", authUser.user_id)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString());

  await adminClient.from("password_reset_tokens").insert({
    user_id: authUser.user_id,
    token_hash: tokenHash,
    sent_to_email: authUser.user_email,
    expires_at: expiresAt,
  });

  const resetLink = `${SITE_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await sendResetEmail(authUser.user_email, resetLink);

  return jsonResponse({ ok: true, message: GENERIC_MESSAGE }, 200);
});
