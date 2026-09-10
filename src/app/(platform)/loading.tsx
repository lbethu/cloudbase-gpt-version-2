export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" style={{ display: "grid", gap: 14 }}>
      <div className="cb-card" style={{ height: 64, opacity: 0.6 }} />
      <div className="cb-grid cb-grid--3">
        <div className="cb-card" style={{ height: 120, opacity: 0.5 }} />
        <div className="cb-card" style={{ height: 120, opacity: 0.5 }} />
        <div className="cb-card" style={{ height: 120, opacity: 0.5 }} />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
