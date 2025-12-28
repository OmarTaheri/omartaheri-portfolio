'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/providers/Theme'
import type { Theme } from '@/providers/Theme/types'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/me', label: 'Me' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const themes: { name: Theme; image: string }[] = [
  { name: 'blue', image: '/blue.png' },
  { name: 'red', image: '/red.png' },
  { name: 'green', image: '/green.png' },
]

export const PortfolioNav = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 max-lg:absolute max-lg:left-0 max-lg:top-0 max-lg:translate-y-0 max-lg:w-full max-lg:bg-[var(--background)] max-lg:border-b max-lg:border-[var(--border)] max-lg:px-4 max-lg:py-3">
      <div className="flex flex-col max-lg:flex-row max-lg:items-center max-lg:justify-between">
        <ul className="flex flex-col gap-5 max-lg:flex-row max-lg:gap-6">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-base transition-colors ${
                    isActive ? 'text-[var(--title)]' : 'text-[var(--link)] hover:text-[var(--link-hover)]'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Theme switcher - only visible on mobile */}
        <div className="hidden max-lg:flex gap-3">
          {themes.map(({ name, image }) => (
            <button
              key={name}
              onClick={() => setTheme(name)}
              className={`w-6 h-6 transition-all ${theme === name ? 'grayscale' : ''}`}
              aria-label={`Switch to ${name} theme`}
            >
              <Image
                src={image}
                alt={`${name} theme`}
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
