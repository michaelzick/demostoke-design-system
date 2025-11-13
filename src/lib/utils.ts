import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const STORYBOOK_PROD_URL = "https://designsystem.demostoke.com";
const STORYBOOK_DEFAULT_PORT = "6006";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

const ensureProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const applyStorybookPort = (rawUrl: string) => {
  const port = import.meta.env.VITE_STORYBOOK_PORT?.trim() || STORYBOOK_DEFAULT_PORT;
  try {
    const withProtocol = ensureProtocol(rawUrl);
    const url = new URL(withProtocol);
    url.port = port;
    return trimTrailingSlash(url.toString());
  } catch {
    return trimTrailingSlash(rawUrl);
  }
};

export const getStorybookBaseUrl = () => {
  const envUrl = import.meta.env.VITE_STORYBOOK_URL?.trim();
  if (envUrl) {
    return applyStorybookPort(envUrl);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const base = `${protocol}//${hostname}`;
    return applyStorybookPort(base);
  }

  return applyStorybookPort(STORYBOOK_PROD_URL);
};

export const buildStorybookStoryUrl = (componentName: string) => {
  const normalizedBase = getStorybookBaseUrl();
  const storyId = componentName.toLowerCase();
  return `${normalizedBase}/?path=/story/ui-${storyId}--default`;
};
