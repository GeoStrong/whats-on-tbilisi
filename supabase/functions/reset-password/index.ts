import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = (Deno.env.get("RESEND_API_KEY") || "").trim();
const RESEND_FROM = (Deno.env.get("RESEND_FROM") || "").trim();
const RESEND_DEV_ALLOWLIST = Deno.env.get("RESEND_DEV_ALLOWLIST") || "";
const SUPPORT_EMAIL = "support@whatson-tbilisi.giorgijobava.tech";
const MIN_PASSWORD_LENGTH = 8;

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

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function formatUtcTimestamp(isoDate: string) {
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

async function sendPasswordChangedEmail(
  recipientEmail: string,
  changedAt: string,
) {
  if (!RESEND_API_KEY || !RESEND_FROM) {
    return;
  }

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

  const formattedTimestamp = formatUtcTimestamp(changedAt);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": await sha256Hex(
        `${recipientEmail}:${changedAt}:password-changed`,
      ),
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [recipientEmail],
      subject: "Your password was changed successfully",
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
                    <p style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#1e293b;">Password changed</p>
                    <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;color:#475569;">
                      Your password was changed successfully.
                    </p>
                    <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:#64748b;">
                      Time: ${formattedTimestamp}
                    </p>
                    <p style="margin:0;font-size:13px;color:#475569;">
                      If this wasn't you, please contact support immediately at
                      <a href="mailto:${SUPPORT_EMAIL}" style="color:#6366f1;text-decoration:none;"> ${SUPPORT_EMAIL}</a>.
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

  let token = "";
  let password = "";
  let confirmPassword = "";

  try {
    const body = await req.json();
    token = String(body?.token || "").trim();
    password = String(body?.password || "");
    confirmPassword = String(body?.confirmPassword || "");
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request body" }, 400);
  }

  if (!token) {
    return jsonResponse({ ok: false, message: "Missing reset token" }, 400);
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return jsonResponse(
      {
        ok: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      },
      400,
    );
  }

  if (confirmPassword && password !== confirmPassword) {
    return jsonResponse({ ok: false, message: "Passwords do not match" }, 400);
  }

  const tokenHash = await sha256Hex(token);
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: consumedRows, error: consumeError } = await adminClient.rpc(
    "consume_password_reset_token",
    { p_token_hash: tokenHash },
  );

  if (consumeError || !consumedRows || consumedRows.length === 0) {
    return jsonResponse(
      { ok: false, message: "Invalid or expired reset token" },
      400,
    );
  }

  const consumedToken = consumedRows[0];
  const changedAt = new Date().toISOString();

  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    consumedToken.user_id,
    {
      password,
    },
  );

  if (updateError) {
    return jsonResponse(
      {
        ok: false,
        message:
          "Unable to update password right now. Please request a new reset link.",
      },
      500,
    );
  }

  await sendPasswordChangedEmail(consumedToken.sent_to_email, changedAt);

  return jsonResponse({ ok: true }, 200);
});
