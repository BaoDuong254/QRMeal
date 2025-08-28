/* eslint-disable @typescript-eslint/no-explicit-any */
import authApiRequest from "@/apiRequests/auth";
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import { TokenPayload } from "@/types/jwt.types";
import guestApiRequest from "@/apiRequests/guest";

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
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  const now = new Date().getTime() / 1000 - 1;

  // If the refresh token is expired, do nothing (user needs to log in again)
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError?.();
  }

  if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      const role = decodedRefreshToken.role;
      const res = role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess?.();
    } catch (error) {
      param?.onError?.();
      console.error("Error refreshing token:", error);
    }
  }
};

/**
 * Formats a number as currency in Vietnamese Dong (VND).
 *
 * @param number The number to be formatted as currency.
 * @returns The formatted currency string in Vietnamese Dong (VND).
 */
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

/**
 * Gets the Vietnamese translation of a dish status.
 *
 * @param status The status of the dish.
 * @returns The Vietnamese translation of the dish status.
 */
export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

/**
 * Gets the Vietnamese translation of an order status.
 *
 * @param status The status of the order.
 * @returns The Vietnamese translation of the order status.
 */
export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

/**
 * Gets the Vietnamese translation of a table status.
 *
 * @param status The status of the table.
 * @returns The Vietnamese translation of the table status.
 */
export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

/**
 * Generates a table link with the provided token and table number.
 *
 * @param param An object containing the token and table number.
 * @returns The generated table link as a string.
 */
export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token;
};

/**
 * Decodes a JWT token and returns its payload.
 *
 * @param token The JWT token to be decoded.
 * @returns The decoded token payload or null if decoding fails.
 */
export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
