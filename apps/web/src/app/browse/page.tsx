import { prisma } from "@/lib/db";
import type { AgentListItem } from "@/lib/types";
import Link from "next/link";
import { Badge } from "@zo-agent-registry/ui";

async function getAgents(query: string | null, category: string | null, tag: string | null): Promise<AgentListItem[]> {
  const where: { publishedAt?: { not: null }; slug?: { contains: string; mode: "insensitive" }; tags?: { some?: { tag: string } }; category?: string } = {
    publishedAt: { not: null },
  };
  if (query) where.slug = { contains: query, mode: "insensitive" };
  if (tag) where.tags = { some: { tag } };

  const agents = await prisma.agent.findMany({
    where,
    include: {
      versions: { orderBy: { createdAt: "desc" }, take: 1 },
      tags: true,
    },
  });

  const list: AgentListItem[] = agents.map((a: (typeof agents)[number]) => {
    const latest = a.versions[0];
    const manifest = (latest?.manifest ?? {}) as Record<string, unknown>;
    const name = (manifest.name as string) ?? a.slug;
    const summary = (manifest.summary as string) ?? "";
    const version = latest?.version ?? "0.0.0";
    const categoryVal = (manifest.category as string) ?? null;
    const compat = manifest.compatibility as { zoFriendly?: boolean } | undefined;
    return {
      slug: a.slug,
      name,
      summary,
      version,
      category: categoryVal,
      tags: a.tags.map((t: { tag: string }) => t.tag),
      publishedAt: a.publishedAt?.toISOString() ?? null,
      zoFriendly: compat?.zoFriendly ?? false,
    };
  });

  if (category) {
    return list.filter((a) => a.category === category);
  }
  return list;
}

async function getTags(): Promise<string[]> {
  const rows = await prisma.agentTag.findMany({
    where: { agent: { publishedAt: { not: null } } },
    select: { tag: true },
    distinct: ["tag"],
    orderBy: { tag: "asc" },
  });
  return rows.map((r: { tag: string }) => r.tag);
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const [agents, tags] = await Promise.all([
    getAgents(params.q ?? null, params.category ?? null, params.tag ?? null),
    getTags(),
  ]);

  const categories = [
    "research",
    "monitoring",
    "digest",
    "personal-ops",
    "developer-productivity",
    "other",
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Browse agents</h1>

      <form method="get" className="flex flex-wrap gap-4">
        <input
          type="search"
          name="q"
          defaultValue={params.q}
          placeholder="Search by name or slug"
          className="rounded border border-gray-300 px-3 py-2"
        />
        <select name="category" defaultValue={params.category ?? ""} className="rounded border border-gray-300 px-3 py-2">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="tag" defaultValue={params.tag ?? ""} className="rounded border border-gray-300 px-3 py-2">
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
          Apply
        </button>
      </form>

      <ul className="space-y-4">
        {agents.map((a) => (
          <li key={a.slug} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href={`/agents/${a.slug}`} className="font-semibold text-gray-900 hover:underline">
                  {a.name}
                </Link>
                <p className="mt-1 text-sm text-gray-600">{a.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {a.tags.slice(0, 5).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                  {a.zoFriendly && <Badge variant="zo">Zo-friendly</Badge>}
                </div>
              </div>
              <span className="text-sm text-gray-500">v{a.version}</span>
            </div>
          </li>
        ))}
      </ul>
      {agents.length === 0 && (
        <p className="text-gray-500">No agents match your filters. Try different search or run db:seed.</p>
      )}
    </div>
  );
}
