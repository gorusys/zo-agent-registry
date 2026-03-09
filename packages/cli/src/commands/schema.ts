import { Command } from "commander";
import { getJsonSchema } from "@zo-agent-registry/manifest-schema";

export function schemaCmd(): Command {
  return new Command("schema")
    .description("Print the agent manifest JSON Schema")
    .action(() => {
      const schema = getJsonSchema();
      process.stdout.write(JSON.stringify(schema, null, 2));
    });
}
