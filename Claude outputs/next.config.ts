import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  // Server-only libraries that must not be bundled: they are large, native or
  // dynamic-require based, and bundling them slows builds and exhausts memory
  // on small VMs. Next loads them from node_modules at runtime instead.
  serverExternalPackages: ["@aws-sdk/client-s3", "postgres", "drizzle-orm", "mammoth", "pdf-parse", "googleapis"],
  experimental: {
    // Governed document uploads go through a server action (≤ 25 MB files).
    serverActions: { bodySizeLimit: "30mb" },
    // Keeps production builds within small CI/VM memory limits.
    webpackMemoryOptimizations: true,
    cpus: Math.max(1, Number(process.env.CLOUDBASE_BUILD_CPUS ?? 2)),
  },
};

export default nextConfig;
