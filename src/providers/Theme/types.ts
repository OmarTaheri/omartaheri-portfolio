export type Theme = 'blue' | 'red' | 'green'

export interface ThemeContextType {
  setTheme: (theme: Theme) => void
  theme?: Theme | null
}

export function themeIsValid(string: null | string): string is Theme {
  return string ? ['blue', 'red', 'green'].includes(string) : false
}
