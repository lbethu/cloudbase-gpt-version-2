import { MATURITY_MODEL, type MaturityLevel } from "@/domain";

export function MaturityLadder({ active, counts }: { active?: MaturityLevel; counts?: Partial<Record<MaturityLevel, number>> }) {
  return (
    <div className="cb-ladder" role="list" aria-label="CROS maturity model">
      {(Object.keys(MATURITY_MODEL) as MaturityLevel[]).map((level) => (
        <div key={level} role="listitem" className={`cb-ladder-step ${active === level ? "cb-ladder-step--active" : ""}`} title={MATURITY_MODEL[level].description}>
          <b>{level}</b>
          <strong>{MATURITY_MODEL[level].label}</strong>
          <span>{counts ? `${counts[level] ?? 0}` : MATURITY_MODEL[level].description}</span>
        </div>
      ))}
    </div>
  );
}
