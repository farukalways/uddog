// Server-safe helpers: types, constants and public (no-auth) API calls.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
  participantsCount?: number;
}

export interface JoinedItem {
  _id: string;
  joinedAt: string;
  event: EventItem;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || "Something went wrong.", res.status);
  return data as T;
}

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Distribution",
  "Blood Donation",
  "Other",
];

export function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
