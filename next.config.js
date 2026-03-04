/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone', // For Docker optimization
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.public.blob.vercel-storage.com',
			},
			{
				protocol: 'https',
				hostname: 'public.blob.vercel-storage.com',
			}
		],
	},
}

export default nextConfig
