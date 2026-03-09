import { existsSync, readFileSync, statSync } from "fs";
import { join, dirname } from "path";
import { Command } from "commander";
import { validateTemplateDir, validateManifestOnly } from "@zo-agent-registry/registry-core";

const MANIFEST_FILE = "agent.manifest.json";

export function validateCmd(): Command {
  return new Command("validate")
    .description("Validate an agent template directory or manifest file")
    .argument("[path]", "Path to template directory or agent.manifest.json", ".")
    .action((pathArg: string) => {
      const resolved = join(process.cwd(), pathArg);
      if (!existsSync(resolved)) {
        console.error(`Path not found: ${resolved}`);
        process.exit(1);
      }
      let dirPath: string;
      const stat = statSync(resolved);
      if (stat.isFile()) {
        if (!resolved.endsWith(MANIFEST_FILE)) {
          console.error("When path is a file, it must be agent.manifest.json");
          process.exit(1);
        }
        dirPath = dirname(resolved);
        const raw = JSON.parse(readFileSync(resolved, "utf-8")) as unknown;
        const result = validateManifestOnly(raw);
        if (result.valid) {
          console.log("Manifest is valid.");
          return;
        }
        console.error("Validation failed:");
        result.errors.forEach((e) => console.error("  -", e));
        process.exit(1);
      } else {
        dirPath = resolved;
      }
      const result = validateTemplateDir(dirPath);
      if (result.valid) {
        console.log("Template is valid.");
        if (result.manifest) {
          console.log(`  slug: ${result.manifest.slug}, version: ${result.manifest.version}`);
        }
        return;
      }
      console.error("Validation failed:");
      result.errors.forEach((e) => console.error("  -", e));
      process.exit(1);
    });
}
