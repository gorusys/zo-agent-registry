import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Command } from "commander";

const ZOAR_DIR = ".zoar";
const AGENTS_DIR = "agents";

export function listCmd(): Command {
  return new Command("list")
    .description("List installed agents in the current .zoar directory")
    .action(() => {
      const cwd = process.cwd();
      const agentsPath = join(cwd, ZOAR_DIR, AGENTS_DIR);
      if (!existsSync(agentsPath)) {
        console.log("No agents installed. Run 'zoar init' then 'zoar install <slug>'.");
        return;
      }
      const slugs = readdirSync(agentsPath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
      if (slugs.length === 0) {
        console.log("No agents installed.");
        return;
      }
      console.log("Installed agents:");
      for (const slug of slugs) {
        const slugPath = join(agentsPath, slug);
        const versions = readdirSync(slugPath, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name)
          .sort();
        for (const ver of versions) {
          const manifestPath = join(slugPath, ver, "agent.manifest.json");
          let name = slug;
          if (existsSync(manifestPath)) {
            try {
              const m = JSON.parse(readFileSync(manifestPath, "utf-8")) as { name?: string };
              name = m.name ?? slug;
            } catch {
              // ignore
            }
          }
          console.log(`  ${slug}@${ver} (${name})`);
        }
      }
    });
}
