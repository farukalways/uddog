"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { authApi } from "@/lib/api-client";

export default function JoinButton({ eventId, isPast }: { eventId: string; isPast: boolean }) {
  const { data, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const loggedIn = Boolean(data?.user);

  useEffect(() => {
    if (!loggedIn) return;
    authApi<{ joined: boolean }>(`/api/events/${eventId}/joined`)
      .then((r) => setJoined(r.joined))
      .catch(() => {});
  }, [loggedIn, eventId]);

  async function handleJoin() {
    if (!loggedIn) {
      toast.error("Please log in to join this event.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setLoading(true);
    try {
      await authApi(`/api/events/${eventId}/join`, { method: "POST" });
      setJoined(true);
      toast.success("You are in! See you at the event.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not join the event.");
    } finally {
      setLoading(false);
    }
  }

  if (isPast) {
    return <button className="btn btn-disabled btn-block" disabled>This event has ended</button>;
  }

  return (
    <button onClick={handleJoin} disabled={loading || isPending || joined} className="btn btn-primary btn-block">
      {loading && <span className="loading loading-spinner loading-sm" />}
      {joined ? "You have joined" : "Join Event"}
    </button>
  );
}
