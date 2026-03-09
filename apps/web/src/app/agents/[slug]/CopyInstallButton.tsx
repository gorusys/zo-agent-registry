"use client";

import { useState } from "react";

export function CopyInstallButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const text = `zoar init\nzoar install ${slug}`;
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="mt-2 rounded bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
    >
      {copied ? "Copied" : "Copy install command"}
    </button>
  );
}
