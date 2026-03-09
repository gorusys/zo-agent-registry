import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { Command } from "commander";

const ZOAR_DIR = ".zoar";
const AGENTS_DIR = "agents";
const NODE_VERSION = process.version;

export function doctorCmd(): Command {
  return new Command("doctor")
    .description("Check environment and .zoar setup")
    .action(() => {
      const cwd = process.cwd();
      const zoarPath = join(cwd, ZOAR_DIR);
      const agentsPath = join(zoarPath, AGENTS_DIR);
      let ok = true;

      console.log("Node version:", NODE_VERSION);
      const major = parseInt(NODE_VERSION.slice(1).split(".")[0] ?? "0", 10);
      if (major >= 22) {
        console.log("  OK (22+ recommended)");
      } else {
        console.log("  Warning: Node 22+ recommended");
        ok = false;
      }

      if (existsSync(zoarPath)) {
        console.log(".zoar directory: present");
        if (existsSync(agentsPath)) {
          const count = readdirSync(agentsPath, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
          console.log(`  Installed agents: ${count}`);
        } else {
          console.log("  agents/ missing (run zoar init)");
          ok = false;
        }
      } else {
        console.log(".zoar directory: not found (run zoar init)");
        ok = false;
      }

      try {
        require.resolve("@zo-agent-registry/manifest-schema");
        console.log("manifest-schema: resolved");
      } catch {
        console.log("manifest-schema: not found (run pnpm install in repo)");
        ok = false;
      }

      if (ok) {
        console.log("\nAll checks passed.");
      } else {
        console.log("\nSome checks failed.");
        process.exit(1);
      }
    });
}
