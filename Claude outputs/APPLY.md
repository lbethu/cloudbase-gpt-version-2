# Applying CloudBase AI v2 to your local repo

The archive `cloudbase-ai-v2.tar.gz` is a full snapshot of the repository (no node_modules, no source-documents, no .git).
A copy was also written to `~/Cloudpoint-KNowledgebaseGPT_V1/._sync/cloudbase-sync.tar.gz` before your Mac disconnected.

```bash
cd ~/Cloudpoint-KNowledgebaseGPT_V1
git checkout -b cloudbase-v2

# 1. Remove files that moved into src/legacy or were retired (see cloudbase-remove.txt)
git rm -r -q src/components src/data src/types src/lib/retrieval.ts src/app/page.tsx src/app/presentation

# 2. Remove the publicly served copies of the SOP documents (they are now served only via /api/files with authorization)
git rm -r -q public/source-documents

# 3. Extract the snapshot over the working tree
tar xzf ._sync/cloudbase-sync.tar.gz     # or the downloaded cloudbase-ai-v2.tar.gz
rm -rf ._sync

# 4. Install new dependencies and verify
npm install
cp .env.example .env.local
npm run verify          # typecheck + 44 tests + production build
npm run dev             # http://localhost:3000
```
