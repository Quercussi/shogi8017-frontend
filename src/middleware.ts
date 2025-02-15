import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");

    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};