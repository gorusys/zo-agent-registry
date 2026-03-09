import { describe, it, expect } from "vitest";
import { validateTemplateDir } from "@zo-agent-registry/registry-core";
import { join } from "path";

describe("validate", () => {
  it("validates real template daily-research-digest", () => {
    const templatesDir = join(process.cwd(), "..", "..", "templates");
    const result = validateTemplateDir(join(templatesDir, "daily-research-digest"));
    expect(result.valid).toBe(true);
    expect(result.manifest?.slug).toBe("daily-research-digest");
  });
});
