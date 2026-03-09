import { validateManifest, type AgentManifest } from "@zo-agent-registry/manifest-schema";

export function validateManifestPayload(data: unknown): { ok: true; manifest: AgentManifest } | { ok: false; errors: string[] } {
  const result = validateManifest(data);
  if (result.success) return { ok: true, manifest: result.data };
  const errors = result.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
  return { ok: false, errors };
}
