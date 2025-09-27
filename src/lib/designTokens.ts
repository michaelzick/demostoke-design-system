export type ColorMode = "light" | "dark";

interface HslHexPair {
  hsl: string;
  hex: string;
}

export interface ColorToken {
  name: string;
  cssVariable: string;
  description: string;
  light: HslHexPair;
  dark: HslHexPair;
}

export interface TypographyToken {
  name: string;
  tailwindClass: string;
  fontSize: string;
  lineHeight: string;
  description?: string;
}

export interface SpacingToken {
  name: string;
  cssVariable: string;
  value: string;
  tailwindClass: string;
  description?: string;
}

export interface RadiusToken {
  name: string;
  cssVariable: string;
  value: string;
  tailwindClass: string;
  description?: string;
}

const toFixedHex = (value: number) => value.toString(16).padStart(2, "0");

const hslToHex = (hsl: string): string => {
  const [hPart, sPart, lPart] = hsl
    .trim()
    .split(/\s+/)
    .map((part) => part.replace("%", ""));

  const h = parseFloat(hPart);
  const s = parseFloat(sPart) / 100;
  const l = parseFloat(lPart) / 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));

  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);

  return `#${toFixedHex(r)}${toFixedHex(g)}${toFixedHex(b)}`;
};

const createColorToken = ({
  name,
  cssVariable,
  description,
  lightHsl,
  darkHsl,
}: {
  name: string;
  cssVariable: string;
  description: string;
  lightHsl: string;
  darkHsl: string;
}): ColorToken => ({
  name,
  cssVariable,
  description,
  light: { hsl: lightHsl, hex: hslToHex(lightHsl) },
  dark: { hsl: darkHsl, hex: hslToHex(darkHsl) },
});

export const colorTokens: ColorToken[] = [
  createColorToken({
    name: "Primary",
    cssVariable: "--primary",
    description: "DemoStoke Cyan Blue – primary brand color",
    lightHsl: "186 100% 48%",
    darkHsl: "199 89% 48%",
  }),
  createColorToken({
    name: "Primary Foreground",
    cssVariable: "--primary-foreground",
    description: "Text on primary surfaces",
    lightHsl: "210 40% 98%",
    darkHsl: "222.2 84% 4.9%",
  }),
  createColorToken({
    name: "Secondary",
    cssVariable: "--secondary",
    description: "Secondary brand accent",
    lightHsl: "39 71% 84%",
    darkHsl: "39 30% 76%",
  }),
  createColorToken({
    name: "Secondary Foreground",
    cssVariable: "--secondary-foreground",
    description: "Text on secondary surfaces",
    lightHsl: "222.2 84% 4.9%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Accent",
    cssVariable: "--accent",
    description: "Neutral accent background",
    lightHsl: "210 40% 96.1%",
    darkHsl: "217.2 32.6% 17.5%",
  }),
  createColorToken({
    name: "Accent Foreground",
    cssVariable: "--accent-foreground",
    description: "Text on accent surfaces",
    lightHsl: "222.2 84% 4.9%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Background",
    cssVariable: "--background",
    description: "Application background",
    lightHsl: "0 0% 100%",
    darkHsl: "222.2 84% 4.9%",
  }),
  createColorToken({
    name: "Foreground",
    cssVariable: "--foreground",
    description: "Primary text color",
    lightHsl: "222.2 84% 4.9%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Card",
    cssVariable: "--card",
    description: "Card background",
    lightHsl: "0 0% 100%",
    darkHsl: "222.2 84% 4.9%",
  }),
  createColorToken({
    name: "Card Foreground",
    cssVariable: "--card-foreground",
    description: "Text on card surfaces",
    lightHsl: "222.2 84% 4.9%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Popover",
    cssVariable: "--popover",
    description: "Popover background",
    lightHsl: "0 0% 100%",
    darkHsl: "222.2 84% 4.9%",
  }),
  createColorToken({
    name: "Popover Foreground",
    cssVariable: "--popover-foreground",
    description: "Text on popovers",
    lightHsl: "222.2 84% 4.9%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Muted",
    cssVariable: "--muted",
    description: "Muted background",
    lightHsl: "210 40% 96.1%",
    darkHsl: "217.2 32.6% 17.5%",
  }),
  createColorToken({
    name: "Muted Foreground",
    cssVariable: "--muted-foreground",
    description: "Muted text",
    lightHsl: "215.4 16.3% 46.9%",
    darkHsl: "215 20.2% 65.1%",
  }),
  createColorToken({
    name: "Border",
    cssVariable: "--border",
    description: "Component borders",
    lightHsl: "214.3 31.8% 91.4%",
    darkHsl: "217.2 32.6% 17.5%",
  }),
  createColorToken({
    name: "Input",
    cssVariable: "--input",
    description: "Input borders",
    lightHsl: "214.3 31.8% 91.4%",
    darkHsl: "217.2 32.6% 17.5%",
  }),
  createColorToken({
    name: "Ring",
    cssVariable: "--ring",
    description: "Focus halo",
    lightHsl: "199 89% 48%",
    darkHsl: "224.3 76.3% 48%",
  }),
  createColorToken({
    name: "Destructive",
    cssVariable: "--destructive",
    description: "Destructive & error surfaces",
    lightHsl: "0 84.2% 60.2%",
    darkHsl: "0 62.8% 30.6%",
  }),
  createColorToken({
    name: "Destructive Foreground",
    cssVariable: "--destructive-foreground",
    description: "Text on destructive surfaces",
    lightHsl: "210 40% 98%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Success",
    cssVariable: "--success",
    description: "Positive & success states",
    lightHsl: "142 70% 45%",
    darkHsl: "142 70% 50%",
  }),
  createColorToken({
    name: "Success Foreground",
    cssVariable: "--success-foreground",
    description: "Text on success surfaces",
    lightHsl: "210 40% 98%",
    darkHsl: "222.2 84% 4.9%",
  }),
  createColorToken({
    name: "Warning",
    cssVariable: "--warning",
    description: "Warning & caution states",
    lightHsl: "38 95% 55%",
    darkHsl: "38 90% 60%",
  }),
  createColorToken({
    name: "Warning Foreground",
    cssVariable: "--warning-foreground",
    description: "Text on warning surfaces",
    lightHsl: "222.2 84% 4.9%",
    darkHsl: "222.2 84% 4.9%",
  }),
  createColorToken({
    name: "Sidebar Background",
    cssVariable: "--sidebar-background",
    description: "Sidebar background",
    lightHsl: "0 0% 98%",
    darkHsl: "240 5.9% 10%",
  }),
  createColorToken({
    name: "Sidebar Foreground",
    cssVariable: "--sidebar-foreground",
    description: "Sidebar text",
    lightHsl: "240 5.3% 26.1%",
    darkHsl: "240 4.8% 95.9%",
  }),
  createColorToken({
    name: "Sidebar Primary",
    cssVariable: "--sidebar-primary",
    description: "Sidebar active elements",
    lightHsl: "240 5.9% 10%",
    darkHsl: "224.3 76.3% 48%",
  }),
  createColorToken({
    name: "Sidebar Primary Foreground",
    cssVariable: "--sidebar-primary-foreground",
    description: "Text on primary sidebar elements",
    lightHsl: "0 0% 98%",
    darkHsl: "210 40% 98%",
  }),
  createColorToken({
    name: "Sidebar Accent",
    cssVariable: "--sidebar-accent",
    description: "Sidebar accent surfaces",
    lightHsl: "240 4.8% 95.9%",
    darkHsl: "240 3.7% 15.9%",
  }),
  createColorToken({
    name: "Sidebar Accent Foreground",
    cssVariable: "--sidebar-accent-foreground",
    description: "Text on sidebar accents",
    lightHsl: "240 5.9% 10%",
    darkHsl: "240 4.8% 95.9%",
  }),
  createColorToken({
    name: "Sidebar Border",
    cssVariable: "--sidebar-border",
    description: "Sidebar borders",
    lightHsl: "220 13% 91%",
    darkHsl: "240 3.7% 15.9%",
  }),
  createColorToken({
    name: "Sidebar Ring",
    cssVariable: "--sidebar-ring",
    description: "Sidebar focus ring",
    lightHsl: "217.2 91.2% 59.8%",
    darkHsl: "217.2 91.2% 59.8%",
  }),
];

export const typographyTokens: TypographyToken[] = [
  {
    name: "Display Large",
    tailwindClass: "text-display-lg",
    fontSize: "3.5rem (56px)",
    lineHeight: "1.2",
    description: "Hero headings and marquee moments",
  },
  {
    name: "Display Medium",
    tailwindClass: "text-display-md",
    fontSize: "2.75rem (44px)",
    lineHeight: "1.2",
    description: "Section hero headings",
  },
  {
    name: "Display Small",
    tailwindClass: "text-display-sm",
    fontSize: "2.25rem (36px)",
    lineHeight: "1.2",
    description: "Prominent marketing copy",
  },
  {
    name: "Heading Large",
    tailwindClass: "text-heading-lg",
    fontSize: "1.875rem (30px)",
    lineHeight: "1.2",
    description: "Primary page headings",
  },
  {
    name: "Heading Medium",
    tailwindClass: "text-heading-md",
    fontSize: "1.5rem (24px)",
    lineHeight: "1.2",
    description: "Section headings",
  },
  {
    name: "Heading Small",
    tailwindClass: "text-heading-sm",
    fontSize: "1.25rem (20px)",
    lineHeight: "1.5",
    description: "Sub-section headings",
  },
  {
    name: "Body Large",
    tailwindClass: "text-body-lg",
    fontSize: "1.125rem (18px)",
    lineHeight: "1.75",
    description: "Lead paragraphs and key copy",
  },
  {
    name: "Body Medium",
    tailwindClass: "text-body-md",
    fontSize: "1rem (16px)",
    lineHeight: "1.5",
    description: "Standard body text",
  },
  {
    name: "Body Small",
    tailwindClass: "text-body-sm",
    fontSize: "0.875rem (14px)",
    lineHeight: "1.5",
    description: "Supportive text and captions",
  },
  {
    name: "Caption",
    tailwindClass: "text-caption",
    fontSize: "0.75rem (12px)",
    lineHeight: "1.5",
    description: "Caption text and legal copy",
  },
];

export const spacingTokens: SpacingToken[] = [
  {
    name: "Extra Small",
    cssVariable: "--spacing-xs",
    value: "4px",
    tailwindClass: "p-xs",
    description: "Tight spacing and micro layouts",
  },
  {
    name: "Small",
    cssVariable: "--spacing-sm",
    value: "8px",
    tailwindClass: "p-sm",
    description: "Small gaps and compact layouts",
  },
  {
    name: "Medium",
    cssVariable: "--spacing-md",
    value: "16px",
    tailwindClass: "p-md",
    description: "Default spacing",
  },
  {
    name: "Large",
    cssVariable: "--spacing-lg",
    value: "24px",
    tailwindClass: "p-lg",
    description: "Section spacing",
  },
  {
    name: "Extra Large",
    cssVariable: "--spacing-xl",
    value: "32px",
    tailwindClass: "p-xl",
    description: "Page gutters",
  },
  {
    name: "2X Large",
    cssVariable: "--spacing-2xl",
    value: "48px",
    tailwindClass: "p-2xl",
    description: "Hero padding",
  },
  {
    name: "3X Large",
    cssVariable: "--spacing-3xl",
    value: "64px",
    tailwindClass: "p-3xl",
    description: "Feature sections",
  },
  {
    name: "4X Large",
    cssVariable: "--spacing-4xl",
    value: "96px",
    tailwindClass: "p-4xl",
    description: "Full-width hero sections",
  },
];

export const radiusTokens: RadiusToken[] = [
  {
    name: "Default Radius",
    cssVariable: "--radius",
    value: "0.5rem",
    tailwindClass: "rounded-md",
    description: "Global default corner radius",
  },
  {
    name: "Small Radius",
    cssVariable: "--radius-sm",
    value: "0.25rem",
    tailwindClass: "rounded-sm",
    description: "Small surface rounding",
  },
  {
    name: "Medium Radius",
    cssVariable: "--radius-md",
    value: "0.375rem",
    tailwindClass: "rounded",
    description: "Medium surface rounding",
  },
  {
    name: "Large Radius",
    cssVariable: "--radius-lg",
    value: "0.75rem",
    tailwindClass: "rounded-lg",
    description: "Large surface rounding",
  },
  {
    name: "XL Radius",
    cssVariable: "--radius-xl",
    value: "1rem",
    tailwindClass: "rounded-xl",
    description: "Hero components and modals",
  },
];

const colorByVariable = new Map(colorTokens.map((token) => [token.cssVariable, token]));

export const getColorToken = (cssVariable: string): ColorToken | undefined =>
  colorByVariable.get(cssVariable);

const hexFor = (cssVariable: string, mode: ColorMode): string | undefined => {
  const token = getColorToken(cssVariable);
  if (!token) {
    return undefined;
  }
  return mode === "light" ? token.light.hex : token.dark.hex;
};

const requireHexFor = (cssVariable: string, mode: ColorMode): string => {
  const hex = hexFor(cssVariable, mode);
  if (!hex) {
    throw new Error(`Missing design token for ${cssVariable} (${mode})`);
  }
  return hex;
};

export const designSystemDefaults = {
  // Core colors
  primary_color: requireHexFor("--primary", "light"),
  primary_color_dark: requireHexFor("--primary", "dark"),
  secondary_color: requireHexFor("--secondary", "light"),
  secondary_color_dark: requireHexFor("--secondary", "dark"),
  accent_color: requireHexFor("--accent", "light"),
  accent_color_dark: requireHexFor("--accent", "dark"),
  success_color: requireHexFor("--success", "light"),
  success_color_dark: requireHexFor("--success", "dark"),
  destructive_color: requireHexFor("--destructive", "light"),
  destructive_color_dark: requireHexFor("--destructive", "dark"),
  warning_color: requireHexFor("--warning", "light"),
  warning_color_dark: requireHexFor("--warning", "dark"),
  background_color: requireHexFor("--background", "light"),
  background_color_dark: requireHexFor("--background", "dark"),
  foreground_color: requireHexFor("--foreground", "light"),
  foreground_color_dark: requireHexFor("--foreground", "dark"),
  muted_color: requireHexFor("--muted", "light"),
  muted_color_dark: requireHexFor("--muted", "dark"),
  border_color: requireHexFor("--border", "light"),
  border_color_dark: requireHexFor("--border", "dark"),
  ring_color: requireHexFor("--ring", "light"),
  ring_color_dark: requireHexFor("--ring", "dark"),

  sidebar_background: requireHexFor("--sidebar-background", "light"),
  sidebar_background_dark: requireHexFor("--sidebar-background", "dark"),
  sidebar_foreground: requireHexFor("--sidebar-foreground", "light"),
  sidebar_foreground_dark: requireHexFor("--sidebar-foreground", "dark"),
  sidebar_primary: requireHexFor("--sidebar-primary", "light"),
  sidebar_primary_dark: requireHexFor("--sidebar-primary", "dark"),
  sidebar_primary_foreground: requireHexFor("--sidebar-primary-foreground", "light"),
  sidebar_primary_foreground_dark: requireHexFor("--sidebar-primary-foreground", "dark"),
  sidebar_accent: requireHexFor("--sidebar-accent", "light"),
  sidebar_accent_dark: requireHexFor("--sidebar-accent", "dark"),
  sidebar_accent_foreground: requireHexFor("--sidebar-accent-foreground", "light"),
  sidebar_accent_foreground_dark: requireHexFor("--sidebar-accent-foreground", "dark"),
  sidebar_border: requireHexFor("--sidebar-border", "light"),
  sidebar_border_dark: requireHexFor("--sidebar-border", "dark"),
  sidebar_ring: requireHexFor("--sidebar-ring", "light"),
  sidebar_ring_dark: requireHexFor("--sidebar-ring", "dark"),

  // Spacing scale
  spacing_xs: spacingTokens[0].value,
  spacing_sm: spacingTokens[1].value,
  spacing_md: spacingTokens[2].value,
  spacing_lg: spacingTokens[3].value,
  spacing_xl: spacingTokens[4].value,
  spacing_2xl: spacingTokens[5].value,
  spacing_3xl: spacingTokens[6].value,
  spacing_4xl: spacingTokens[7].value,

  // Typography scale
  font_display_lg: "3.5rem",
  font_display_md: "2.75rem",
  font_display_sm: "2.25rem",
  font_heading_lg: "1.875rem",
  font_heading_md: "1.5rem",
  font_heading_sm: "1.25rem",
  font_body_lg: "1.125rem",
  font_body_md: "1rem",
  font_body_sm: "0.875rem",
  font_caption: "0.75rem",
};

export type DesignSystemDefaults = typeof designSystemDefaults;

export const designTokenSettingKeys = Object.keys(designSystemDefaults) as Array<keyof DesignSystemDefaults>;

export const legacyDesignTokenValues: Partial<Record<keyof DesignSystemDefaults, string[]>> = {
  primary_color: ["#3b82f6"],
  primary_color_dark: ["#60a5fa"],
  secondary_color: ["#6b7280"],
  secondary_color_dark: ["#9ca3af"],
  accent_color: ["#f59e0b"],
  accent_color_dark: ["#fbbf24"],
  success_color: ["#10b981"],
  success_color_dark: ["#34d399"],
  destructive_color_dark: ["#f87171"],
  warning_color: ["#f59e0b"],
  warning_color_dark: ["#fbbf24"],
  background_color_dark: ["#0f172a"],
  foreground_color: ["#0f172a"],
  border_color_dark: ["#334155"],
  ring_color: ["#3b82f6"],
  ring_color_dark: ["#60a5fa"],
  sidebar_background: ["#f8fafc"],
  sidebar_background_dark: ["#020817"],
  sidebar_foreground: ["#0f172a"],
  sidebar_foreground_dark: ["#f8fafc"],
  sidebar_primary: ["#3b82f6"],
  sidebar_primary_dark: ["#60a5fa"],
  sidebar_primary_foreground: ["#ffffff"],
  sidebar_primary_foreground_dark: ["#0f172a"],
  sidebar_accent: ["#f1f5f9"],
  sidebar_accent_dark: ["#1e293b"],
  sidebar_accent_foreground: ["#0f172a"],
  sidebar_accent_foreground_dark: ["#f8fafc"],
  sidebar_border: ["#e2e8f0"],
  sidebar_border_dark: ["#334155"],
  spacing_xs: ["0.5rem"],
  spacing_sm: ["0.75rem"],
  spacing_md: ["1rem"],
  spacing_lg: ["1.5rem"],
  spacing_xl: ["2rem"],
  spacing_2xl: ["3rem"],
  spacing_3xl: ["4rem"],
  spacing_4xl: ["6rem"],
  font_display_lg: ["4rem"],
  font_display_md: ["3rem"],
};

export const getDesignSystemDefault = <T extends keyof DesignSystemDefaults>(key: T): DesignSystemDefaults[T] =>
  designSystemDefaults[key];
