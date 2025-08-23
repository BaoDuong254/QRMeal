"use client";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromURL = searchParams.get("refreshToken");
  useEffect(() => {
    if (ref.current || refreshTokenFromURL !== getRefreshTokenFromLocalStorage()) return;
    ref.current = mutateAsync;
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, router, refreshTokenFromURL]);
  return <div>Logging out...</div>;
};
