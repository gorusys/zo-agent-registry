import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateManifestPayload } from "@/lib/validate";
import { getRequestId } from "@/lib/request-id";

const SUBMISSION_RATE_LIMIT = 10;
const windowMs = 60 * 1000;
const recentSubmissions: { ip: string; at: number }[] = [];

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;
  const filtered = recentSubmissions.filter((r) => r.ip === ip && r.at > cutoff);
  if (filtered.length >= SUBMISSION_RATE_LIMIT) return false;
  recentSubmissions.push({ ip, at: now });
  while (recentSubmissions.length > 1000) recentSubmissions.shift();
  return true;
}

export async function POST(request: NextRequest) {
  const requestId = getRequestId();
  if (!checkRateLimit(getClientIp(request))) {
    return NextResponse.json(
      { error: "Too many submissions; try again later" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = typeof body === "object" && body !== null && "manifest" in body ? (body as { manifest: unknown }).manifest : body;
  const validation = validateManifestPayload(raw);
  if (!validation.ok) {
    return NextResponse.json({ error: "Validation failed", errors: validation.errors }, { status: 400 });
  }

  const slug = validation.manifest.slug;
  const existing = await prisma.agent.findUnique({ where: { slug } });
  const submission = await prisma.submission.create({
    data: {
      status: "pending",
      payload: JSON.parse(JSON.stringify({ manifest: validation.manifest })),
      requestId,
      agentId: existing?.id ?? undefined,
    },
  });

  await prisma.auditLog.create({
    data: { action: "submission.create", resource: "Submission", resourceId: submission.id, requestId },
  });

  return NextResponse.json({ id: submission.id, status: "pending" });
}
