import { authClient } from "@/lib/auth-client";
import { ApiError, request } from "@/lib/api";

/** Calls the Express API with the BetterAuth-issued JWT in the Authorization header. */
export async function authApi<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) throw new ApiError("Please log in to continue.", 401);
  return request<T>(path, { ...options, token: data.token });
}
