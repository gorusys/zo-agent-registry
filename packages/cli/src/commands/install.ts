import { existsSync, readdirSync, readFileSync, mkdirSync, copyFileSync, writeFileSync, statSync, rmSync } from "fs";
import { join } from "path";
import { Command } from "commander";
import { extractArchive } from "@zo-agent-registry/registry-core";
import type { AgentManifest } from "@zo-agent-registry/manifest-schema";
import { createHash } from "crypto";

const ZOAR_DIR = ".zoar";
const AGENTS_DIR = "agents";
const MAX_DOWNLOAD_SIZE = 50 * 1024 * 1024;

async function downloadUrl(url: string): Promise<Buffer> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_DOWNLOAD_SIZE) throw new Error("Archive exceeds 50MB limit");
  return Buffer.from(buf);
}

function copyDir(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = join(src, e.name);
    const d = join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

export function installCmd(): Command {
  return new Command("install")
    .description("Install an agent template from the registry or from a local file")
    .argument("[agent-slug]", "Agent slug from registry (e.g. daily-research-digest)")
    .option("--from-file <path>", "Install from local archive or folder instead of registry")
    .option("--registry-url <url>", "Registry API base URL", "http://localhost:3001")
    .option("--checksum <hash>", "Expected SHA-256 checksum for archive (verified when installing from registry)")
    .action(async (agentSlug: string | undefined, opts: { fromFile?: string; registryUrl?: string; checksum?: string }) => {
      const cwd = process.cwd();
      const zoarPath = join(cwd, ZOAR_DIR, AGENTS_DIR);
      mkdirSync(zoarPath, { recursive: true });

      if (opts.fromFile) {
        const fromPath = join(process.cwd(), opts.fromFile);
        if (!existsSync(fromPath)) {
          console.error(`Path not found: ${fromPath}`);
          process.exit(1);
        }
        const stat = statSync(fromPath);
        let manifest: AgentManifest;
        let slug: string;
        let version: string;
        if (stat.isDirectory()) {
          const { validateTemplateDir } = await import("@zo-agent-registry/registry-core");
          const validation = validateTemplateDir(fromPath);
          if (!validation.valid || !validation.manifest) {
            console.error("Invalid template:", validation.errors.join("; "));
            process.exit(1);
          }
          manifest = validation.manifest;
          slug = manifest.slug;
          version = manifest.version;
          const dest = join(zoarPath, slug, version);
          mkdirSync(dest, { recursive: true });
          copyDir(fromPath, dest);
        } else {
          const buf = readFileSync(fromPath);
          if (opts.checksum) {
            const actual = createHash("sha256").update(buf).digest("hex");
            if (actual !== opts.checksum) {
              console.error(`Checksum mismatch: expected ${opts.checksum}, got ${actual}`);
              process.exit(1);
            }
          }
          const tempDir = join(cwd, ".zoar", "tmp", `install-${Date.now()}`);
          mkdirSync(tempDir, { recursive: true });
          const tempArchive = join(tempDir, "archive.tar.gz");
          writeFileSync(tempArchive, buf);
          manifest = await extractArchive(tempArchive, tempDir);
          slug = manifest.slug;
          version = manifest.version;
          const dest = join(zoarPath, slug, version);
          mkdirSync(dest, { recursive: true });
          const { readdirSync: rd, copyFileSync: cp } = await import("fs");
          for (const name of rd(tempDir)) {
            if (name === "archive.tar.gz") continue;
            const s = join(tempDir, name);
            const d = join(dest, name);
            if (statSync(s).isDirectory()) copyDir(s, d);
            else cp(s, d);
          }
          rmSync(tempDir, { recursive: true });
        }
        const receiptPath = join(zoarPath, slug, version, ".zoar-receipt.json");
        writeFileSync(
          receiptPath,
          JSON.stringify(
            {
              slug,
              version,
              installedAt: new Date().toISOString(),
              source: "file",
              from: opts.fromFile,
            },
            null,
            2
          )
        );
        console.log(`Installed ${slug}@${version} to ${ZOAR_DIR}/${AGENTS_DIR}/${slug}/${version}`);
        console.log("Next steps: cd into that directory, copy .env.example to .env, then run your executor with the prompt and manifest.");
        return;
      }

      if (!agentSlug) {
        console.error("Either provide an agent slug or use --from-file <path>");
        process.exit(1);
      }

      const baseUrl = (opts.registryUrl ?? "http://localhost:3001").replace(/\/$/, "");
      const metaRes = await fetch(`${baseUrl}/api/v1/agents/${agentSlug}`);
      if (!metaRes.ok) {
        console.error(`Agent not found or registry error: ${metaRes.status}`);
        process.exit(1);
      }
      const meta = (await metaRes.json()) as { slug: string; latestVersion?: string; versions?: { version: string; archiveUrl?: string; checksum?: string }[] };
      const version = meta.latestVersion ?? meta.versions?.[0]?.version;
      if (!version) {
        console.error("No version found for agent");
        process.exit(1);
      }
      const verRes = await fetch(`${baseUrl}/api/v1/agents/${agentSlug}/versions`);
      const verList = (await verRes.json()) as { version: string; archiveUrl?: string; checksum?: string }[];
      const verMeta = verList.find((v) => v.version === version);
      const archiveUrl = verMeta?.archiveUrl ?? `${baseUrl}/api/v1/agents/${agentSlug}/versions/${version}/archive`;
      const archiveBuf = await downloadUrl(archiveUrl);
      const checksum = createHash("sha256").update(archiveBuf).digest("hex");
      if (verMeta?.checksum && verMeta.checksum !== checksum) {
        console.error(`Checksum mismatch: expected ${verMeta.checksum}, got ${checksum}`);
        process.exit(1);
      }
      if (opts.checksum && opts.checksum !== checksum) {
        console.error(`Checksum mismatch: expected ${opts.checksum}, got ${checksum}`);
        process.exit(1);
      }
      const tempDir = join(cwd, ZOAR_DIR, "tmp", `install-${Date.now()}`);
      mkdirSync(tempDir, { recursive: true });
      const tempArchive = join(tempDir, "archive.tar.gz");
      writeFileSync(tempArchive, archiveBuf);
      const manifest = await extractArchive(tempArchive, tempDir);
      const dest = join(zoarPath, manifest.slug, manifest.version);
      mkdirSync(dest, { recursive: true });
      const { readdirSync: rd, copyFileSync: cp } = await import("fs");
      for (const name of rd(tempDir)) {
        if (name === "archive.tar.gz") continue;
        const s = join(tempDir, name);
        const d = join(dest, name);
        if (statSync(s).isDirectory()) copyDir(s, d);
        else cp(s, d);
      }
      rmSync(tempDir, { recursive: true });
      const receiptPath = join(dest, ".zoar-receipt.json");
      writeFileSync(
        receiptPath,
        JSON.stringify(
          {
            slug: manifest.slug,
            version: manifest.version,
            installedAt: new Date().toISOString(),
            source: "registry",
            registryUrl: baseUrl,
            checksum,
          },
          null,
          2
        )
      );
      console.log(`Installed ${manifest.slug}@${manifest.version} to ${ZOAR_DIR}/${AGENTS_DIR}/${manifest.slug}/${manifest.version}`);
      console.log("Next steps: cd into that directory, copy .env.example to .env, then run your executor.");
    });
}
