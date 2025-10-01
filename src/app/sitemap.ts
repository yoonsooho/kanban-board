import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://goaldiary.vercel.app";

    return [
        {
            url: "https://goaldiary.vercel.app",
            lastModified: new Date(),
            changeFrequency: "daily", // 매일 업데이트됨을 알림
            priority: 1, // 최고 우선순위
        },
        {
            url: "https://goaldiary.vercel.app/main",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8, // 높은 우선순위
        },
    ];
}
