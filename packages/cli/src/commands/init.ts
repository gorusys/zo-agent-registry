import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { Command } from "commander";

const ZOAR_DIR = ".zoar";
const AGENTS_DIR = "agents";

export function initCmd(): Command {
  return new Command("init")
    .description("Initialize a .zoar directory in the current project")
    .action(() => {
      const cwd = process.cwd();
      const zoarPath = join(cwd, ZOAR_DIR);
      const agentsPath = join(zoarPath, AGENTS_DIR);
      if (existsSync(zoarPath)) {
        console.log(`${ZOAR_DIR} already exists at ${zoarPath}`);
        return;
      }
      mkdirSync(agentsPath, { recursive: true });
      writeFileSync(
        join(zoarPath, "README.txt"),
        "Zo Agent Registry install directory. Installed agents live under agents/<slug>.\n"
      );
      console.log(`Initialized ${ZOAR_DIR} at ${zoarPath}`);
      console.log(`Installed agents will be placed under ${ZOAR_DIR}/${AGENTS_DIR}/<slug>`);
    });
}
