import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.agentTag.findMany({
    where: { agent: { publishedAt: { not: null } } },
    select: { tag: true },
    distinct: ["tag"],
    orderBy: { tag: "asc" },
  });
  const tags = rows.map((r: { tag: string }) => r.tag);
  return NextResponse.json(tags);
}
