#!/usr/bin/env node
import { Command } from "commander";
import { initCmd } from "./commands/init.js";
import { validateCmd } from "./commands/validate.js";
import { packCmd } from "./commands/pack.js";
import { installCmd } from "./commands/install.js";
import { listCmd } from "./commands/list.js";
import { doctorCmd } from "./commands/doctor.js";
import { exportManifestCmd } from "./commands/export-manifest.js";
import { schemaCmd } from "./commands/schema.js";

const program = new Command();

program
  .name("zoar")
  .description("Zo Agent Registry CLI – browse, validate, and install agent templates")
  .version("1.0.0");

program.addCommand(initCmd());
program.addCommand(validateCmd());
program.addCommand(packCmd());
program.addCommand(installCmd());
program.addCommand(listCmd());
program.addCommand(doctorCmd());
program.addCommand(exportManifestCmd());
program.addCommand(schemaCmd());

program.parse();
