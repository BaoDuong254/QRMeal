import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt.types";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // Redirect to login if accessing private path without login
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }
  if (refreshToken) {
    // Redirect to home if accessing unAuth path while logged in
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Redirect to refresh token if accessing private path without access token
    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // Role-based access control
    const role = decodeToken(refreshToken).role;
    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path));
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path));
    const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path));
    if (isGuestGoToManagePath || isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/guest/:path*"],
};
