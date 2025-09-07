import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // DemoStoke Typography System
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        // DemoStoke Typography Scale
        'caption': 'var(--font-size-caption)',
        'body-sm': 'var(--font-size-body-sm)',
        'body-md': 'var(--font-size-body-md)',
        'body-lg': 'var(--font-size-body-lg)',
        'heading-sm': 'var(--font-size-heading-sm)',
        'heading-md': 'var(--font-size-heading-md)',
        'heading-lg': 'var(--font-size-heading-lg)',
        'display-sm': 'var(--font-size-display-sm)',
        'display-md': 'var(--font-size-display-md)',
        'display-lg': 'var(--font-size-display-lg)',
        // Override default Tailwind sizes with DemoStoke scale
        'xs': 'var(--font-size-caption)',
        'sm': 'var(--font-size-body-sm)',
        'base': 'var(--font-size-body-md)',
        'lg': 'var(--font-size-body-lg)',
        'xl': 'var(--font-size-heading-sm)',
        '2xl': 'var(--font-size-heading-md)',
        '3xl': 'var(--font-size-heading-lg)',
        '4xl': 'var(--font-size-display-sm)',
        '5xl': 'var(--font-size-display-md)',
        '6xl': 'var(--font-size-display-lg)',
      },
      fontWeight: {
        // DemoStoke Font Weight Scale
        'normal': 'var(--font-weight-normal)',     // 400
        'medium': 'var(--font-weight-medium)',     // 500
        'semibold': 'var(--font-weight-semibold)', // 600
        'bold': 'var(--font-weight-bold)',         // 700
      },
      lineHeight: {
        // DemoStoke Line Height Scale
        'tight': 'var(--line-height-tight)',       // 1.2
        'normal': 'var(--line-height-normal)',     // 1.5
        'relaxed': 'var(--line-height-relaxed)',   // 1.75
      },
      colors: {
        // Core System Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // DemoStoke Brand Primary - Navy Blue
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
          muted: "hsl(var(--primary-muted))",
        },

        // DemoStoke Secondary - Tech Gray
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // DemoStoke Accent - Action Orange
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
        },

        // Functional Colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },

        // Surface Colors
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Sidebar Component Colors
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        // DemoStoke Brand Gradients (use CSS custom properties for consistency)
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-surface': 'var(--gradient-surface)',
      },
      boxShadow: {
        // DemoStoke Shadow System (use CSS custom properties)
        'glow': 'var(--shadow-glow)',
        'xs': 'var(--shadow-sm)',
        'sm': 'var(--shadow-base)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      spacing: {
        // DemoStoke Spacing Scale (based on 4px base unit)
        'xs': 'var(--spacing-xs)',    // 0.25rem (4px)
        'sm': 'var(--spacing-sm)',    // 0.5rem (8px)
        'md': 'var(--spacing-md)',    // 1rem (16px)
        'lg': 'var(--spacing-lg)',    // 1.5rem (24px)
        'xl': 'var(--spacing-xl)',    // 2rem (32px)
        '2xl': 'var(--spacing-2xl)',  // 3rem (48px)
        '3xl': 'var(--spacing-3xl)',  // 4rem (64px)
        '4xl': 'var(--spacing-4xl)',  // 6rem (96px)
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'base': 'var(--transition-base)',
        'slow': 'var(--transition-slow)',
      },
      borderRadius: {
        'xs': 'var(--radius-sm)',
        'sm': 'calc(var(--radius) - 4px)',
        'md': 'calc(var(--radius) - 2px)',
        'lg': 'var(--radius)',
        'xl': 'var(--radius-lg)',
        '2xl': 'var(--radius-xl)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "glow": {
          "0%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "100%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
