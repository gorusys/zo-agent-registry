import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Command } from "commander";
import { packTemplate } from "@zo-agent-registry/registry-core";

export function packCmd(): Command {
  return new Command("pack")
    .description("Pack an agent template into a deterministic tar.gz archive")
    .argument("<path>", "Path to template directory")
    .option("-o, --output <path>", "Output path for archive (default: <slug>-<version>.tar.gz in cwd)")
    .action(async (pathArg: string, opts: { output?: string }) => {
      const resolved = join(process.cwd(), pathArg);
      if (!existsSync(resolved)) {
        console.error(`Path not found: ${resolved}`);
        process.exit(1);
      }
      const { validateTemplateDir } = await import("@zo-agent-registry/registry-core");
      const validation = validateTemplateDir(resolved);
      if (!validation.valid || !validation.manifest) {
        console.error("Template validation failed:", validation.errors.join("; "));
        process.exit(1);
      }
      const { slug, version } = validation.manifest;
      const outPath = opts.output
        ? join(process.cwd(), opts.output)
        : join(process.cwd(), `${slug}-${version}.tar.gz`);
      const outDir = join(outPath, "..");
      mkdirSync(outDir, { recursive: true });
      const result = await packTemplate(resolved, outPath);
      console.log(`Packed to ${result.path}`);
      console.log(`Checksum: ${result.checksum}`);
      console.log(`Size: ${result.size} bytes`);
    });
}
