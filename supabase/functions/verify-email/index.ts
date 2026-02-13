import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function jsonResponse(
  body: Record<string, unknown>,
  status: number = 200,
) {
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed" }, 405);
  }

  let token: string | null = null;
  const url = new URL(req.url);
  token = url.searchParams.get("token");

  if (!token && req.method === "POST") {
    try {
      const body = await req.json();
      token = body?.token || null;
    } catch {
      token = null;
    }
  }

  if (!token) {
    return jsonResponse({ ok: false, message: "Missing token" }, 400);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const tokenHash = await sha256Hex(token);

  const { data, error } = await adminClient.rpc("verify_email_token", {
    token_hash: tokenHash,
  });

  if (error) {
    console.error("verify_email_token rpc error:", error);
    return jsonResponse(
      { ok: false, message: "Verification failed", detail: error.message },
      500,
    );
  }

  if (!data) {
    return jsonResponse(
      { ok: false, message: "Invalid or expired token" },
      400,
    );
  }

  return jsonResponse({ ok: true });
});
