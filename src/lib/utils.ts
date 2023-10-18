import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () =>
  process.env.REACT_PUBLIC_BASE_URL || "https://api-test.innoloft.com";

export const getAppId = () => parseInt(process.env.REACT_PUBLIC_APP_ID || "1");

export const mapThemeToRoot = (color: string) => {
  const root = document.documentElement;

  root.style.setProperty("--primary", color);
};

export const generateCustomError = (error: any) => {
  const errorString = error.message || error.data || error.error;
  const errorStatus = error.status;
  return { status: errorStatus, message: errorString };
};
