import { NextRequest, NextResponse } from "next/server";

interface Routes {
    [key: string]: boolean;
}

const publicUrls: Routes = {
    "/": true,
};

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token");
    const exists = publicUrls[request.nextUrl.pathname];
    if (!accessToken) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/lobby2", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
