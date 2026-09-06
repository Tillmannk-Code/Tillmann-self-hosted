/** @type {import('next').NextConfig} */
const nextConfig = {
  // `typescript.ignoreBuildErrors` was removed: the project now type-checks
  // clean, so a real type error should fail the build rather than ship.
  images: {
    unoptimized: true,
  },
  // The OG cards read vendored .ttf files from disk. They are prerendered at
  // build time, but tracing the fonts explicitly means the routes still work
  // if one ever falls back to on-demand rendering.
  outputFileTracingIncludes: {
    '/opengraph-image': ['./assets/fonts/**'],
    '/blog/[slug]/opengraph-image': ['./assets/fonts/**'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          // Hardware the site never uses. No X-Frame-Options on purpose:
          // this is a public marketing site with no authenticated state, and
          // denying embeds would stop it rendering in preview tools.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
