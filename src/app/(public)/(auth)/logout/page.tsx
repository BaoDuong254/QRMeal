/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromURL = searchParams.get("refreshToken");
  const accessTokenFromURL = searchParams.get("accessToken");
  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromURL && accessTokenFromURL === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromURL, accessTokenFromURL]);
  return <div>Logging out...</div>;
}
