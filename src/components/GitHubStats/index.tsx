'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { GitHubStats as GitHubStatsType } from '@/app/api/github/route'

export const GitHubStats = () => {
  const [stats, setStats] = useState<GitHubStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/github')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(true)
        } else {
          setStats(data)
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
        <div className="h-4 w-32 bg-[var(--link)] opacity-20 rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-[var(--link)] opacity-20 rounded animate-pulse" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-[var(--link)] opacity-10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return null // Silently fail
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stats */}
      <div className="flex gap-6 text-sm text-[var(--text)]">
        <div>
          <span className="font-bold text-[var(--title)]">{stats.public_repos}</span> repos
        </div>
        <div>
          <span className="font-bold text-[var(--title)]">{stats.followers}</span> followers
        </div>
        <div>
          <span className="font-bold text-[var(--title)]">{stats.following}</span> following
        </div>
      </div>

      {/* Repos */}
      <div className="space-y-2">
        {stats.repos.map((repo, index) => (
          <motion.a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 border border-[var(--link)] border-opacity-30 rounded hover:border-opacity-60 transition-all hover:bg-[var(--link)] hover:bg-opacity-5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--title)]">{repo.name}</span>
              {repo.stargazers_count > 0 && (
                <span className="text-xs text-[var(--link)]">★ {repo.stargazers_count}</span>
              )}
            </div>
            {repo.description && (
              <p className="text-sm text-[var(--text)] mt-1 line-clamp-1">{repo.description}</p>
            )}
            {repo.language && (
              <span className="text-xs text-[var(--link)] mt-1 inline-block">{repo.language}</span>
            )}
          </motion.a>
        ))}
      </div>

      <a
        href="https://github.com/OmarTaheri"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-[var(--link)] hover:text-[var(--link-hover)] underline text-sm"
      >
        View GitHub Profile →
      </a>
    </motion.div>
  )
}
