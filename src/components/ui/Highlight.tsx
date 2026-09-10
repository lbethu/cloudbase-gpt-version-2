/** Wraps matched terms in <mark>. Pure text in, safe nodes out. */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const clean = terms.map((t) => t.trim()).filter((t) => t.length >= 2);
  if (!clean.length || !text) return <>{text}</>;
  const re = new RegExp(`(${clean.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) => (clean.some((t) => t.toLowerCase() === part.toLowerCase()) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </>
  );
}
