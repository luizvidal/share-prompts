/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.googleusercontent.com",
				port: "",
			},
		],
	},
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  }
}

export default nextConfig
