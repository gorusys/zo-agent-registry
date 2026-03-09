import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { join } from "path";
import { readFileSync, existsSync, mkdirSync, rmSync } from "fs";

const TEMPLATES_DIR = process.env.TEMPLATES_DIR ?? join(process.cwd(), "..", "..", "templates");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; version: string }> }
) {
  const { slug, version } = await params;
  const agent = await prisma.agent.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { versions: true },
  });
  if (!agent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const ver = agent.versions.find((v: { version: string }) => v.version === version);
  if (!ver) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const templatePath = join(TEMPLATES_DIR, slug);
  if (!existsSync(templatePath)) {
    return NextResponse.json(
      { error: "Archive not available (template files not found)" },
      { status: 404 }
    );
  }

  const { packTemplate } = await import("@zo-agent-registry/registry-core");
  const tmpDir = join(process.cwd(), "tmp", `archive-${Date.now()}`);
  const outPath = join(tmpDir, `${slug}-${version}.tar.gz`);
  mkdirSync(tmpDir, { recursive: true });
  try {
    const result = await packTemplate(templatePath, outPath);
    const buf = readFileSync(outPath);
    rmSync(tmpDir, { recursive: true });
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="${slug}-${version}.tar.gz"`,
        "X-Checksum-SHA256": result.checksum,
      },
    });
  } catch (err) {
    try {
      rmSync(tmpDir, { recursive: true });
    } catch {
      // ignore
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Pack failed" },
      { status: 500 }
    );
  }
}
