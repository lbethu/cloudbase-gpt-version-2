import { redirect } from "next/navigation";

/** CROS research is the Research Library filtered to CROS-linked records. */
export default function CrosResearch() {
  redirect("/research");
}
