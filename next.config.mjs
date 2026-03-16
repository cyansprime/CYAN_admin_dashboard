/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const apiBase = process.env.CYAN_API_URL || "http://localhost:8080";
    const agriApiBase = process.env.AGRI_RADAR_API_URL || "http://localhost:8000";
    const contentHubBase = process.env.CONTENT_HUB_URL || "http://localhost:8081";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiBase}/api/v1/:path*`,
      },
      {
        source: "/api/agri/:path*",
        destination: `${agriApiBase}/api/v1/:path*`,
      },
      {
        source: "/api/v2/:path*",
        destination: `${contentHubBase}/api/v2/:path*`,
      },
    ];
  },
};

export default nextConfig;
