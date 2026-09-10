import "server-only";
import { getConfig } from "@/server/config";

/**
 * GitHub connector — read-only. Works unauthenticated for public repositories
 * (rate-limited); set GITHUB_TOKEN for private repositories and higher limits.
 * Failures are reported, never thrown into pages.
 */
export interface RepoSummary {
  owner: string;
  repo: string;
  url: string;
  description: string;
  defaultBranch: string;
  stars: number;
  openIssues: number;
  language: string;
  pushedAt?: string;
  private: boolean;
}
export interface RepoCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}
export type RepoResult = { ok: true; summary: RepoSummary; commits: RepoCommit[] } | { ok: false; reason: string; url: string };

const cache = new Map<string, { at: number; value: RepoResult }>();
const TTL = 5 * 60 * 1000;

async function gh<T>(path: string): Promise<T> {
  const { github } = getConfig();
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { accept: "application/vnd.github+json", "user-agent": "cloudbase-ai", ...(github.token ? { authorization: `Bearer ${github.token}` } : {}) },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

export async function getRepository(owner: string, repo: string): Promise<RepoResult> {
  const url = `https://github.com/${owner}/${repo}`;
  if (!getConfig().github.configured) return { ok: false, reason: "GitHub integration disabled", url };
  const key = `${owner}/${repo}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  let value: RepoResult;
  try {
    const r = await gh<{ description: string | null; default_branch: string; stargazers_count: number; open_issues_count: number; language: string | null; pushed_at: string; private: boolean; html_url: string }>(`/repos/${owner}/${repo}`);
    const commits = await gh<Array<{ sha: string; html_url: string; commit: { message: string; author?: { name?: string; date?: string } } }>>(`/repos/${owner}/${repo}/commits?per_page=5`).catch(() => []);
    value = {
      ok: true,
      summary: { owner, repo, url: r.html_url ?? url, description: r.description ?? "", defaultBranch: r.default_branch, stars: r.stargazers_count, openIssues: r.open_issues_count, language: r.language ?? "", pushedAt: r.pushed_at, private: r.private },
      commits: commits.map((c) => ({ sha: c.sha.slice(0, 7), message: c.commit.message.split("\n")[0].slice(0, 100), author: c.commit.author?.name ?? "", date: c.commit.author?.date ?? "", url: c.html_url })),
    };
  } catch (error) {
    value = { ok: false, reason: error instanceof Error ? error.message : "unreachable", url };
  }
  cache.set(key, { at: Date.now(), value });
  return value;
}

export function githubStatus(): { enabled: boolean; authenticated: boolean } {
  const { github } = getConfig();
  return { enabled: github.configured, authenticated: Boolean(github.token) };
}
