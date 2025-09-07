import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
    const session = await auth(); // <— вот это правильный импорт
    const url = new URL(req.url);

    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/moderation")) {
        if (!session?.user) return NextResponse.redirect(new URL("/?needLogin=1", url));
        const role = (session.user as any).role as "USER" | "MOD" | "ADMIN";
        if (role === "USER") return NextResponse.redirect(new URL("/?forbidden=1", url));
    }
    return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/moderation/:path*"] };
