import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventImage from "@/components/EventImage";
import JoinButton from "@/components/JoinButton";
import { ApiError, EventItem, formatDate, isPast, request } from "@/lib/api";

async function getEvent(id: string): Promise<EventItem | null> {
  try {
    return await request<EventItem>(`/api/events/${id}`);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) return null;
    throw err;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id).catch(() => null);
  return { title: event?.title ?? "Event details" };
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const ended = isPast(event.eventDate);
  const time = new Date(event.eventDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/events" className="link link-hover text-sm">← Back to upcoming events</Link>

      <div className="mt-4 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
        <EventImage src={event.thumbnail} alt={event.title} className="h-64 w-full sm:h-96" />

        <div className="grid gap-8 p-6 md:grid-cols-3 md:p-8">
          <div className="md:col-span-2">
            <span className="badge badge-secondary">{event.eventType}</span>
            <h1 className="section-title mt-3">{event.title}</h1>
            <p className="mt-5 whitespace-pre-line leading-relaxed opacity-85">{event.description}</p>
          </div>

          <aside className="space-y-4 rounded-box bg-base-200 p-5">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold opacity-60">Date</dt>
                <dd>{formatDate(event.eventDate)} at {time}</dd>
              </div>
              <div>
                <dt className="font-semibold opacity-60">Location</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt className="font-semibold opacity-60">Organised by</dt>
                <dd>{event.creatorName || event.creatorEmail}</dd>
              </div>
              <div>
                <dt className="font-semibold opacity-60">Neighbours joined</dt>
                <dd>{event.participantsCount ?? 0}</dd>
              </div>
            </dl>
            <JoinButton eventId={event._id} isPast={ended} />
          </aside>
        </div>
      </div>
    </section>
  );
}
