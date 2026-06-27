import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { pool } from "@/lib/db";

/**
 * POST /api/calendly/webhook — Calendly `invitee.created` handler.
 *
 * Signature verification per Calendly's official docs:
 *   header  = "Calendly-Webhook-Signature: t=<timestamp>,v1=<hex-hmac>"
 *   payload = t + "." + rawBody
 *   sig     = HMAC_SHA256(signingKey, payload) as hex
 *   valid   = timingSafeEqual(sig, v1) AND (now - t) <= TOLERANCE_SECONDS
 *
 * Without a configured CALENDLY_WEBHOOK_SIGNING_KEY the route rejects all
 * requests (fail-closed) — no unauthenticated webhook is ever processed.
 */
const TOLERANCE_SECONDS = 180; // 3 minutes — standard replay window
const SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!SIGNING_KEY || !signatureHeader) return false;

  // Parse "t=...,v1=..."
  const parts = new Map<string, string>();
  for (const kv of signatureHeader.split(",")) {
    const [k, v] = kv.split("=");
    if (k && v) parts.set(k.trim(), v.trim());
  }
  const t = parts.get("t");
  const v1 = parts.get("v1");
  if (!t || !v1) return false;

  // Replay protection
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(t));
  if (Number.isNaN(ageSeconds) || ageSeconds > TOLERANCE_SECONDS) return false;

  // Recompute signature
  const expected = createHmac("sha256", SIGNING_KEY)
    .update(`${t}.${rawBody}`)
    .digest("hex");

  // Constant-time compare (lengths must match first)
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  // Raw body is REQUIRED for signature verification — do not .json() first.
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("calendly-webhook-signature");

  if (!verifyCalendlySignature(rawBody, signatureHeader)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { event?: string; payload?: Record<string, unknown> };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Always persist the raw event for audit (idempotent processing later).
  // Best-effort: a DB outage still returns 200 to Calendly (avoids retries
  // for a transient issue), but logs the failure.
  try {
    await pool.query(
      `INSERT INTO webhook_events (source, event_type, payload)
       VALUES ('calendly', $1, $2)`,
      [payload.event ?? "unknown", rawBody],
    );
  } catch (err) {
    console.error("[/api/calendly/webhook] persist failed:", err);
  }

  // On invitee.created, mark the matching lead (by email) as audit_scheduled.
  // The app role has UPDATE on leads, so this is permitted.
  if (payload.event === "invitee.created") {
    const email =
      (payload.payload?.email as string | undefined) ??
      ((payload.payload?.questions_and_answers as { answer?: string }[])?.find(
        (q) => q.answer?.includes("@"),
      )?.answer as string | undefined);

    if (email) {
      try {
        await pool.query(
          `UPDATE leads
             SET status = 'audit_scheduled',
                 last_contact_date = NOW(),
                 audit_scheduled_at = NOW()
           WHERE contact_email = $1`,
          [email.toLowerCase()],
        );
      } catch (err) {
        // Non-fatal — the event is already logged. A missing audit_scheduled_at
        // column would land here; documented for the deploy step.
        console.error("[/api/calendly/webhook] lead update failed:", err);
      }
    }
  }

  // Calendly expects 2xx; it retries on anything else.
  return NextResponse.json({ received: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
