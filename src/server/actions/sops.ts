"use server";

import { revalidatePath } from "next/cache";
import { getCurrentIdentity } from "@/server/auth/identity";
import { ensureRepositories } from "@/server/repositories";
import { approveSopVersion, deleteSop, retireSop, sendBackSopVersion, submitSopVersion, uploadSopDocument, type WorkflowResult } from "@/server/services/sop-workflow";

/** Server actions: identity is resolved server-side; the client only sends intent. */

export interface ActionState {
  ok?: boolean;
  message?: string;
  sopId?: string;
}

const toState = (r: WorkflowResult): ActionState => (r.ok ? { ok: true, message: r.message, sopId: r.sopId } : { ok: false, message: r.error });

export async function sopTransitionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const identity = await getCurrentIdentity();
  if (!identity) return { ok: false, message: "Not authenticated." };
  await ensureRepositories();
  const sopId = String(formData.get("sopId") ?? "");
  const version = String(formData.get("version") ?? "");
  const note = String(formData.get("note") ?? "");
  const action = String(formData.get("action") ?? "");
  const needsVersion = action !== "retire" && action !== "delete";
  if (!/^[A-Za-z0-9._-]+$/.test(sopId) || (needsVersion && !version)) return { ok: false, message: "Invalid request." };
  let result: WorkflowResult;
  if (action === "approve") result = await approveSopVersion(identity, sopId, version, note);
  else if (action === "send-back") result = await sendBackSopVersion(identity, sopId, version, note);
  else if (action === "submit") result = await submitSopVersion(identity, sopId, version);
  else if (action === "retire") result = await retireSop(identity, sopId, note);
  else if (action === "delete") result = await deleteSop(identity, sopId, note);
  else return { ok: false, message: "Unknown action." };
  if (result.ok) {
    revalidatePath(`/sops/${sopId}`);
    revalidatePath("/sops");
    revalidatePath("/governance/reviews");
    revalidatePath("/search");
    revalidatePath("/");
  }
  return toState(result);
}

export async function uploadSopAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const identity = await getCurrentIdentity();
  if (!identity) return { ok: false, message: "Not authenticated." };
  await ensureRepositories();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) return { ok: false, message: "Choose a .docx or .pdf file." };
  const result = await uploadSopDocument(identity, {
    fileName: file.name,
    bytes: Buffer.from(await file.arrayBuffer()),
    title: String(formData.get("title") ?? ""),
    sopNumber: String(formData.get("sopNumber") ?? ""),
    owningTeam: String(formData.get("owningTeam") ?? ""),
    category: String(formData.get("category") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    existingSopId: String(formData.get("existingSopId") ?? "") || undefined,
    submitForReview: formData.get("submitForReview") === "on",
  });
  if (result.ok) {
    revalidatePath("/sops");
    revalidatePath(`/sops/${result.sopId}`);
    revalidatePath("/governance/reviews");
  }
  return toState(result);
}
