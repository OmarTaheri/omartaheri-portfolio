import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { EasterEggs } from '@/components/EasterEggs'
import { calculateReadingTime, formatReadingTime } from '@/utilities/readingTime'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config })

  // Fetch all published posts
  const postsResult = await payload.find({
    collection: 'posts',
    limit: 100,
    sort: '-publishedAt',
    depth: 1,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const posts = postsResult.docs

  return (
    <div className="space-y-8">
      <EasterEggs />

      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-bold">
          <AnimatedText text="Blog" />
        </h1>
      </header>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post, index) => {
            const readingTime = calculateReadingTime(post.content)

            return (
              <AnimatedSection key={post.id} delay={0.2 + index * 0.1}>
                <article className="space-y-2 pb-6 border-b border-[var(--border)] hover-scale">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xl font-bold text-[var(--title)] hover:text-[var(--link-hover)] block animated-link"
                  >
                    {post.title}
                  </Link>
                  {post.meta?.description && (
                    <p className="text-[var(--text)]">{post.meta.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {post.publishedAt && (
                      <span className="text-[var(--link)]">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {readingTime > 0 && (
                      <span className="text-[var(--link)]">
                        {formatReadingTime(readingTime)}
                      </span>
                    )}
                    {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
                      <div className="flex gap-2">
                        {post.categories.map((category) => {
                          const categoryTitle = typeof category === 'object' ? category.title : null
                          if (!categoryTitle) return null
                          return (
                            <span key={typeof category === 'object' ? category.id : category} className="text-[var(--link)] text-xs px-2 py-1 bg-[var(--card)] rounded hover-lift">
                              {categoryTitle}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </article>
              </AnimatedSection>
            )
          })}
        </div>
      ) : (
        <AnimatedSection delay={0.2}>
          <p className="text-[var(--text)]">No posts yet. Check back soon!</p>
        </AnimatedSection>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Blog - Omar Taheri',
  description: 'Blog posts by Omar Taheri about web development, AI, and technology',
}
