"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, FolderOpen, HardDrive, Search, ShieldCheck } from "lucide-react";
import styles from "./DriveSearchView.module.css";

type DriveMatchType = "title-exact" | "title-partial" | "content";

interface DriveResult {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
  modifiedTime?: string;
  parentFolderLink?: string;
  parentFolderName?: string;
  matchType: DriveMatchType;
}

type Status = "idle" | "loading" | "error" | "unconfigured";

// Drive's API doesn't return a relevance score or a matched snippet, so this
// reflects exactly what we can verify (the file name) rather than a made-up
// confidence percentage. Ranking and labels come from the same classification
// done server-side in src/lib/googleDrive.ts.
const MATCH_LABEL: Record<DriveMatchType, { label: string; tone: "green" | "amber" | "blue" }> = {
  "title-exact": { label: "Best match — file name matches", tone: "green" },
  "title-partial": { label: "Likely match — partial file name match", tone: "amber" },
  content: { label: "Found inside document text", tone: "blue" },
};

export function DriveSearchView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DriveResult[] | null>(null);
  const [selected, setSelected] = useState<DriveResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const runSearch = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!query.trim()) return;
    setStatus("loading");
    setSelected(null);
    try {
      const response = await fetch(`/api/drive/search?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();
      if (!data.configured) {
        setStatus("unconfigured");
        setResults([]);
        return;
      }
      if (data.error) {
        setStatus("error");
        setErrorMessage(data.error);
        setResults([]);
        return;
      }
      setResults(data.results);
      setSelected(data.results[0] || null);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach the Drive search endpoint.");
      setResults([]);
    }
  };

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">Live source, not mock</span>
        <h1>Google Drive Search</h1>
        <p>
          Search your access-limited Google Drive folder directly. A match opens the actual document below and links back
          to the exact file and its containing folder — nothing is copied or duplicated into this app.
        </p>
      </div>

      <form className={`panel ${styles.searchBox}`} onSubmit={runSearch}>
        <HardDrive size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by keyword, file name, or phrase inside a document…"
        />
        <button className="button primary" type="submit" disabled={status === "loading"}>
          <Search size={16} /> {status === "loading" ? "Searching…" : "Search Drive"}
        </button>
      </form>

      {status === "unconfigured" && (
        <div className={`panel ${styles.notice}`}>
          <ShieldCheck />
          <div>
            <strong>Google Drive is not connected yet.</strong>
            <p>
              Add <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code> and <code>GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY</code> (and
              optionally <code>GOOGLE_DRIVE_ROOT_FOLDER_IDS</code>) to your environment, then share the target Drive folder
              with that service account&rsquo;s email address. Full steps are in{" "}
              <code>docs/google-drive-integration.md</code>.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className={`panel ${styles.notice} ${styles.error}`}>
          <div>
            <strong>Search failed.</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <div className={styles.layout}>
          <div className={`panel ${styles.resultList}`}>
            <span className={styles.resultCount}>
              {results.length} result{results.length === 1 ? "" : "s"}, ranked by match strength
            </span>
            {results.map((result, index) => {
              const match = MATCH_LABEL[result.matchType] ?? MATCH_LABEL.content;
              return (
                <button
                  key={result.id}
                  className={selected?.id === result.id ? styles.selected : undefined}
                  onClick={() => setSelected(result)}
                >
                  <div className={styles.resultTop}>
                    <span className={styles.resultRank}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`badge badge-${match.tone}`}>{match.label}</span>
                  </div>
                  <strong>{result.name}</strong>
                  <span>{result.parentFolderName || "Drive"}</span>
                </button>
              );
            })}
          </div>

          {selected && (
            <div className={`panel ${styles.preview}`}>
              <div className={styles.previewHeader}>
                <div>
                  <span className={`badge badge-${(MATCH_LABEL[selected.matchType] ?? MATCH_LABEL.content).tone}`}>
                    {(MATCH_LABEL[selected.matchType] ?? MATCH_LABEL.content).label}
                  </span>
                  <strong>{selected.name}</strong>
                  {selected.modifiedTime && <span>Last modified {new Date(selected.modifiedTime).toLocaleDateString()}</span>}
                </div>
                <div className={styles.previewActions}>
                  <a href={selected.webViewLink} target="_blank" rel="noreferrer" className="button secondary">
                    Open document <ExternalLink size={14} />
                  </a>
                  {selected.parentFolderLink && (
                    <a href={selected.parentFolderLink} target="_blank" rel="noreferrer" className="button secondary">
                      Open containing folder <FolderOpen size={14} />
                    </a>
                  )}
                </div>
              </div>
              <iframe
                key={selected.id}
                className={styles.previewFrame}
                src={`https://drive.google.com/file/d/${selected.id}/preview`}
                allow="autoplay"
              />
            </div>
          )}
        </div>
      )}

      {results && results.length === 0 && status === "idle" && (
        <div className="panel no-results">
          <Search />
          <h3>No matching files</h3>
          <p>Try a different keyword, or confirm the file lives inside a folder shared with the service account.</p>
        </div>
      )}
    </>
  );
}
