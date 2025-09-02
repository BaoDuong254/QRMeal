"use client";
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RefreshToken() {
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
    } else {
      router.push("/");
    }
  }, [router, refreshTokenFromURL, redirectPathname]);
  return <div>Logging out...</div>;
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
