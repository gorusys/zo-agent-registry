import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestId } from "@/lib/request-id";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

function isAdmin(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  return token.length > 0 && (ADMIN_TOKEN === "" ? false : token === ADMIN_TOKEN);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: { status: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json({ error: "status must be approved or rejected" }, { status: 400 });
  }

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submission.status !== "pending") {
    return NextResponse.json({ error: "Submission already reviewed" }, { status: 400 });
  }

  const requestId = getRequestId();
  const payload = submission.payload as { manifest?: Record<string, unknown> };
  const manifest = payload?.manifest;
  if (!manifest || typeof manifest !== "object") {
    return NextResponse.json({ error: "Invalid submission payload" }, { status: 400 });
  }

  const slug = manifest.slug as string;
  const version = manifest.version as string;
  if (!slug || !version) {
    return NextResponse.json({ error: "Manifest missing slug or version" }, { status: 400 });
  }

  await prisma.submission.update({
    where: { id },
    data: { status: body.status, reason: body.reason ?? null, reviewedAt: new Date() },
  });

  if (body.status === "approved") {
    let agent = await prisma.agent.findUnique({ where: { slug } });
    if (!agent) {
      agent = await prisma.agent.create({
        data: { slug, publishedAt: new Date() },
      });
    } else {
      await prisma.agent.update({
        where: { id: agent.id },
        data: { publishedAt: new Date() },
      });
    }
    const existingVersion = await prisma.agentVersion.findUnique({
      where: { agentId_version: { agentId: agent.id, version } },
    });
    if (!existingVersion) {
      await prisma.agentVersion.create({
        data: {
          agentId: agent.id,
          version,
          manifest: manifest as object,
          checksum: null,
        },
      });
    }
    const tags = (manifest.tags as string[] | undefined) ?? [];
    await prisma.agentTag.deleteMany({ where: { agentId: agent.id } });
    for (const tag of tags) {
      await prisma.agentTag.create({ data: { agentId: agent!.id, tag } });
    }
    await prisma.auditLog.create({
      data: {
        action: "submission.approved",
        resource: "Submission",
        resourceId: id,
        details: { slug, version },
        requestId,
      },
    });
  } else {
    await prisma.auditLog.create({
      data: {
        action: "submission.rejected",
        resource: "Submission",
        resourceId: id,
        details: { reason: body.reason },
        requestId,
      },
    });
  }

  return NextResponse.json({ ok: true, status: body.status });
}
