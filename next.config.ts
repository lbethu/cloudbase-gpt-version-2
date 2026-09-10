import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  experimental: {
    // Keeps production builds within small CI/VM memory limits.
    webpackMemoryOptimizations: true,
    cpus: Math.max(1, Number(process.env.CLOUDBASE_BUILD_CPUS ?? 2)),
  },
};

export default nextConfig;
