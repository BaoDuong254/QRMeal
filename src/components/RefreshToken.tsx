/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
    let interval: any = null;
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    const TIME_OUT = 10 * 60 * 1000; // 10 minutes
    interval = setInterval(checkAndRefreshToken, TIME_OUT);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
}
