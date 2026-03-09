import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  const where: { publishedAt: { not: null }; slug?: { contains: string; mode: "insensitive" }; tags?: { some: { tag: string } } } = {
    publishedAt: { not: null },
  };
  if (q) where.slug = { contains: q, mode: "insensitive" };
  if (tag) where.tags = { some: { tag } };

  const agents = await prisma.agent.findMany({
    where,
    include: {
      versions: { orderBy: { createdAt: "desc" }, take: 1 },
      tags: true,
    },
  });

  const list = agents.map((a: (typeof agents)[number]) => {
    const v = a.versions[0];
    const m = (v?.manifest ?? {}) as Record<string, unknown>;
    const compat = m.compatibility as { zoFriendly?: boolean } | undefined;
    return {
      slug: a.slug,
      name: m.name ?? a.slug,
      summary: m.summary ?? "",
      version: v?.version ?? "0.0.0",
      category: m.category ?? null,
      tags: a.tags.map((t: { tag: string }) => t.tag),
      publishedAt: a.publishedAt?.toISOString() ?? null,
      zoFriendly: compat?.zoFriendly ?? false,
    };
  });

  let filtered = list;
  if (category) filtered = list.filter((a) => a.category === category);

  return NextResponse.json(filtered);
}
