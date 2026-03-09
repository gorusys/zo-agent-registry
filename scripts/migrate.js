#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
process.chdir(root);

if (!fs.existsSync(path.join(root, "apps", "web", "prisma", "schema.prisma"))) {
  console.error("Prisma schema not found");
  process.exit(1);
}

execSync("pnpm exec prisma migrate deploy", {
  cwd: path.join(root, "apps", "web"),
  stdio: "inherit",
});
