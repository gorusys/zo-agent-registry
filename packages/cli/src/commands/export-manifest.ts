import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Command } from "commander";

const MANIFEST_FILE = "agent.manifest.json";

export function exportManifestCmd(): Command {
  return new Command("export-manifest")
    .description("Export agent.manifest.json from a template directory to a given path")
    .argument("<path>", "Path to template directory")
    .option("-o, --output <path>", "Output path for manifest JSON (default: stdout)")
    .action((pathArg: string, opts: { output?: string }) => {
      const resolved = join(process.cwd(), pathArg);
      if (!existsSync(resolved)) {
        console.error(`Path not found: ${resolved}`);
        process.exit(1);
      }
      const manifestPath = join(resolved, MANIFEST_FILE);
      if (!existsSync(manifestPath)) {
        console.error(`No ${MANIFEST_FILE} in ${resolved}`);
        process.exit(1);
      }
      const content = readFileSync(manifestPath, "utf-8");
      if (opts.output) {
        const outPath = join(process.cwd(), opts.output);
        writeFileSync(outPath, content);
        console.log(`Exported to ${outPath}`);
      } else {
        process.stdout.write(content);
      }
    });
}
