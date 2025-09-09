import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // Add class to disable transitions during initial load
    document.documentElement.classList.add('theme-transitioning')

    // Remove the class after a short delay to enable transitions
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      // Enable transition on change for smooth switching
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}

export { useTheme } from "next-themes"
