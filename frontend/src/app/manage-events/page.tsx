"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import EventForm, { EventFormValues } from "@/components/EventForm";
import EventImage from "@/components/EventImage";
import { EventGridSkeleton } from "@/components/EventSkeleton";
import { authApi } from "@/lib/api-client";
import { EventItem, formatDate, isPast } from "@/lib/api";

export default function ManageEventsPage() {
  const [items, setItems] = useState<EventItem[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await authApi<EventItem[]>("/api/events/mine"));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your events.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function handleUpdate(values: EventFormValues) {
    if (!editing) return;
    try {
      await authApi(`/api/events/${editing._id}`, { method: "PUT", body: values });
      toast.success("Event updated successfully.");
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the event.");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await authApi(`/api/events/${deleting._id}`, { method: "DELETE" });
      toast.success("Event deleted.");
      setItems((prev) => prev?.filter((e) => e._id !== deleting._id) ?? prev);
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the event.");
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Manage your events</h1>
          <p className="section-sub mt-2">Update details or remove events you have created.</p>
        </div>
        <Link href="/create-event" className="btn btn-primary">Create Event</Link>
      </div>

      <div className="mt-8">
        {error ? (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
            <button className="btn btn-sm" onClick={load}>Try again</button>
          </div>
        ) : items === null ? (
          <EventGridSkeleton count={3} />
        ) : items.length === 0 ? (
          <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
            <p className="text-lg font-medium">You have not created any events yet.</p>
            <p className="mt-1 opacity-70">Start one and invite your neighbours to join.</p>
            <Link href="/create-event" className="btn btn-primary mt-5">Create your first event</Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((ev) => {
              const past = isPast(ev.eventDate);
              return (
                <article key={ev._id} className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm">
                  <figure className="relative h-44 shrink-0">
                    <EventImage src={ev.thumbnail} alt={ev.title} className="h-full w-full" />
                    <span className="badge badge-secondary absolute left-3 top-3">{ev.eventType}</span>
                    {past && <span className="badge badge-neutral absolute right-3 top-3">Past</span>}
                  </figure>
                  <div className="card-body flex-1 gap-2">
                    <h2 className="card-title line-clamp-2 min-h-[3.25rem] font-[family-name:var(--font-heading)] text-lg leading-snug">{ev.title}</h2>
                    <p className="line-clamp-1 text-sm opacity-75">{ev.location}</p>
                    <p className="text-sm opacity-75">
                      {formatDate(ev.eventDate)} · {ev.participantsCount ?? 0} joined
                    </p>
                    <div className="card-actions mt-auto grid grid-cols-3 gap-2 pt-3">
                      <Link href={`/events/${ev._id}`} className="btn btn-outline btn-sm">View</Link>
                      <button className="btn btn-primary btn-sm" onClick={() => setEditing(ev)}>Update</button>
                      <button className="btn btn-error btn-outline btn-sm" onClick={() => setDeleting(ev)}>Delete</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <dialog className="modal modal-open" aria-label="Update event">
          <div className="modal-box max-w-3xl">
            <h3 className="mb-5 font-[family-name:var(--font-heading)] text-2xl font-bold">Update event</h3>
            <EventForm
              initial={{
                title: editing.title,
                description: editing.description,
                eventType: editing.eventType,
                thumbnail: editing.thumbnail,
                location: editing.location,
                eventDate: editing.eventDate,
              }}
              submitLabel="Save Changes"
              onSubmit={handleUpdate}
            />
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={() => setEditing(null)} aria-label="Close">✕</button>
          </div>
          <div className="modal-backdrop" onClick={() => setEditing(null)} />
        </dialog>
      )}

      {deleting && (
        <dialog className="modal modal-open" aria-label="Delete event">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete this event?</h3>
            <p className="py-3 opacity-80">
              &ldquo;{deleting.title}&rdquo; and everyone&apos;s sign-ups for it will be removed. This cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setDeleting(null)} disabled={deleteBusy}>Keep event</button>
              <button className="btn btn-error" onClick={confirmDelete} disabled={deleteBusy}>
                {deleteBusy && <span className="loading loading-spinner loading-sm" />}
                Yes, delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !deleteBusy && setDeleting(null)} />
        </dialog>
      )}
    </section>
  );
}
