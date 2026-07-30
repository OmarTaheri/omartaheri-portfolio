import React from 'react'
import { PortfolioNav } from '@/components/PortfolioNav'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

interface PortfolioLayoutProps {
  children: React.ReactNode
}

export const PortfolioLayout = ({ children }: PortfolioLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <PortfolioNav />
      <ThemeSwitcher />
      <main className="max-w-2xl mx-auto px-4 py-16 max-lg:pt-24 max-lg:pb-24">
        {children}
      </main>
    </div>
  )
}
