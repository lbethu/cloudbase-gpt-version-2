import { GitBranch } from "lucide-react";
import type { GovernedBase } from "@/domain";
import { AsideCard } from "@/components/ui/DetailPage";
import { getRepository } from "@/server/integrations/github";

/** Async server component: GitHub repositories linked to a governed object. */
export async function RepositoryCard({ repositories }: { repositories: GovernedBase["repositories"] }) {
  if (!repositories.length) return null;
  const results = await Promise.all(repositories.map((r) => getRepository(r.owner, r.repo)));
  return (
    <AsideCard title="Engineering (GitHub)">
      <ul className="cb-aside-list">
        {results.map((r, i) => {
          const link = repositories[i];
          const url = r.ok ? r.summary.url : r.url;
          return (
            <li key={`${link.owner}/${link.repo}`}>
              <a href={link.path ? `${url}/tree/HEAD/${link.path}` : url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <GitBranch size={13} /> {link.label ?? `${link.owner}/${link.repo}`}
              </a>
              {r.ok ? (
                <small>
                  {r.summary.language ? `${r.summary.language} · ` : ""}
                  {r.summary.openIssues} open issues · {r.summary.private ? "private" : "public"}
                  {r.summary.pushedAt ? ` · pushed ${r.summary.pushedAt.slice(0, 10)}` : ""}
                  {r.commits[0] && (
                    <>
                      <br />
                      latest:{" "}
                      <a href={r.commits[0].url} target="_blank" rel="noopener noreferrer">
                        {r.commits[0].sha}
                      </a>{" "}
                      {r.commits[0].message}
                    </>
                  )}
                </small>
              ) : (
                <small>not reachable ({r.reason}) — link still valid</small>
              )}
            </li>
          );
        })}
      </ul>
    </AsideCard>
  );
}
