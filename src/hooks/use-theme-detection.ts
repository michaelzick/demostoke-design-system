import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"

export function useThemeDetection() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user is using system theme
      if (theme === 'system') {
        // Force a re-render by briefly switching themes
        const newTheme = e.matches ? 'dark' : 'light'
        console.log('System theme changed to:', newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  // Get the resolved theme (what's actually being used)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  return {
    theme,
    resolvedTheme,
    setTheme,
    mounted,
    isSystemTheme: theme === 'system'
  }
}
