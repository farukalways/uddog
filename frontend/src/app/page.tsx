import Link from "next/link";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import EventImage from "@/components/EventImage";
import { EventGridSkeleton } from "@/components/EventSkeleton";
import Newsletter from "@/components/Newsletter";
import { EventItem, request } from "@/lib/api";

const FEATURES = [
  {
    title: "Create in minutes",
    text: "Post a clothes drive, plantation day or blood camp with a date, place and photo. Neighbours see it straight away.",
    icon: "M12 5v14M5 12h14",
  },
  {
    title: "Join with one tap",
    text: "Found something worth showing up for? Join the event and it lands on your personal list, sorted by date.",
    icon: "M5 13l4 4L19 7",
  },
  {
    title: "Stay in control",
    text: "Update details or cancel an event you organised. Only you can change what you created.",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    title: "Only what is coming up",
    text: "Past events drop off the list automatically, so every card you see is still open for sign-ups.",
    icon: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=70", alt: "Volunteers packing donation boxes" },
  { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=70", alt: "Volunteers handing out supplies" },
  { src: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=70", alt: "Community members planting trees" },
  { src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=70", alt: "Beach cleanup volunteers collecting litter" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=70", alt: "Neighbours sharing a community meal" },
  { src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=70", alt: "Volunteers working together outdoors" },
];

async function UpcomingEvents() {
  let events: EventItem[] = [];
  try {
    events = await request<EventItem[]>("/api/events?limit=6");
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
        <p className="text-lg font-medium">No upcoming events yet.</p>
        <p className="mt-1 opacity-70">Be the first neighbour to organise one.</p>
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

export default function HomePage() {
  return (
    <>
      {/* Banner */}
      <section className="hero-pattern relative overflow-hidden border-b border-base-300 bg-base-200">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="badge badge-primary badge-outline mb-5">Winter drives are open</span>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Small acts, <span className="text-primary">one street</span> at a time.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">
              Uddog helps you organise and join social service events near you, from blanket
              distributions in Mohammadpur to tree plantations in Dhaka&apos;s parks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events" className="btn btn-primary btn-lg">Find an event</Link>
              <Link href="/create-event" className="btn btn-outline btn-lg">Organise one</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["Winter Clothes Distribution", "Mirpur 10, Dhaka"],
              ["Blanket Drive for the Needy", "Mohammadpur, Dhaka"],
              ["Neighbourhood Tree Plantation", "Dhanmondi, Dhaka"],
              ["Community Blood Donation Camp", "Uttara, Dhaka"],
            ].map(([title, place], i) => (
              <div
                key={title}
                className={`rounded-box border border-base-300 bg-base-100 p-5 shadow-sm ${i % 2 ? "translate-y-6" : ""}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.6 12 21 12 21z" /></svg>
                </span>
                <p className="mt-3 font-semibold leading-snug">{title}</p>
                <p className="mt-1 text-sm opacity-70">{place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title">Everything your neighbourhood needs</h2>
        <p className="section-sub mt-2">Simple tools that keep organisers and volunteers on the same page.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card h-full border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary/15 text-secondary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={f.icon} /></svg>
                </span>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed opacity-75">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent upcoming events */}
      <section className="bg-base-200/60 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Happening soon</h2>
              <p className="section-sub mt-2">The next six events coming up in the community.</p>
            </div>
            <Link href="/events" className="btn btn-outline btn-sm">See all events</Link>
          </div>
          <div className="mt-10">
            <Suspense fallback={<EventGridSkeleton />}>
              <UpcomingEvents />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="section-title">Moments from the field</h2>
        <p className="section-sub mt-2">A look at what neighbours have achieved together.</p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {GALLERY.map((g) => (
            <div key={g.src} className="overflow-hidden rounded-box">
              <EventImage
                src={g.src}
                alt={g.alt}
                className="h-44 w-full transition duration-500 hover:scale-105 sm:h-56 lg:h-64"
              />
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
