import Link from "next/link";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 bg-neutral text-neutral-content">
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.6 12 21 12 21z" />
              </svg>
            </span>
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
              Uddog
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed opacity-75">
            A community platform where neighbours organise, join and track social service
            events across Bangladesh, one street at a time.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link className="hover:text-primary" href="/events">Upcoming Events</Link></li>
            <li><Link className="hover:text-primary" href="/create-event">Create an Event</Link></li>
            <li><Link className="hover:text-primary" href="/joined-events">Joined Events</Link></li>
            <li><Link className="hover:text-primary" href="/manage-events">Manage Events</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li>House 12, Road 4, Mirpur 10, Dhaka 1216</li>
            <li>+880 1700-000000</li>
            <li>hello@Uddog.example</li>
            <li>Open daily, 9:00 AM to 8:00 PM</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Follow us</h3>
          <div className="flex gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Uddog on X" className="btn btn-circle btn-outline btn-sm border-neutral-content/30 text-neutral-content hover:bg-primary hover:text-primary-content">
              <XIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Uddog on Facebook" className="btn btn-circle btn-outline btn-sm border-neutral-content/30 text-neutral-content hover:bg-primary hover:text-primary-content">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Uddog on Instagram" className="btn btn-circle btn-outline btn-sm border-neutral-content/30 text-neutral-content hover:bg-primary hover:text-primary-content">
              <InstagramIcon />
            </a>
          </div>
          <p className="mt-4 text-sm opacity-75">
            Share an event with your neighbours and watch your street come together.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-content/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Uddog. Built for communities that care.
      </div>
    </footer>
  );
}
