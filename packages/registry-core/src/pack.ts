import { readFileSync, mkdirSync, statSync, readdirSync } from "fs";
import { join, resolve, relative } from "path";
import { createHash } from "crypto";
import * as tar from "tar";
import type { AgentManifest } from "@zo-agent-registry/manifest-schema";
import { validateTemplateDir } from "./validator.js";

const MANIFEST_FILENAME = "agent.manifest.json";

export interface PackResult {
  path: string;
  checksum: string;
  size: number;
}

/**
 * List all files to include in pack (deterministic order). Excludes .git and node_modules.
 */
function listPackFiles(dirPath: string, base = ""): string[] {
  const entries: string[] = [];
  const fullDir = base ? join(dirPath, base) : dirPath;
  const items = readdirSync(fullDir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === ".git" || item.name === "node_modules") continue;
    const rel = base ? `${base}/${item.name}` : item.name;
    if (item.isDirectory()) {
      entries.push(...listPackFiles(dirPath, rel));
    } else {
      entries.push(rel);
    }
  }
  entries.sort();
  return entries;
}

/**
 * Create a deterministic tar.gz archive of the template directory.
 */
export async function packTemplate(dirPath: string, outPath: string): Promise<PackResult> {
  const validation = validateTemplateDir(dirPath);
  if (!validation.valid || !validation.manifest) {
    throw new Error(`Template validation failed: ${validation.errors.join("; ")}`);
  }

  const gzipPath = outPath.endsWith(".gz") ? outPath : `${outPath}.gz`;
  const files = listPackFiles(dirPath);

  await tar.create(
    {
      gzip: true,
      file: gzipPath,
      cwd: dirPath,
      portable: true,
      noMtime: true,
    },
    files
  );

  const archiveBuffer = readFileSync(gzipPath);
  const checksum = createHash("sha256").update(archiveBuffer).digest("hex");

  return {
    path: gzipPath,
    checksum,
    size: archiveBuffer.length,
  };
}

/**
 * Extract archive into destDir with zip-slip prevention. Returns manifest.
 */
export async function extractArchive(archivePath: string, destDir: string): Promise<AgentManifest> {
  const stat = statSync(archivePath);
  if (stat.size > 50 * 1024 * 1024) {
    throw new Error("Archive exceeds 50MB limit");
  }

  const realDest = join(destDir);
  mkdirSync(realDest, { recursive: true });

  await tar.x({
    file: archivePath,
    cwd: realDest,
    strip: 0,
    onentry: (entry) => {
      const name = (entry.path ?? "").replace(/\\/g, "/");
      const resolved = resolve(realDest, name);
      const rel = relative(realDest, resolved);
      if (rel.startsWith("..") || rel.includes("..")) {
        throw new Error(`Path traversal blocked: ${name}`);
      }
    },
  });

  const manifestPath = join(realDest, MANIFEST_FILENAME);
  const manifestContent = readFileSync(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestContent) as AgentManifest;
  return manifest;
}
