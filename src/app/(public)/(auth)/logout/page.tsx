/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppStore } from "@/components/AppProvider";
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromURL = searchParams.get("refreshToken");
  const accessTokenFromURL = searchParams.get("accessToken");
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
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
        setRole();
        disconnectSocket();
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromURL, accessTokenFromURL, setRole, disconnectSocket]);
  return <div>Logging out...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
