import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

const TEMPLATES_DIR = join(process.cwd(), "..", "..", "templates");
const SLUGS = [
  "daily-research-digest",
  "github-trending-monitor",
  "competitor-watch",
  "inbox-summary",
  "changelog-watcher",
];

async function main() {
  for (const slug of SLUGS) {
    const manifestPath = join(TEMPLATES_DIR, slug, "agent.manifest.json");
    let manifest: Record<string, unknown>;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
    } catch (err) {
      console.warn(`Skip ${slug}: ${err}`);
      continue;
    }

    const tags = (manifest.tags as string[] | undefined) ?? [];
    const version = (manifest.version as string) ?? "1.0.0";

    const agent = await prisma.agent.upsert({
      where: { slug },
      create: { slug, publishedAt: new Date() },
      update: { publishedAt: new Date() },
    });

    await prisma.agentVersion.upsert({
      where: { agentId_version: { agentId: agent.id, version } },
      create: { agentId: agent.id, version, manifest: manifest as object, checksum: null },
      update: { manifest: manifest as object },
    });

    await prisma.agentTag.deleteMany({ where: { agentId: agent.id } });
    for (const tag of tags) {
      await prisma.agentTag.create({ data: { agentId: agent.id, tag } });
    }
    console.log(`Seeded ${slug}@${version}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
