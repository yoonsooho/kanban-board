import { NextResponse } from "next/server";

export async function GET(req: Request) {
    if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // 🔄 Render 서버 ping
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`);
        if (!res.ok) throw new Error("Ping failed");
        console.log("✅ Render ping success:", new Date().toISOString());
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("❌ Render ping error:", err);
        return NextResponse.json({ ok: false, error: String(err) });
    }
}
