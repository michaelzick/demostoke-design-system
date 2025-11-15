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

/**
 * Extract initials from a display name or email
 * Examples:
 * - "John Doe" → "JD"
 * - "john.doe@example.com" → "JD"
 * - "alice_wonderland@test.com" → "AW"
 * - "Bob" → "BO" (single name, use first two letters)
 */
export function getInitials(input: string | null | undefined): string {
  if (!input) return 'DS'; // Default to "DemoStoke" initials
  
  // If it's an email, extract the name part before @
  const nameOrEmail = input.includes('@') ? input.split('@')[0] : input;
  
  // Replace common separators with spaces
  const normalized = nameOrEmail
    .replace(/[._-]/g, ' ')
    .trim();
  
  // Split into words
  const words = normalized.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return 'DS';
  } else if (words.length === 1) {
    // Single word: take first two letters
    const word = words[0].toUpperCase();
    return word.length >= 2 ? word.slice(0, 2) : word + 'X';
  } else {
    // Multiple words: take first letter of first and last word
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
}

/**
 * Generate a Dicebear initials avatar URL with theme-aware primary color
 * Only the cyan/primary color changes - other colors are consistent
 */
export function getInitialsAvatarUrl(initials: string, theme: 'light' | 'dark' = 'light'): string {
  // These colors NEVER change (matching dashboard bars)
  const staticColors = [
    'D946EF', // Fuchsia (bg-fuchsia-500)
    'FB923C', // Orange (bg-orange-400) 
    'F43F5E', // Rose (bg-rose-500)
  ];
  
  // Only the cyan/primary color changes based on theme
  const primaryLight = '00C3EB'; // hsl(186 100% 48%) converted to hex
  const primaryDark = '0EA5E9';  // hsl(199 89% 48%) converted to hex
  
  const primaryColor = theme === 'dark' ? primaryDark : primaryLight;
  
  // Combine: primary first, then static colors
  const allColors = [primaryColor, ...staticColors];
  
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=${allColors.join(',')}&textColor=ffffff&fontFamily=Inter&fontSize=42&fontWeight=600`;
}
