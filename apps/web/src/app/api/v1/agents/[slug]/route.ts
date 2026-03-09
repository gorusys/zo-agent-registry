import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const agent = await prisma.agent.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: {
      versions: { orderBy: { createdAt: "desc" } },
      tags: true,
    },
  });
  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const latest = agent.versions[0];
  const manifest = latest?.manifest as Record<string, unknown> | null;
  return NextResponse.json({
    slug: agent.slug,
    latestVersion: latest?.version ?? null,
    manifest: manifest ?? null,
    tags: agent.tags.map((t: { tag: string }) => t.tag),
    versions: agent.versions.map((v: { version: string; checksum: string | null; createdAt: Date }) => ({ version: v.version, checksum: v.checksum, createdAt: v.createdAt })),
  });
}
