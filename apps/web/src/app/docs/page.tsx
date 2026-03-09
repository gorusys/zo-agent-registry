export default function DocsPage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Documentation</h1>
      <p>
        Zo Agent Registry is an open registry of reusable agent templates for Zo Computer users. Templates are
        file-based packages with a manifest, prompt, and optional examples.
      </p>
      <h2>Manifest spec</h2>
      <p>
        Each template must include <code>agent.manifest.json</code> with schema version <code>1.0</code>. Required
        fields: slug, name, summary, description, version, authors, license. See the full schema via{" "}
        <code>zoar schema</code> or the API docs.
      </p>
      <h2>CLI</h2>
      <ul>
        <li>
          <code>zoar init</code> – create .zoar directory
        </li>
        <li>
          <code>zoar validate &lt;path&gt;</code> – validate a template
        </li>
        <li>
          <code>zoar pack &lt;path&gt;</code> – create tar.gz archive
        </li>
        <li>
          <code>zoar install &lt;slug&gt;</code> – install from registry
        </li>
        <li>
          <code>zoar install --from-file &lt;path&gt;</code> – install from local archive or folder
        </li>
        <li>
          <code>zoar list</code> – list installed agents
        </li>
        <li>
          <code>zoar doctor</code> – check environment
        </li>
      </ul>
      <h2>Execution</h2>
      <p>
        The registry does not execute agent code. Templates are declarative. You install files into your workspace
        and run them with your own trusted runtime or scripts.
      </p>
    </div>
  );
}
