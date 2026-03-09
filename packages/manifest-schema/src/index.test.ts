import { describe, it, expect } from "vitest";
import { validateManifest } from "./index.js";

describe("manifest schema", () => {
  it("validates minimal manifest", () => {
    const result = validateManifest({
      schemaVersion: "1.0",
      slug: "my-agent",
      name: "My Agent",
      summary: "Does something",
      description: "Longer description here.",
      version: "1.0.0",
      authors: [{ name: "Author" }],
      license: "Apache-2.0",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bad slug", () => {
    const result = validateManifest({
      schemaVersion: "1.0",
      slug: "UPPERCASE",
      name: "X",
      summary: "S",
      description: "D",
      version: "1.0.0",
      authors: [{ name: "A" }],
      license: "MIT",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid version", () => {
    const result = validateManifest({
      schemaVersion: "1.0",
      slug: "x",
      name: "X",
      summary: "S",
      description: "D",
      version: "not-semver",
      authors: [{ name: "A" }],
      license: "MIT",
    });
    expect(result.success).toBe(false);
  });
});
