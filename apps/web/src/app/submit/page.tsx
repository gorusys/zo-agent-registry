"use client";

import { useState } from "react";

export default function SubmitPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const manifestText = (form.elements.namedItem("manifest") as HTMLTextAreaElement).value;
    let payload: unknown;
    try {
      payload = JSON.parse(manifestText);
    } catch {
      setStatus("error");
      setMessage("Invalid JSON in manifest");
      return;
    }
    try {
      const res = await fetch("/api/v1/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manifest: payload }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setStatus("ok");
      setMessage(`Submission received. ID: ${data.id ?? "—"}. It will be reviewed by an admin.`);
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Request failed");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Submit an agent template</h1>
      <p className="text-gray-600">
        Paste your <code className="rounded bg-gray-100 px-1">agent.manifest.json</code> below. It will be validated
        and queued for admin review. You can also upload a zip later via API.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-medium text-gray-900">Manifest JSON</label>
        <textarea
          name="manifest"
          rows={20}
          className="w-full rounded border border-gray-300 font-mono text-sm"
          placeholder='{"schemaVersion":"1.0","slug":"my-agent",...}'
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {status === "loading" ? "Submitting…" : "Submit"}
        </button>
      </form>
      {status === "ok" && <p className="text-green-600">{message}</p>}
      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  );
}
