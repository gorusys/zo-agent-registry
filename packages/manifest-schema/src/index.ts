import { z } from "zod";

const authorSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  url: z.string().url().optional(),
});

const inputOutputSchema = z.object({
  description: z.string().optional(),
  schema: z.record(z.unknown()).optional(),
  required: z.array(z.string()).optional(),
});

const envVarSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  required: z.boolean().optional(),
  secret: z.boolean().optional(),
  example: z.string().optional(),
});

const scheduleSuggestionSchema = z.object({
  cron: z.string().optional(),
  interval: z.string().optional(),
  description: z.string().optional(),
});

const fileRefSchema = z.object({
  path: z.string().min(1).max(500),
  description: z.string().optional(),
});

const exampleSchema = z.object({
  name: z.string().min(1).max(200),
  path: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  output: z.unknown().optional(),
});

const safetyNoteSchema = z.object({
  category: z.string().min(1).max(100),
  description: z.string().min(1),
});

const compatibilitySchema = z.object({
  zoFriendly: z.boolean().optional(),
  minZoVersion: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const installationSchema = z.object({
  steps: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

const executionSchema = z.object({
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
  env: z.record(z.string()).optional(),
  workingDir: z.string().optional(),
  notes: z.string().optional(),
});

const changelogEntrySchema = z.object({
  version: z.string(),
  date: z.string().optional(),
  changes: z.array(z.string()),
});

export const agentManifestSchema = z.object({
  schemaVersion: z.literal("1.0"),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  description: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/),
  authors: z.array(authorSchema).min(1),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  license: z.string().min(1).max(100),
  tags: z.array(z.string().min(1).max(50)).optional(),
  category: z
    .enum([
      "research",
      "monitoring",
      "digest",
      "personal-ops",
      "developer-productivity",
      "other",
    ])
    .optional(),
  capabilities: z.array(z.string().min(1).max(100)).optional(),
  inputs: inputOutputSchema.optional(),
  outputs: inputOutputSchema.optional(),
  env: z.array(envVarSchema).optional(),
  schedule: z.array(scheduleSuggestionSchema).optional(),
  files: z.array(fileRefSchema).optional(),
  examples: z.array(exampleSchema).optional(),
  safety: z.array(safetyNoteSchema).optional(),
  compatibility: compatibilitySchema.optional(),
  installation: installationSchema.optional(),
  execution: executionSchema.optional(),
  changelog: z.array(changelogEntrySchema).optional(),
  checksum: z.string().optional(),
});

export type AgentManifest = z.infer<typeof agentManifestSchema>;
export type Author = z.infer<typeof authorSchema>;
export type InputOutput = z.infer<typeof inputOutputSchema>;
export type EnvVar = z.infer<typeof envVarSchema>;
export type ScheduleSuggestion = z.infer<typeof scheduleSuggestionSchema>;
export type FileRef = z.infer<typeof fileRefSchema>;
export type Example = z.infer<typeof exampleSchema>;
export type SafetyNote = z.infer<typeof safetyNoteSchema>;
export type Compatibility = z.infer<typeof compatibilitySchema>;
export type Installation = z.infer<typeof installationSchema>;
export type Execution = z.infer<typeof executionSchema>;
export type ChangelogEntry = z.infer<typeof changelogEntrySchema>;

export function validateManifest(data: unknown): { success: true; data: AgentManifest } | { success: false; errors: z.ZodError["errors"] } {
  const result = agentManifestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors };
}

export function parseManifest(data: unknown): AgentManifest {
  return agentManifestSchema.parse(data);
}

export { getJsonSchema } from "./json-schema.js";
