import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zo Agent Registry",
  description: "Open registry of reusable agent templates for Zo Computer users",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="font-semibold text-gray-900">
              Zo Agent Registry
            </Link>
            <nav className="flex gap-6">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              <Link href="/submit" className="text-gray-600 hover:text-gray-900">
                Submit
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </Link>
              <Link href="/api-docs" className="text-gray-600 hover:text-gray-900">
                API
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
          Zo Agent Registry – Apache-2.0. Template entries are user-contributed; review before use.
        </footer>
      </body>
    </html>
  );
}
