import path from "node:path";
import { createFileRepositories } from "@/server/repositories/file-registry";

/** Real registry — tests assert on the governed content shipped with the app. */
export const repos = createFileRepositories(path.resolve(__dirname, "../../content"));
