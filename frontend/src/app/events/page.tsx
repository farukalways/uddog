import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import { EventGridSkeleton } from "@/components/EventSkeleton";
import { EVENT_TYPES, EventItem, request } from "@/lib/api";

export const metadata: Metadata = { title: "Upcoming Events" };

async function EventList({ type, search }: { type: string; search: string }) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (search) params.set("search", search);

  let events: EventItem[] = [];
  try {
    events = await request<EventItem[]>(`/api/events?${params.toString()}`);
  } catch {
    return (
      <div role="alert" className="alert alert-error">
        <span>We could not load events right now. Please refresh in a moment.</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
        <p className="text-lg font-medium">No upcoming events match your search.</p>
        <p className="mt-1 opacity-70">Try a different filter, or start the first one yourself.</p>
        <Link href="/create-event" className="btn btn-primary mt-5">Create an event</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((ev) => (
        <EventCard key={ev._id} event={ev} />
      ))}
    </div>
  );
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>;
}) {
  const { type = "", search = "" } = await searchParams;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="section-title">Upcoming events</h1>
      <p className="section-sub mt-2">
        Every event below is still to come. Pick one near you and show up.
      </p>

      <form method="GET" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by title or location"
          className="input input-bordered w-full sm:flex-1"
          aria-label="Search events"
        />
        <select name="type" defaultValue={type} className="select select-bordered w-full sm:w-56" aria-label="Filter by event type">
          <option value="">All types</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <div className="mt-8">
        <Suspense key={`${type}-${search}`} fallback={<EventGridSkeleton />}>
          <EventList type={type} search={search} />
        </Suspense>
      </div>
    </section>
  );
}
