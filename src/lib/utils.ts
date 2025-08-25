/* eslint-disable @typescript-eslint/no-explicit-any */
import authApiRequest from "@/apiRequests/auth";
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a path by removing leading slashes.
 *
 * @param path Normalizes a path by removing leading slashes.
 * @returns The normalized path without leading slashes.
 *
 * @example
 * normalizePath("/api/auth/login") // returns "api/auth/login"
 * normalizePath("api/auth/login") // returns "api/auth/login"
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

/**
 * Handles API errors and sets form errors if provided.
 *
 * @param error The error object from the API response.
 * @param setError Optional function to set form errors.
 * @param duration Optional duration for the toast notification.
 */
export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error(error?.payload?.message || "Something went wrong", {
      duration: duration || 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

/**
 * Retrieves the access token from local storage.
 *
 * @returns The access token if it exists, otherwise null.
 */
export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

/**
 * Retrieves the refresh token from local storage.
 *
 * @returns The refresh token if it exists, otherwise null.
 */
export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

/**
 * Stores the access token in local storage.
 *
 * @param token The access token to be stored.
 */
export const setAccessTokenToLocalStorage = (token: string) => {
  if (isBrowser) localStorage.setItem("accessToken", token);
};

/**
 * Stores the refresh token in local storage.
 *
 * @param token The refresh token to be stored.
 */
export const setRefreshTokenToLocalStorage = (token: string) => {
  if (isBrowser) localStorage.setItem("refreshToken", token);
};

/**
 * Removes both access and refresh tokens from local storage.
 *
 * @returns void
 */
export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

/**
 * Checks the validity of the access token and refreshes it if necessary.
 *
 * @param param Optional callbacks for success and error handling.
 * @returns A promise that resolves when the token check and refresh process is complete.
 */
export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number };
  const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number };
  const now = Math.round(new Date().getTime() / 1000);

  // If the refresh token is expired, do nothing (user needs to log in again)
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError?.();
  }

  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess?.();
    } catch (_error) {
      param?.onError?.();
    }
  }
};
