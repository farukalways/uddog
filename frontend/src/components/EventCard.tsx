import Link from "next/link";
import { EventItem, formatDate } from "@/lib/api";
import EventImage from "@/components/EventImage";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <figure className="relative h-52 shrink-0">
        <EventImage src={event.thumbnail} alt={event.title} className="h-full w-full" />
        <span className="badge badge-secondary absolute left-3 top-3">{event.eventType}</span>
      </figure>
      <div className="card-body flex-1 gap-3">
        <h3 className="card-title line-clamp-2 min-h-[3.5rem] font-[family-name:var(--font-heading)] text-lg leading-snug">
          {event.title}
        </h3>
        <ul className="space-y-1.5 text-sm opacity-80">
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            <span className="line-clamp-1">{event.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" d="M3 10h18M8 3v4m8-4v4" /></svg>
            <span>{formatDate(event.eventDate)}</span>
          </li>
          <li className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" /><path strokeLinecap="round" d="M2.5 20a6.5 6.5 0 0 1 13 0M17 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5A6.5 6.5 0 0 1 21.5 20" /></svg>
            <span>{event.participantsCount ?? 0} joined</span>
          </li>
        </ul>
        <div className="card-actions mt-auto pt-2">
          <Link href={`/events/${event._id}`} className="btn btn-primary btn-block">
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}
