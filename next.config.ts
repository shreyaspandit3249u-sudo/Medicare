import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false, // Required for testing service workers/notifications locally
});

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: "file:C:/Users/revap/.gemini/antigravity/scratch/health-assistant/dev.db"
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-libsql", "@libsql/client"],
  async redirects() {
    return [
      {
        source: '/manifest.json',
        destination: '/manifest.webmanifest',
        permanent: true,
      },
    ]
  },
};

export default withPWA(nextConfig);
