'use client'

import Image from 'next/image'
import { useTheme } from '@/providers/Theme'
import type { Theme } from '@/providers/Theme/types'

const themes: { name: Theme; image: string }[] = [
  { name: 'blue', image: '/blue.png' },
  { name: 'red', image: '/red.png' },
  { name: 'green', image: '/green.png' },
]

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 max-lg:hidden">
      {themes.map(({ name, image }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`theme-button transition-transform ${theme === name ? 'active' : ''}`}
          aria-label={`Switch to ${name} theme`}
        >
          <Image
            src={image}
            alt={`${name} theme`}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </button>
      ))}
    </div>
  )
}
