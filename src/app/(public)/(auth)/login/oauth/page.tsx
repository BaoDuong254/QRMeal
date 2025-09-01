"use client";

import { useAppContext } from "@/components/AppProvider";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function OAuthPage() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const { setSocket, setRole } = useAppContext();
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
      toast(message || "Đăng nhập thất bại, vui lòng thử lại");
    }
  }, [accessToken, refreshToken, setRole, setSocket, router, message, mutateAsync]);
  return null;
}
