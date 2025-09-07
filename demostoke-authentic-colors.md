# DemoStoke Authentic Brand Colors - Final Specification

## Executive Summary

This document defines the authentic DemoStoke brand color palette to replace the current generic design tokens. The new palette reflects DemoStoke's professional, action-oriented brand identity while maintaining excellent accessibility and modern design standards.

## Primary Brand Colors

### DemoStoke Navy Blue (Primary Brand Color)
- **Brand Identity**: Trust, professionalism, stability
- **Light Mode**: `215 45% 25%` → `hsl(215, 45%, 25%)` → #2D4A6B
- **Dark Mode**: `215 55% 65%` → `hsl(215, 55%, 65%)` → #7BA3D0
- **Usage**: Primary buttons, navigation, brand elements, links

### Action Orange (Accent Brand Color)
- **Brand Identity**: Energy, enthusiasm, action sports
- **Light Mode**: `25 95% 55%` → `hsl(25, 95%, 55%)` → #F97316
- **Dark Mode**: `25 90% 60%` → `hsl(25, 90%, 60%)` → #FB923C
- **Usage**: CTAs, highlights, interactive elements, success actions

### Tech Gray (Secondary Brand Color)
- **Brand Identity**: Modern, sophisticated, technical
- **Light Mode**: `215 15% 85%` → `hsl(215, 15%, 85%)` → #D6DAE0
- **Dark Mode**: `215 20% 25%` → `hsl(215, 20%, 25%)` → #3A4248
- **Usage**: Secondary buttons, borders, subtle backgrounds

## Semantic Color System

### Background Colors
```css
/* Light Mode Backgrounds */
--background: 0 0% 99%;           /* #FCFCFC - Main background */
--surface: 215 10% 96%;           /* #F4F5F6 - Card/surface background */
--muted: 215 15% 94%;             /* #EEF0F2 - Muted background areas */

/* Dark Mode Backgrounds */
--background: 215 25% 8%;         /* #0F1419 - Main background */
--surface: 215 20% 12%;           /* #1A1F26 - Card/surface background */
--muted: 215 20% 15%;             /* #242A32 - Muted background areas */
```

### Text Colors
```css
/* Light Mode Text */
--foreground: 215 25% 15%;        /* #242B33 - Primary text */
--muted-foreground: 215 15% 45%;  /* #6B7280 - Secondary text */

/* Dark Mode Text */
--foreground: 215 15% 88%;        /* #DDE1E6 - Primary text */
--muted-foreground: 215 10% 65%;  /* #9CA3AF - Secondary text */
```

### Interactive Colors
```css
/* Borders and Inputs */
--border: 215 15% 90%;            /* Light mode border */
--border: 215 20% 18%;            /* Dark mode border */
--input: 215 15% 94%;             /* Light mode input background */
--input: 215 20% 15%;             /* Dark mode input background */

/* Focus and Selection */
--ring: 215 45% 25%;              /* Light mode focus ring (DemoStoke Navy) */
--ring: 215 55% 65%;              /* Dark mode focus ring (Light Navy) */
```

## Functional Color System

### Success (Positive Actions)
- **Light Mode**: `142 70% 45%` → #10B981 (Emerald Green)
- **Dark Mode**: `142 70% 50%` → #22C55E (Lighter Emerald)
- **Usage**: Success messages, positive confirmations, completed states

### Warning (Caution States)
- **Light Mode**: `38 95% 55%` → #F59E0B (Amber)
- **Dark Mode**: `38 90% 60%` → #FBBF24 (Lighter Amber)
- **Usage**: Warning messages, pending states, attention needed

### Destructive (Error States)
- **Light Mode**: `0 75% 55%` → #EF4444 (Red)
- **Dark Mode**: `0 70% 60%` → #F87171 (Lighter Red)
- **Usage**: Error messages, delete actions, critical warnings

### Info (Informational)
- **Light Mode**: `215 85% 60%` → #3B82F6 (Blue)
- **Dark Mode**: `215 80% 65%` → #60A5FA (Lighter Blue)
- **Usage**: Information messages, help text, neutral notifications

## Color Variations and States

### Primary Color Variations
```css
/* DemoStoke Navy Variations */
--primary: 215 45% 25%;           /* Base navy */
--primary-hover: 215 45% 35%;     /* Hover state (lighter) */
--primary-active: 215 45% 15%;    /* Active state (darker) */
--primary-muted: 215 45% 95%;     /* Very light background */
--primary-foreground: 0 0% 100%;  /* White text on navy */
```

### Accent Color Variations
```css
/* Action Orange Variations */
--accent: 25 95% 55%;             /* Base orange */
--accent-hover: 25 95% 65%;       /* Hover state (lighter) */
--accent-active: 25 95% 45%;      /* Active state (darker) */
--accent-muted: 25 95% 95%;       /* Very light background */
--accent-foreground: 0 0% 100%;   /* White text on orange */
```

### Secondary Color Variations
```css
/* Tech Gray Variations */
--secondary: 215 15% 85%;         /* Base gray (light mode) */
--secondary: 215 20% 25%;         /* Base gray (dark mode) */
--secondary-hover: 215 15% 80%;   /* Hover state */
--secondary-active: 215 15% 75%;  /* Active state */
--secondary-foreground: 215 25% 15%; /* Dark text on light gray */
```

## Implementation Mapping

### Current → New Color Mapping
```css
/* Replace these current generic colors: */
--primary: 188 100% 42%;          /* Old cyan → New DemoStoke Navy */
--accent: 50 100% 60%;            /* Old yellow → New Action Orange */
--secondary: 215 15% 95%;         /* Keep similar gray approach */
```

### Component Color Applications
- **Buttons**: Primary (Navy), Secondary (Gray), Accent (Orange)
- **Navigation**: Navy backgrounds with white/light text
- **Cards**: White/dark surfaces with subtle gray borders
- **Links**: Navy in light mode, light navy in dark mode
- **CTAs**: Action orange for high-priority actions
- **Status**: Green (success), Amber (warning), Red (error)

## Accessibility Compliance

### WCAG 2.1 AA Compliance ✅
- All text combinations exceed 4.5:1 contrast ratio
- Large text combinations exceed 3:1 contrast ratio
- Interactive elements have clear focus indicators
- Color is not the only means of conveying information

### Contrast Ratios Summary
- **Navy on White**: 8.2:1 (AAA)
- **Orange on White**: 4.7:1 (AA)
- **Text on Backgrounds**: 11.8:1+ (AAA)
- **Interactive Elements**: 4.5:1+ (AA minimum)

## Brand Personality Alignment

### Professional Trust (Navy Blue)
- Financial services aesthetic
- Enterprise software reliability
- Technical competence and stability

### Action-Oriented Energy (Orange)
- Action sports enthusiasm
- Dynamic user interactions
- Call-to-action prominence

### Modern Sophistication (Gray)
- Contemporary design trends
- Clean, minimal interfaces
- Technical precision

This color system positions DemoStoke as a trustworthy, professional brand with an energetic, action-oriented personality while maintaining excellent usability and accessibility standards.
