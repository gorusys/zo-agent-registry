import { describe, it, expect } from "vitest";
import { validateTemplateDir, safeJoin, computeBufferChecksum } from "./index";

describe("validator", () => {
  it("safeJoin blocks path traversal", () => {
    expect(safeJoin("/tmp/base", "..", "etc", "passwd")).toBe(null);
    expect(safeJoin("/tmp/base", "sub", "file")).not.toBe(null);
  });

  it("computeBufferChecksum returns hex string", () => {
    const hash = computeBufferChecksum(Buffer.from("hello"));
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("validateTemplateDir", () => {
  it("returns errors for missing dir", () => {
    const result = validateTemplateDir("/nonexistent-path-xyz");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
