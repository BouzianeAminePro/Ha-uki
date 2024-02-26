"use client";

import { useMemo } from "react";

export default function Error({ ...error }) {
  const errorMessage = useMemo(
    () =>
      String(error?.error?.message).endsWith("404")
        ? "Pas de session"
        : error?.error?.message,
    [error?.error?.message]
  );

  return (
    <div className="text-xl font-semibold text-center">{errorMessage}</div>
  );
}
