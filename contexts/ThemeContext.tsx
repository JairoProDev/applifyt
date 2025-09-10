'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'
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
  const [theme, setTheme] = useState<Theme>('light')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue')
  const [stylePreset, setStylePreset] = useState<StylePreset>('modern')

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
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-color-scheme', colorScheme)
    document.documentElement.setAttribute('data-style-preset', stylePreset)
  }, [theme, colorScheme, stylePreset])

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

