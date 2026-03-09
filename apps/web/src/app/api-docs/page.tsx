import Link from "next/link";

export default function ApiDocsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">API documentation</h1>
      <p className="text-gray-600">
        Stable versioned JSON API. OpenAPI spec: <Link href="/api/openapi.json" className="text-blue-600 hover:underline">/api/openapi.json</Link>
      </p>
      <h2 className="text-xl font-semibold">Endpoints</h2>
      <ul className="list-inside list-disc space-y-1 text-gray-600">
        <li>
          <code>GET /api/v1/agents</code> – list published agents (query: q, category, tag)
        </li>
        <li>
          <code>GET /api/v1/agents/:slug</code> – agent detail with latest version
        </li>
        <li>
          <code>GET /api/v1/agents/:slug/versions</code> – version list with checksums and archive URLs
        </li>
        <li>
          <code>POST /api/v1/submissions</code> – submit a template (body: {`{ manifest }`})
        </li>
        <li>
          <code>GET /api/v1/tags</code> – list all tags
        </li>
        <li>
          <code>GET /api/v1/health</code> – liveness
        </li>
        <li>
          <code>GET /api/v1/ready</code> – readiness (DB)
        </li>
      </ul>
    </div>
  );
}
