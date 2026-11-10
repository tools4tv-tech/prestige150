// GitHub Pages serves the site from /<repo-name>/, so the deploy workflow sets
// PAGES_BASE_PATH=/prestige150. Netlify and local dev leave it empty (root).
const basePath = process.env.PAGES_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export -> `out/` (static hosting: Netlify / GitHub Pages)
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
