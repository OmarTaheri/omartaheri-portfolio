'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TOCItem {
  id: string
  text: string
  level: number
}

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Get all headings from the article content
    const article = document.querySelector('article')
    if (!article) return

    const elements = article.querySelectorAll('h2, h3')
    const items: TOCItem[] = []

    elements.forEach((element, index) => {
      // Create an ID if it doesn't exist
      if (!element.id) {
        element.id = `heading-${index}`
      }
      items.push({
        id: element.id,
        text: element.textContent || '',
        level: element.tagName === 'H2' ? 2 : 3,
      })
    })

    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <motion.nav
      className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 max-w-[200px] z-40"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <p className="text-xs text-[var(--link)] mb-3 uppercase tracking-wider">On this page</p>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <motion.li
            key={heading.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            style={{ paddingLeft: heading.level === 3 ? '12px' : '0' }}
          >
            <a
              href={`#${heading.id}`}
              className={`text-sm transition-colors block truncate ${
                activeId === heading.id
                  ? 'text-[var(--title)] font-medium'
                  : 'text-[var(--link)] hover:text-[var(--link-hover)]'
              }`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {heading.text}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}
