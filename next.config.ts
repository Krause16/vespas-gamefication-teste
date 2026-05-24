import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // next-pwa injects a webpack config incompatible with Turbopack (Next 16 default).
  // PWA manifest is served from public/manifest.json; service worker registered via
  // public/sw-register.js loaded in layout. next-pwa is kept as a dep for future use.
  turbopack: {},
}

export default nextConfig
