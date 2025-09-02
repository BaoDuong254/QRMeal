"use client";

import { useAppStore } from "@/components/AppProvider";
import { useRouter } from "@/i18n/navigation";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function OAuthPage() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const router = useRouter();
  const message = searchParams.get("message");
  const count = useRef(0);
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current > 0) return;
      const { role } = decodeToken(accessToken);
      mutateAsync({ accessToken, refreshToken })
        .then(() => {
          setRole(role);
          setSocket(generateSocketInstance(accessToken));
          router.push("/manage/dashboard");
        })
        .catch((e) => {
          toast(e?.message || "Đăng nhập thất bại, vui lòng thử lại");
        })
        .finally(() => {
          count.current += 1;
        });
    } else {
      if (count.current === 0) {
        console.log(message);
        setTimeout(() => {
          toast(message || "Đăng nhập thất bại, vui lòng thử lại");
        });
        count.current += 1;
        router.push("/login");
      }
    }
  }, [accessToken, refreshToken, setRole, setSocket, router, message, mutateAsync]);
  return null;
}
