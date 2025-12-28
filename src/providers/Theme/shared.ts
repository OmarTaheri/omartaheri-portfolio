import type { Theme } from './types'

export const themeLocalStorageKey = 'portfolio-theme'

export const defaultTheme: Theme = 'blue'

export const getImplicitPreference = (): Theme | null => {
  return null
}
