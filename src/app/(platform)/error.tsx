"use client";

import { useEffect } from "react";

export default function PlatformError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[cloudbase]", error);
  }, [error]);
  return (
    <div className="cb-empty" role="alert">
      <h3>Something went wrong</h3>
      <p>The page could not be rendered. {error.digest ? `Reference: ${error.digest}` : ""}</p>
      <button className="cb-btn" onClick={reset} style={{ marginTop: 16 }}>
        Try again
      </button>
    </div>
  );
}
