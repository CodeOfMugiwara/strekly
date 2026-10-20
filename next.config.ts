import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      /**
       * Next compares the `Origin` header against the `Host` header on every
       * Server Action POST and rejects the request when they differ. On
       * Netlify the host is preserved, so the production origin already
       * matches — but a deploy preview (`deploy-preview-3--strekly.netlify.app`)
       * is a four-label host, and Next's wildcard matcher compares LABEL BY
       * LABEL: `*.netlify.app` (three labels) does NOT match it. The pattern
       * has to be `*.*.netlify.app`.
       */
      allowedOrigins: ["strekly.netlify.app", "*.*.netlify.app"],
    },
  },
};

export default nextConfig;
