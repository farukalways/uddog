"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EventForm, { EventFormValues } from "@/components/EventForm";
import { authApi } from "@/lib/api-client";

export default function CreateEventPage() {
  const router = useRouter();

  async function handleCreate(values: EventFormValues) {
    try {
      await authApi("/api/events", { method: "POST", body: values });
      toast.success("Your event has been created.");
      router.push("/events");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the event.");
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="section-title">Create an event</h1>
      <p className="section-sub mt-2">
        Rally your neighbours around something that matters. Add the details below and your event
        will appear on the Upcoming Events page right away.
      </p>
      <div className="card mt-8 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <EventForm submitLabel="Create Event" onSubmit={handleCreate} />
        </div>
      </div>
    </section>
  );
}
