"use client";
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromURL = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect") || "/";
  useEffect(() => {
    if (refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname);
        },
      });
    }
  }, [router, refreshTokenFromURL, redirectPathname]);
  return <div>Logging out...</div>;
}
