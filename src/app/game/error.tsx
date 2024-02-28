"use client";

import { useMemo } from "react";

export default function Error({ ...error }) {
  const errorMessage = useMemo(
    () =>
      String(error?.error?.message).endsWith("404")
        ? "La session n'exist pas encore"
        : error?.error?.message,
    [error?.error?.message]
  );

  return (
    <div className="text-xl font-semibold text-center">{errorMessage}</div>
  );
}
