/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/auth/refresh-token",
                destination: "/api/auth/refresh-token", // 내부 API 라우트 유지
            },
            {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
            },
        ];
    },
};

export default nextConfig;
