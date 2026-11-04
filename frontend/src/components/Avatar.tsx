"use client";

import { useState } from "react";

interface Props {
  name?: string | null;
  src?: string | null;
  size?: number;
}

export default function Avatar({ name, src, size = 40 }: Props) {
  const [failed, setFailed] = useState(false);
  const initial = (name?.trim()[0] || "?").toUpperCase();

  if (!src || failed) {
    return (
      <span
        className="grid place-items-center rounded-full bg-secondary font-bold text-secondary-content"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {initial}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name ? `${name}'s profile picture` : "Profile picture"}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}
