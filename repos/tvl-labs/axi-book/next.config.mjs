/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://validity-lang.org/:path*',
            },
        ]
    }
};

export default nextConfig;
