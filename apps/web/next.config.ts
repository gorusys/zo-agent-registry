import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@zo-agent-registry/ui", "@zo-agent-registry/manifest-schema", "@zo-agent-registry/registry-core"],
};

export default nextConfig;
