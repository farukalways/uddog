import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="font-[family-name:var(--font-heading)] text-7xl font-bold text-primary">404</p>
        <h1 className="section-title mt-2">We could not find that page</h1>
        <p className="section-sub mx-auto mt-2">
          The page or event you are looking for may have been moved or deleted.
        </p>
        <Link href="/events" className="btn btn-primary mt-6">See upcoming events</Link>
      </div>
    </section>
  );
}
