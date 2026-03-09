import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VERCEL_URL ?? "http://localhost:3001";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const agent = await prisma.agent.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { versions: { orderBy: { createdAt: "desc" } } },
  });
  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const base = BASE_URL.startsWith("http") ? BASE_URL : `https://${BASE_URL}`;
  const versions = agent.versions.map((v: { version: string; checksum: string | null; createdAt: Date }) => ({
    version: v.version,
    checksum: v.checksum,
    archiveUrl: `${base}/api/v1/agents/${slug}/versions/${v.version}/archive`,
    createdAt: v.createdAt,
  }));
  return NextResponse.json(versions);
}
