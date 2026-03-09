#!/usr/bin/env node
const { execSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
process.chdir(root);

execSync("pnpm exec prisma db seed", {
  cwd: path.join(root, "apps", "web"),
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/zo_registry" },
});
