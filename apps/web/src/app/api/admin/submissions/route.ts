import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

function isAdmin(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  return token.length > 0 && (ADMIN_TOKEN === "" ? false : token === ADMIN_TOKEN);
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = await prisma.submission.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(submissions);
}
