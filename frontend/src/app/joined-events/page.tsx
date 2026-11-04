"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api-client";
import { JoinedItem, formatDate } from "@/lib/api";
import EventCard from "@/components/EventCard";
import { EventGridSkeleton } from "@/components/EventSkeleton";

export default function JoinedEventsPage() {
  const [items, setItems] = useState<JoinedItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authApi<JoinedItem[]>("/api/joins/mine")
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load your joined events."));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="section-title">Events you have joined</h1>
      <p className="section-sub mt-2">Sorted by event date, so the next one you attend comes first.</p>

      <div className="mt-8">
        {error ? (
          <div role="alert" className="alert alert-error"><span>{error}</span></div>
        ) : items === null ? (
          <EventGridSkeleton count={3} />
        ) : items.length === 0 ? (
          <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
            <p className="text-lg font-medium">You have not joined any events yet.</p>
            <p className="mt-1 opacity-70">Browse what is happening near you and sign up.</p>
            <Link href="/events" className="btn btn-primary mt-5">Browse upcoming events</Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="relative">
                <EventCard event={item.event} />
                <span className="badge badge-primary absolute right-3 top-3">
                  Joined {formatDate(item.joinedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
