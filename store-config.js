function withStoreConfig(nextConfig = { images: {
  remotePatterns: [
    // ...
    {
      protocol: "https", // or https
      hostname:"newstore-production-cfb3.up.railway.app",
    },
    // ...
  ],
},}) {
  const features = nextConfig.features || {}
  delete nextConfig.features

  nextConfig.env = nextConfig.env || {}

  Object.entries(features).forEach(([key, value]) => {
    if (value) {
      nextConfig.env[`FEATURE_${key.toUpperCase()}_ENABLED`] = true
    }
  })

  return nextConfig
}

module.exports = { withStoreConfig }
