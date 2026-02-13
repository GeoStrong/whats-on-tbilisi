import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = (Deno.env.get("RESEND_API_KEY") || "").trim();
const RESEND_FROM = (Deno.env.get("RESEND_FROM") || "").trim();
const SITE_URL = (Deno.env.get("SITE_URL") || "").replace(/\/+$/, "");
const RESEND_DEV_ALLOWLIST = Deno.env.get("RESEND_DEV_ALLOWLIST") || "";

const devAllowlist = RESEND_DEV_ALLOWLIST.split(",")
  .map((email) => email.trim().toLowerCase())
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ ok: false, message: "Missing authorization" }, 401);
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user || !user.email) {
    return jsonResponse({ ok: false, message: "Unauthorized" }, 401);
  }

  if (!RESEND_API_KEY) {
    return jsonResponse(
      { ok: false, message: "RESEND_API_KEY is not configured" },
      500,
    );
  }

  if (!RESEND_FROM) {
    return jsonResponse(
      { ok: false, message: "RESEND_FROM is not configured" },
      500,
    );
  }

  if (!SITE_URL) {
    return jsonResponse(
      { ok: false, message: "SITE_URL is not configured" },
      500,
    );
  }

  const { data: profile, error: profileError } = await adminClient
    .from("users")
    .select("email_verified_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return jsonResponse(
      { ok: false, message: "Failed to check user status" },
      500,
    );
  }

  if (profile?.email_verified_at) {
    return jsonResponse({ ok: true, message: "Already verified" }, 200);
  }

  const now = new Date();
  const minuteAgo = new Date(now.getTime() - 60 * 1000).toISOString();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { count: lastMinuteCount, error: minuteError } = await adminClient
    .from("email_verification_tokens")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", minuteAgo);

  if (minuteError) {
    return jsonResponse({ ok: false, message: "Rate limit check failed" }, 500);
  }

  if (lastMinuteCount && lastMinuteCount > 0) {
    return jsonResponse(
      { ok: false, message: "Please wait before requesting another email." },
      429,
    );
  }

  const { count: lastDayCount, error: dayError } = await adminClient
    .from("email_verification_tokens")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", dayAgo);

  if (dayError) {
    return jsonResponse({ ok: false, message: "Rate limit check failed" }, 500);
  }

  if (lastDayCount && lastDayCount >= 5) {
    return jsonResponse(
      { ok: false, message: "Daily verification email limit reached." },
      429,
    );
  }

  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const token = base64UrlEncode(tokenBytes);
  const tokenHash = await sha256Hex(token);

  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await adminClient
    .from("email_verification_tokens")
    .insert({
      user_id: user.id,
      token_hash: tokenHash,
      sent_to_email: user.email,
      expires_at: expiresAt,
    });

  if (insertError) {
    return jsonResponse(
      { ok: false, message: "Failed to create verification token" },
      500,
    );
  }

  const recipient = user.email.toLowerCase();

  if (
    RESEND_FROM.toLowerCase().endsWith("@resend.dev") &&
    devAllowlist.length === 0
  ) {
    return jsonResponse(
      {
        ok: false,
        message:
          "Dev mode: set RESEND_DEV_ALLOWLIST to your Resend account email.",
      },
      400,
    );
  }

  if (devAllowlist.length > 0 && !devAllowlist.includes(recipient)) {
    return jsonResponse(
      {
        ok: false,
        message: "Recipient not allowed by RESEND_DEV_ALLOWLIST.",
      },
      400,
    );
  }

  const verifyLink = `${SITE_URL}/auth/verify?token=${encodeURIComponent(token)}`;

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [user.email],
      subject: "Verify your email",
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
                    <p style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#1e293b;">Verify your email</p>
                    <p style="margin:0 0 28px 0;font-size:16px;line-height:1.6;color:#475569;">
                      Welcome! Please confirm your email address to finish setting up your account.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px auto;">
                      <tr>
                        <td align="center" bgcolor="#6366f1" style="border-radius:14px; box-shadow:0 6px 10px rgba(131,114,255,0.3);">
                          <a href="${verifyLink}" style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius:14px; background: linear-gradient(90deg, #6366f1, #8b5cf6); transition:background 0.3s ease; box-shadow: 0 6px 10px rgba(131, 114, 255, 0.3);">
                            Verify email
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 10px 0;font-size:12px;color:#64748b;">Or copy and paste this link into your browser:</p>
                    <p style="margin:0 0 28px 0;font-size:12px;color:#6366f1;word-break:break-word;background:#f4f6ff;padding:14px 18px;border-radius:12px;user-select:all;font-family:monospace;">
                      ${verifyLink}
                    </p>
                    <p style="margin:0;font-size:12px;color:#94a3b8;">
                      If you did not create this account, you can safely ignore this email.
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
      </div>
      `,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    console.error("Resend error:", errorText);
    return jsonResponse(
      { ok: false, message: "Failed to send verification email" },
      502,
    );
  }

  return jsonResponse({ ok: true });
});
