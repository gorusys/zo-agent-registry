import { readFileSync, statSync, readdirSync } from "fs";
import { join, normalize, relative } from "path";
import { createHash } from "crypto";
import type { AgentManifest } from "@zo-agent-registry/manifest-schema";
import { validateManifest } from "@zo-agent-registry/manifest-schema";

const MANIFEST_FILENAME = "agent.manifest.json";
const REQUIRED_FILES = [MANIFEST_FILENAME, "prompt.md", "README.md"];

export interface ValidateTemplateResult {
  valid: boolean;
  manifest?: AgentManifest;
  errors: string[];
}

export function validateTemplateDir(dirPath: string): ValidateTemplateResult {
  const errors: string[] = [];

  let manifestRaw: unknown;
  try {
    const manifestPath = join(dirPath, MANIFEST_FILENAME);
    const content = readFileSync(manifestPath, "utf-8");
    manifestRaw = JSON.parse(content) as unknown;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to read or parse ${MANIFEST_FILENAME}: ${msg}`);
    return { valid: false, errors };
  }

  const validation = validateManifest(manifestRaw);
  if (!validation.success) {
    for (const e of validation.errors) {
      const path = e.path.join(".");
      errors.push(`${path}: ${e.message}`);
    }
    return { valid: false, errors };
  }

  const manifest = validation.data;

  for (const file of REQUIRED_FILES) {
    if (file === MANIFEST_FILENAME) continue;
    const fullPath = join(dirPath, file);
    try {
      statSync(fullPath);
    } catch {
      errors.push(`Missing required file: ${file}`);
    }
  }

  if (manifest.files) {
    for (const ref of manifest.files) {
      const fullPath = join(dirPath, ref.path);
      try {
        statSync(fullPath);
      } catch {
        errors.push(`Declared file not found: ${ref.path}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    manifest,
    errors,
  };
}

export function validateManifestOnly(data: unknown): ValidateTemplateResult {
  const validation = validateManifest(data);
  if (validation.success) {
    return { valid: true, manifest: validation.data, errors: [] };
  }
  const errors = validation.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
  return { valid: false, errors };
}

/**
 * Compute SHA-256 checksum of a directory for reproducible packs.
 * Order: sort all relative paths, then hash manifest first, then each file in sorted order.
 */
export function computeDirChecksum(dirPath: string, _manifest: AgentManifest): string {
  const hash = createHash("sha256");
  const manifestPath = join(dirPath, MANIFEST_FILENAME);
  const manifestContent = readFileSync(manifestPath, "utf-8");
  const normalizedManifest = JSON.stringify(JSON.parse(manifestContent), null, 0);
  hash.update("agent.manifest.json\0", "utf-8");
  hash.update(normalizedManifest, "utf-8");
  hash.update("\n", "utf-8");

  const entries: string[] = [];
  function walk(dir: string, base: string): void {
    const items = readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name === MANIFEST_FILENAME) continue;
      const rel = base ? `${base}/${item.name}` : item.name;
      const full = join(dir, item.name);
      if (item.isDirectory()) {
        walk(full, rel);
      } else {
        entries.push(rel);
      }
    }
  }
  walk(dirPath, "");
  entries.sort();

  for (const rel of entries) {
    const full = join(dirPath, rel);
    const content = readFileSync(full);
    hash.update(rel + "\0", "utf-8");
    hash.update(content);
    hash.update("\n", "utf-8");
  }

  return hash.digest("hex");
}

export function computeBufferChecksum(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

/**
 * Normalize path to prevent zip-slip: resolve to realpath and ensure it's under basePath.
 */
export function safeJoin(basePath: string, ...segments: string[]): string | null {
  const resolved = normalize(join(basePath, ...segments));
  const base = normalize(basePath);
  const rel = relative(base, resolved);
  if (rel.startsWith("..") || rel.includes("..")) {
    return null;
  }
  return resolved;
}

export { type AgentManifest };
