import type { AgentManifest } from "@zo-agent-registry/manifest-schema";

export type AgentWithVersions = {
  id: string;
  slug: string;
  publishedAt: Date | null;
  versions: { id: string; version: string; manifest: AgentManifest; checksum: string | null; createdAt: Date }[];
  tags: { tag: string }[];
};

export type AgentListItem = {
  slug: string;
  name: string;
  summary: string;
  version: string;
  category: string | null;
  tags: string[];
  publishedAt: string | null;
  zoFriendly: boolean;
};
