import type { Metadata } from "next";
import { KnowledgeApp } from "@/legacy/KnowledgeApp";

export const metadata: Metadata = { title: "Legacy prototype" };

export default function LegacyPage() {
  return <KnowledgeApp />;
}
