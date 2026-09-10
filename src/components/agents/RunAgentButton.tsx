"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { useState } from "react";

export function RunAgentButton({ agentId, disabled }: { agentId: string; disabled?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const run = async () => {
    setState("running");
    try {
      const res = await fetch(`/api/agents/${encodeURIComponent(agentId)}/run`, { method: "POST" });
      const data = (await res.json()) as { error?: string; run?: { summary: string } };
      if (!res.ok) throw new Error(data.error ?? `Run failed (${res.status})`);
      setMessage(data.run?.summary ?? "completed");
      setState("done");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Run failed");
      setState("error");
    }
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button className="cb-btn cb-btn--primary cb-btn--sm" onClick={run} disabled={disabled || state === "running"} title={disabled ? "agent.run permission required" : "Run now (audited)"}>
        <Play /> {state === "running" ? "Running…" : "Run now"}
      </button>
      {message && <span className={`cb-small ${state === "error" ? "cb-sev cb-sev--high" : "cb-muted"}`}>{message}</span>}
    </span>
  );
}
