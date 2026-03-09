import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Zo Agent Registry</h1>
        <p className="mt-2 text-lg text-gray-600">
          Browse, validate, and install reusable agent templates for Zo Computer. Portable, file-based, and
          self-hostable.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/browse"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900">Browse templates</h2>
          <p className="mt-1 text-gray-600">Search and filter agent templates by category, tag, or capability.</p>
        </Link>
        <Link
          href="/submit"
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900">Submit a template</h2>
          <p className="mt-1 text-gray-600">Publish your agent template for the community after review.</p>
        </Link>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">Quick install</h2>
        <p className="mt-1 text-gray-600">Use the CLI to install a template locally:</p>
        <pre className="mt-2 rounded bg-gray-100 p-4 font-mono text-sm">
          pnpm cli -- init{"\n"}
          pnpm cli -- install daily-research-digest
        </pre>
      </section>
    </div>
  );
}
