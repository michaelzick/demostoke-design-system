import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const STORYBOOK_PROD_URL = "https://designsystem.demostoke.com";
const LOCAL_STORYBOOK_PORT = "6006";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStorybookBaseUrl = () => {
  const envUrl = import.meta.env.VITE_STORYBOOK_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
    if (isLocalHost) {
      const customPort = import.meta.env.VITE_STORYBOOK_PORT?.trim() || LOCAL_STORYBOOK_PORT;
      return `${protocol}//${hostname}:${customPort}`;
    }
  }

  return STORYBOOK_PROD_URL;
};

export const buildStorybookStoryUrl = (componentName: string) => {
  const normalizedBase = getStorybookBaseUrl().replace(/\/$/, "");
  const storyId = componentName.toLowerCase();
  return `${normalizedBase}/?path=/story/ui-${storyId}--default`;
};
