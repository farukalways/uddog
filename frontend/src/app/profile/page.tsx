"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Avatar from "@/components/Avatar";
import { authClient, useSession } from "@/lib/auth-client";

function isUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProfilePage() {
  const { data, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const user = data?.user;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const image = String(f.get("image") || "").trim();

    const next: typeof errors = {};
    if (name.length < 2) next.name = "Please enter your full name.";
    if (!isUrl(image)) next.image = "Please enter a valid photo URL starting with http or https.";
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]!);
      return;
    }

    setLoading(true);
    const { error } = await authClient.updateUser({ name, image });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Could not update your profile.");
      return;
    }
    toast.success("Profile updated.");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="section-title">Your profile</h1>
      <p className="section-sub mt-2">Update how your neighbours see you across Uddog.</p>

      <div className="card mt-8 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-6">
          {isPending || !user ? (
            <div className="space-y-4">
              <div className="skeleton h-24 w-24 rounded-full" />
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Avatar name={user.name} src={user.image} size={96} />
                <div>
                  <p className="text-xl font-semibold">{user.name}</p>
                  <p className="text-sm opacity-70">{user.email}</p>
                </div>
              </div>

              <form key={`${user.name}-${user.image}`} onSubmit={handleSubmit} noValidate className="space-y-4">
                <label className="form-control w-full">
                  <span className="label-text mb-1 block font-medium">Name</span>
                  <input name="name" defaultValue={user.name} className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`} />
                  {errors.name && <span className="mt-1 block text-sm text-error">{errors.name}</span>}
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 block font-medium">Photo URL</span>
                  <input name="image" type="url" defaultValue={user.image ?? ""} className={`input input-bordered w-full ${errors.image ? "input-error" : ""}`} />
                  {errors.image && <span className="mt-1 block text-sm text-error">{errors.image}</span>}
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 block font-medium">Email</span>
                  <input value={user.email} disabled readOnly className="input input-bordered w-full" />
                </label>

                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading && <span className="loading loading-spinner loading-sm" />}
                  Save Changes
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
