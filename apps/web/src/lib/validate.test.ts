import { describe, it, expect } from "vitest";
import { validateManifestPayload } from "@/lib/validate";

describe("validateManifestPayload", () => {
  it("accepts valid manifest", () => {
    const result = validateManifestPayload({
      schemaVersion: "1.0",
      slug: "test-agent",
      name: "Test",
      summary: "A test agent",
      description: "Long description",
      version: "1.0.0",
      authors: [{ name: "Me" }],
      license: "Apache-2.0",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.manifest.slug).toBe("test-agent");
  });

  it("rejects invalid slug", () => {
    const result = validateManifestPayload({
      schemaVersion: "1.0",
      slug: "Invalid_Slug",
      name: "Test",
      summary: "A test",
      description: "Desc",
      version: "1.0.0",
      authors: [{ name: "Me" }],
      license: "Apache-2.0",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects missing required", () => {
    const result = validateManifestPayload({
      schemaVersion: "1.0",
      slug: "test",
      name: "Test",
      summary: "S",
      description: "D",
      version: "1.0.0",
      authors: [],
      license: "MIT",
    });
    expect(result.ok).toBe(false);
  });
});
