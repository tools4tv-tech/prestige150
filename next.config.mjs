/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export -> `out/` (deployed as a static site on Netlify)
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
