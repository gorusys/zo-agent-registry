import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { AgentWithVersions } from "@/lib/types";
import type { AgentManifest } from "@zo-agent-registry/manifest-schema";
import Link from "next/link";
import { Badge } from "@zo-agent-registry/ui";
import { CopyInstallButton } from "./CopyInstallButton";

async function getAgent(slug: string): Promise<AgentWithVersions | null> {
  const agent = await prisma.agent.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: {
      versions: { orderBy: { createdAt: "desc" } },
      tags: true,
    },
  });
  if (!agent) return null;
  return {
    id: agent.id,
    slug: agent.slug,
    publishedAt: agent.publishedAt,
    versions: agent.versions.map((v: { id: string; version: string; manifest: unknown; checksum: string | null; createdAt: Date }) => ({
      id: v.id,
      version: v.version,
      manifest: v.manifest as AgentManifest,
      checksum: v.checksum,
      createdAt: v.createdAt,
    })),
    tags: agent.tags.map((t: { tag: string }) => ({ tag: t.tag })),
  };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) notFound();

  const latest = agent.versions[0];
  if (!latest) notFound();
  const m = latest.manifest;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/browse" className="text-sm text-gray-500 hover:underline">
          ← Browse
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{m.name}</h1>
        <p className="mt-1 text-gray-600">{m.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {m.tags?.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
          {m.compatibility?.zoFriendly && <Badge variant="zo">Portable / Zo-friendly</Badge>}
          <Badge variant="success">Validated</Badge>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-900">Install</h2>
        <pre className="mt-2 rounded bg-gray-100 p-3 font-mono text-sm">
          zoar init{"\n"}
          zoar install {agent.slug}
        </pre>
        <CopyInstallButton slug={agent.slug} />
      </div>

      <section>
        <h2 className="font-semibold text-gray-900">Description</h2>
        <p className="mt-1 text-gray-600 whitespace-pre-wrap">{m.description}</p>
      </section>

      {m.env && m.env.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900">Environment variables</h2>
          <ul className="mt-2 list-inside list-disc text-gray-600">
            {m.env.map((e) => (
              <li key={e.name}>
                <code className="rounded bg-gray-100 px-1">{e.name}</code>
                {e.required && " (required)"} – {e.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      {m.schedule && m.schedule.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900">Schedule suggestions</h2>
          <ul className="mt-2 space-y-1 text-gray-600">
            {m.schedule.map((s, i) => (
              <li key={i}>
                {s.cron && <code className="rounded bg-gray-100 px-1">{s.cron}</code>}
                {s.interval && <code className="ml-2 rounded bg-gray-100 px-1">{s.interval}</code>}
                {s.description && ` – ${s.description}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {m.examples && m.examples.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-900">Examples</h2>
          <ul className="mt-2 space-y-2">
            {m.examples.map((ex, i) => (
              <li key={i} className="rounded border border-gray-200 p-3">
                <span className="font-medium">{ex.name}</span>
                {ex.description && <p className="text-sm text-gray-600">{ex.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-gray-900">Version history</h2>
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 font-medium">Version</th>
              <th className="py-2 font-medium">Checksum</th>
              <th className="py-2 font-medium">Published</th>
            </tr>
          </thead>
          <tbody>
            {agent.versions.map((v) => (
              <tr key={v.id} className="border-b border-gray-100">
                <td className="py-2">{v.version}</td>
                <td className="font-mono text-xs text-gray-500">{v.checksum?.slice(0, 16) ?? "—"}…</td>
                <td className="py-2 text-gray-500">{v.createdAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
