// Minimal JSON Schema matching our zod schema for documentation and external validation.
// that matches our zod schema for documentation and external validation.
const jsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://zo-agent-registry.dev/schemas/agent.manifest.v1.json",
  title: "Agent Manifest",
  description: "Schema for zo-agent-registry agent templates",
  type: "object",
  required: ["schemaVersion", "slug", "name", "summary", "description", "version", "authors", "license"],
  properties: {
    schemaVersion: { type: "string", const: "1.0" },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", minLength: 1, maxLength: 100 },
    name: { type: "string", minLength: 1, maxLength: 200 },
    summary: { type: "string", minLength: 1, maxLength: 500 },
    description: { type: "string", minLength: 1 },
    version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9.-]+)?(\\+[a-zA-Z0-9.-]+)?$" },
    authors: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 200 },
          email: { type: "string", format: "email" },
          url: { type: "string", format: "uri" },
        },
      },
    },
    homepage: { type: "string", format: "uri" },
    repository: { type: "string", format: "uri" },
    license: { type: "string", minLength: 1, maxLength: 100 },
    tags: { type: "array", items: { type: "string", minLength: 1, maxLength: 50 } },
    category: {
      type: "string",
      enum: ["research", "monitoring", "digest", "personal-ops", "developer-productivity", "other"],
    },
    capabilities: { type: "array", items: { type: "string", minLength: 1, maxLength: 100 } },
    inputs: { type: "object" },
    outputs: { type: "object" },
    env: {
      type: "array",
      items: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          required: { type: "boolean" },
          secret: { type: "boolean" },
          example: { type: "string" },
        },
      },
    },
    schedule: { type: "array", items: { type: "object" } },
    files: { type: "array", items: { type: "object" } },
    examples: { type: "array", items: { type: "object" } },
    safety: { type: "array", items: { type: "object" } },
    compatibility: { type: "object" },
    installation: { type: "object" },
    execution: { type: "object" },
    changelog: { type: "array", items: { type: "object" } },
    checksum: { type: "string" },
  },
};

export function getJsonSchema(): Record<string, unknown> {
  return jsonSchema;
}
