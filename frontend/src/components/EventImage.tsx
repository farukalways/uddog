"use client";

import { useState } from "react";

export default function EventImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-primary/30 to-secondary/30 ${className}`}>
        <span className="text-sm font-medium opacity-70">Image unavailable</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
