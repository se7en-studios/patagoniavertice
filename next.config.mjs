// Los archivos de /public no llevan hash en el nombre: 30 días, sin `immutable`.
const STATIC_CACHE = "public, max-age=2592000";

const staticAssetHeaders = ["/videos/:path*", "/mari-menuco/:path*", "/hero-poster.jpg", "/bg-hero-opt.mp4", "/bg-hero.webm"].map(
  (source) => ({
    source,
    headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
  }),
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      ...staticAssetHeaders,
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
