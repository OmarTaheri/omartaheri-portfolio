'use client'

import Image from 'next/image'
import { useTheme } from '@/providers/Theme'
import type { Theme } from '@/providers/Theme/types'

interface ZelligeThemeIconProps {
  themeName: Theme
}

const themeImages: Record<Theme, string> = {
  blue: '/blue.png',
  red: '/red.png',
  green: '/green.png',
}

export const ZelligeThemeIcon = ({ themeName }: ZelligeThemeIconProps) => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(themeName)}
      className={`w-16 h-16 mb-0 transition-all cursor-pointer ${theme === themeName ? 'grayscale' : ''}`}
      aria-label={`Switch to ${themeName} theme`}
    >
      <Image
        src={themeImages[themeName]}
        alt={`${themeName} zellige`}
        width={64}
        height={64}
        className="w-16 h-16 object-contain -ml-[5px]"
      />
    </button>
  )
}
