/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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
