import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the LAN hostname so phones can load HMR + JS chunks from this machine.
  allowedDevOrigins: ['192.168.178.26'],
};

export default nextConfig;
