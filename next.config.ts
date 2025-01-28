import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@toolpad/core"],
}

export default nextConfig
