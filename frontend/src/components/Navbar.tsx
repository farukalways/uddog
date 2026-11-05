"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";
import Avatar from "@/components/Avatar";

export default function Navbar() {
  const { data, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = data?.user;

  async function handleLogout() {
    await signOut();
    toast.success("You have been logged out.");
    router.push("/");
    router.refresh();
  }

  const linkClass = (href: string) =>
    `btn btn-ghost btn-sm ${pathname === href ? "text-primary" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2" aria-label="Uddog home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.4-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.6 12 21 12 21z" />
              </svg>
            </span>
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold">
              Uddog
            </span>
          </Link>
          <div className="ml-4 hidden sm:flex">
            <Link href="/" className={linkClass("/")}>Home</Link>
            <Link href="/events" className={linkClass("/events")}>Upcoming Events</Link>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/events" className="btn btn-ghost btn-sm sm:hidden">Events</Link>
          <ThemeToggle />

          {isPending ? (
            <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
          ) : user ? (
            <>
              <div className="dropdown dropdown-end">
                <div
                  className="tooltip tooltip-bottom"
                  data-tip={user.name}
                >
                  <button
                    type="button"
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                    aria-label="Open account menu"
                  >
                    <Avatar name={user.name} src={user.image} size={40} />
                  </button>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
                >
                  <li className="menu-title truncate">{user.email}</li>
                  <li><Link href="/create-event">Create Event</Link></li>
                  <li><Link href="/manage-events">Manage Events</Link></li>
                  <li><Link href="/joined-events">Joined Events</Link></li>
                  <li><Link href="/profile">My Profile</Link></li>
                </ul>
              </div>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
