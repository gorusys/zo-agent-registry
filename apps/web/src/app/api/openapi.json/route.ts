import { NextResponse } from "next/server";
import { getJsonSchema } from "@zo-agent-registry/manifest-schema";

export async function GET() {
  const schema = getJsonSchema();
  const openapi = {
    openapi: "3.0.0",
    info: { title: "Zo Agent Registry API", version: "1.0.0" },
    paths: {
      "/api/v1/agents": {
        get: {
          summary: "List agents",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "tag", in: "query", schema: { type: "string" } },
          ],
          responses: { "200": { description: "List of agents" } },
        },
      },
      "/api/v1/agents/{slug}": {
        get: {
          summary: "Get agent",
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Agent detail" }, "404": { description: "Not found" } },
        },
      },
      "/api/v1/agents/{slug}/versions": {
        get: {
          summary: "List versions",
          parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Version list" } },
        },
      },
      "/api/v1/submissions": {
        post: {
          summary: "Submit template",
          requestBody: { content: { "application/json": { schema: { type: "object", properties: { manifest: schema } } } } },
          responses: { "200": { description: "Submission created" }, "400": { description: "Validation failed" } },
        },
      },
      "/api/v1/tags": { get: { summary: "List tags", responses: { "200": { description: "Tag list" } } } },
      "/api/v1/health": { get: { summary: "Liveness", responses: { "200": { description: "OK" } } } },
      "/api/v1/ready": { get: { summary: "Readiness", responses: { "200": { description: "Ready" }, "503": { description: "Not ready" } } } },
    },
  };
  return NextResponse.json(openapi);
}
