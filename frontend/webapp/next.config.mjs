/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"firebasestorage.googleapis.com",
			"lh3.googleusercontent.com",
		],
		minimumCacheTTL: 86400, // cache for 1 day
	},
};

export default nextConfig;
