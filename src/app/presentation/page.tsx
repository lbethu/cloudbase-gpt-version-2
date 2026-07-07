import type { Metadata } from "next";
import { ExecutiveWalkthrough } from "@/components/ExecutiveWalkthrough";

export const metadata: Metadata = {
  title: "Executive Product Walkthrough | CloudBase AI",
  description: "A 5–7 minute executive walkthrough of the CloudBase AI mock-data foundation.",
};

export default function PresentationPage() {
  return <ExecutiveWalkthrough />;
}
