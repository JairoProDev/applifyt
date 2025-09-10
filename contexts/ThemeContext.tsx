'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal'
export type StylePreset = 'modern' | 'minimal' | 'vintage' | 'tech' | 'scientific' | 'retro' | 'neon' | 'cyberpunk' | 'elegant' | 'playful'

interface ThemeContextType {
  theme: Theme
  colorScheme: ColorScheme
  stylePreset: StylePreset
  setTheme: (theme: Theme) => void
  setColorScheme: (colorScheme: ColorScheme) => void
  setStylePreset: (stylePreset: StylePreset) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue')
  const [stylePreset, setStylePreset] = useState<StylePreset>('modern')

  const getCurrentTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('applify-theme') as Theme
    const savedColorScheme = localStorage.getItem('applify-color-scheme') as ColorScheme
    const savedStylePreset = localStorage.getItem('applify-style-preset') as StylePreset

    if (savedTheme) setTheme(savedTheme)
    if (savedColorScheme) setColorScheme(savedColorScheme)
    if (savedStylePreset) setStylePreset(savedStylePreset)
  }, [])

  useEffect(() => {
    // Save preferences
    localStorage.setItem('applify-theme', theme)
    localStorage.setItem('applify-color-scheme', colorScheme)
    localStorage.setItem('applify-style-preset', stylePreset)

    // Apply theme to document
    const currentTheme = getCurrentTheme()
    document.documentElement.setAttribute('data-theme', currentTheme)
    document.documentElement.setAttribute('data-color-scheme', colorScheme)
    document.documentElement.setAttribute('data-style-preset', stylePreset)
    document.documentElement.classList.toggle('dark', currentTheme === 'dark')
  }, [theme, colorScheme, stylePreset])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const currentTheme = getCurrentTheme()
        document.documentElement.setAttribute('data-theme', currentTheme)
        document.documentElement.classList.toggle('dark', currentTheme === 'dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        stylePreset,
        setTheme,
        setColorScheme,
        setStylePreset,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

