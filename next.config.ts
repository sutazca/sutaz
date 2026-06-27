import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output — bundles only the server + production deps needed to
  // run, producing a self-contained `.next/standalone` server. This is the
  // documented production Docker pattern (see node_modules/next/dist/docs/
  // .../17-deploying.md) and shrinks the final image drastically.
  output: "standalone",

  // Optional production-only flags
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
