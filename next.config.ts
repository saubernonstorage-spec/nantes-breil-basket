import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Anciennes adresses (versions précédentes du site) → nouvelles pages.
  async redirects() {
    return [
      { source: "/calendrier", destination: "/matchs", permanent: true },
      { source: "/competition", destination: "/matchs", permanent: true },
      { source: "/resultats", destination: "/matchs", permanent: true },
      { source: "/le-club", destination: "/club", permanent: true },
      { source: "/rejoindre", destination: "/inscriptions", permanent: true },
      { source: "/jouer-au-nbb", destination: "/equipes", permanent: true },
      { source: "/ecole-de-basket", destination: "/ecoles", permanent: true },
      { source: "/loisirs", destination: "/equipes", permanent: true },
      { source: "/evenements/:path*", destination: "/agenda", permanent: false },
      { source: "/actualites", destination: "/agenda", permanent: false },
      { source: "/admin", destination: "/espace-dirigeants", permanent: false },
      { source: "/confidentialite", destination: "/mentions-legales", permanent: true },
      { source: "/mentions", destination: "/mentions-legales", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        source: "/espace-dirigeants/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
