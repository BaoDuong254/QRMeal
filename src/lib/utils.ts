import { clsx, type ClassValue } from "clsx";
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
