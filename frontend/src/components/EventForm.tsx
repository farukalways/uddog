"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { EVENT_TYPES } from "@/lib/api";

export interface EventFormValues {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string; // ISO string
}

type Errors = Partial<Record<keyof EventFormValues, string>>;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** ISO string -> value for <input type="datetime-local"> in the user's timezone */
export function toLocalInput(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

interface Props {
  initial?: EventFormValues;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => Promise<void>;
}

export default function EventForm({ initial, submitLabel, onSubmit }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const minDate = toLocalInput(new Date().toISOString());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const rawDate = String(f.get("eventDate") || "");
    const values: EventFormValues = {
      title: String(f.get("title") || "").trim(),
      description: String(f.get("description") || "").trim(),
      eventType: String(f.get("eventType") || ""),
      thumbnail: String(f.get("thumbnail") || "").trim(),
      location: String(f.get("location") || "").trim(),
      eventDate: rawDate ? new Date(rawDate).toISOString() : "",
    };

    const next: Errors = {};
    if (values.title.length < 5) next.title = "Title must be at least 5 characters.";
    if (values.description.length < 20) next.description = "Description must be at least 20 characters.";
    if (!EVENT_TYPES.includes(values.eventType)) next.eventType = "Please choose an event type.";
    if (!isUrl(values.thumbnail)) next.thumbnail = "Please enter a valid image URL starting with http or https.";
    if (values.location.length < 3) next.location = "Please enter where the event will take place.";
    if (!rawDate) next.eventDate = "Please choose the event date and time.";
    else if (new Date(rawDate).getTime() <= Date.now()) next.eventDate = "The event date must be in the future.";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  }

  const cls = (k: keyof Errors) => `w-full ${errors[k] ? "input-error textarea-error select-error" : ""}`;
  const err = (k: keyof Errors) =>
    errors[k] ? <span className="mt-1 block text-sm text-error">{errors[k]}</span> : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 md:grid-cols-2">
      <label className="form-control md:col-span-2">
        <span className="label-text mb-1 block font-medium">Event title</span>
        <input name="title" defaultValue={initial?.title} placeholder="Winter Clothes Distribution, Mirpur 10" className={`input input-bordered ${cls("title")}`} />
        {err("title")}
      </label>

      <label className="form-control">
        <span className="label-text mb-1 block font-medium">Event type</span>
        <select name="eventType" defaultValue={initial?.eventType ?? ""} className={`select select-bordered ${cls("eventType")}`}>
          <option value="" disabled>Choose a type</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {err("eventType")}
      </label>

      <label className="form-control">
        <span className="label-text mb-1 block font-medium">Event date and time</span>
        <input
          name="eventDate"
          type="datetime-local"
          min={minDate}
          defaultValue={initial ? toLocalInput(initial.eventDate) : ""}
          className={`input input-bordered ${cls("eventDate")}`}
        />
        {err("eventDate")}
      </label>

      <label className="form-control">
        <span className="label-text mb-1 block font-medium">Location</span>
        <input name="location" defaultValue={initial?.location} placeholder="Mirpur 10, Dhaka" className={`input input-bordered ${cls("location")}`} />
        {err("location")}
      </label>

      <label className="form-control">
        <span className="label-text mb-1 block font-medium">Thumbnail image URL</span>
        <input name="thumbnail" type="url" defaultValue={initial?.thumbnail} placeholder="https://example.com/event.jpg" className={`input input-bordered ${cls("thumbnail")}`} />
        {err("thumbnail")}
      </label>

      <label className="form-control md:col-span-2">
        <span className="label-text mb-1 block font-medium">Description</span>
        <textarea name="description" rows={5} defaultValue={initial?.description} placeholder="Tell people what will happen, what to bring and who it helps." className={`textarea textarea-bordered ${cls("description")}`} />
        {err("description")}
      </label>

      <div className="md:col-span-2">
        <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto sm:min-w-48">
          {loading && <span className="loading loading-spinner loading-sm" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
