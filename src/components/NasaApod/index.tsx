'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { NasaApod as NasaApodType } from '@/app/api/nasa/route'

export const NasaApod = () => {
  const [apod, setApod] = useState<NasaApodType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/nasa')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(true)
        } else {
          setApod(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-48 bg-[var(--link)] opacity-10 rounded animate-pulse" />
        <div className="h-4 w-48 bg-[var(--link)] opacity-20 rounded animate-pulse" />
        <div className="h-3 w-32 bg-[var(--link)] opacity-20 rounded animate-pulse" />
      </div>
    )
  }

  if (error || !apod) return null

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {apod.media_type === 'image' ? (
        <div className="relative aspect-video w-full overflow-hidden rounded">
          <Image
            src={apod.url}
            alt={apod.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <iframe
          src={apod.url}
          className="aspect-video w-full rounded"
          allowFullScreen
          title={apod.title}
        />
      )}
      <div>
        <h3 className="font-bold text-[var(--title)]">{apod.title}</h3>
        <p className="text-xs text-[var(--link)]">{apod.date}</p>
        <p className="text-sm text-[var(--text)] mt-2 line-clamp-3">{apod.explanation}</p>
        {apod.copyright && (
          <p className="text-xs text-[var(--link)] mt-1">Credit: {apod.copyright}</p>
        )}
      </div>
    </motion.div>
  )
}
