import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-ivory p-8 text-center font-sans">
        <main>
          <p className="text-sm tracking-[0.2em] text-gold-deep uppercase">404</p>
          <h1 className="mt-3 text-4xl text-navy">Page not found</h1>
          <Link href="/en" className="btn-navy mt-8">
            Skyline Estates
          </Link>
        </main>
      </body>
    </html>
  );
}
