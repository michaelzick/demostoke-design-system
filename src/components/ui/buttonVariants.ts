import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg active:scale-95",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md active:scale-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md active:scale-95",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:shadow-accent-glow active:scale-95",
  hero: "bg-gradient-primary text-primary-foreground hover:shadow-glow shadow-lg active:scale-95",
  // Use on surfaces where we want a plain primary background but a consistent dark text color
  // Wrap the variable in hsl() because --hero-button-foreground stores HSL components (e.g. "222.2 84% 4.9%")
  "on-surface": "bg-primary text-[color:hsl(var(--hero-button-foreground))] hover:shadow-glow shadow-lg active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow active:scale-95",
      },
      size: {
        default: "h-10 px-md py-sm",
        sm: "h-9 rounded-md px-sm text-body-sm",
        lg: "h-11 rounded-md px-lg text-body-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export default buttonVariants;
