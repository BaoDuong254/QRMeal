/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import socket from "@/lib/socket";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATHS = ["/login", "/logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
    let interval: any = null;
    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
        force,
      });
    onRefreshToken();
    const TIME_OUT = 10 * 60 * 1000; // 10 minutes
    interval = setInterval(onRefreshToken, TIME_OUT);
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Connected to server with ID:", socket.id);
    }

    function onDisconnect() {
      console.log("Disconnected from server");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router]);
  return null;
}
