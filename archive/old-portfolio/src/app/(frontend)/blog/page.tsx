import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { EasterEggs } from '@/components/EasterEggs'
import { calculateReadingTime, formatReadingTime } from '@/utilities/readingTime'
import type { Post, Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config })

  // Fetch all published posts with hero images
  let posts: Post[] = []
  try {
    const postsResult = await payload.find({
      collection: 'posts',
      limit: 100,
      sort: '-publishedAt',
      depth: 2,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })
    posts = postsResult.docs
  } catch {
    // Database might not be available or table doesn't exist yet
  }

  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  return (
    <div className="space-y-12">
      <EasterEggs />

      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-bold">
          <AnimatedText text="Blog" />
        </h1>
        <AnimatedSection delay={0.1}>
          <p className="text-[var(--text)] mt-2">Thoughts on web development, AI, and technology</p>
        </AnimatedSection>
      </header>

      {/* Featured Article */}
      {featuredPost && (
        <AnimatedSection delay={0.2}>
          <article className="group">
            <Link href={`/blog/${featuredPost.slug}`} className="block">
              {/* Hero Image */}
              {featuredPost.heroImage && typeof featuredPost.heroImage === 'object' && (featuredPost.heroImage as Media).url && (
                <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-lg bg-[var(--card)]">
                  <Image
                    src={(featuredPost.heroImage as Media).url!}
                    alt={(featuredPost.heroImage as Media).alt || featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-[var(--link)]">
                  <span className="px-2 py-1 bg-[var(--card)] rounded text-xs font-medium">Featured</span>
                  {featuredPost.publishedAt && (
                    <time>
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {calculateReadingTime(featuredPost.content) > 0 && (
                    <span>{formatReadingTime(calculateReadingTime(featuredPost.content))}</span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-[var(--title)] group-hover:text-[var(--link-hover)] transition-colors">
                  {featuredPost.title}
                </h2>

                {featuredPost.meta?.description && (
                  <p className="text-[var(--text)] text-lg">{featuredPost.meta.description}</p>
                )}

                {featuredPost.categories && Array.isArray(featuredPost.categories) && featuredPost.categories.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {featuredPost.categories.map((category) => {
                      const categoryTitle = typeof category === 'object' ? category.title : null
                      if (!categoryTitle) return null
                      return (
                        <span
                          key={typeof category === 'object' ? category.id : category}
                          className="text-[var(--link)] text-xs px-2 py-1 bg-[var(--card)] rounded"
                        >
                          {categoryTitle}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </Link>
          </article>
        </AnimatedSection>
      )}

      {/* Divider */}
      {remainingPosts.length > 0 && (
        <AnimatedSection delay={0.3}>
          <div className="border-t border-[var(--border)]" />
        </AnimatedSection>
      )}

      {/* Posts Grid */}
      {remainingPosts.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2">
          {remainingPosts.map((post, index) => {
            const readingTime = calculateReadingTime(post.content)
            const heroImage = post.heroImage && typeof post.heroImage === 'object' ? (post.heroImage as Media) : null

            return (
              <AnimatedSection key={post.id} delay={0.3 + index * 0.1}>
                <article className="group h-full">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    {/* Hero Image */}
                    {heroImage?.url && (
                      <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded-lg bg-[var(--card)]">
                        <Image
                          src={heroImage.url}
                          alt={heroImage.alt || post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-[var(--link)]">
                        {post.publishedAt && (
                          <time>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        )}
                        {readingTime > 0 && (
                          <span>{formatReadingTime(readingTime)}</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-[var(--title)] group-hover:text-[var(--link-hover)] transition-colors">
                        {post.title}
                      </h3>

                      {post.meta?.description && (
                        <p className="text-[var(--text)] text-sm line-clamp-2">{post.meta.description}</p>
                      )}

                      {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
                        <div className="flex gap-2 flex-wrap pt-2">
                          {post.categories.map((category) => {
                            const categoryTitle = typeof category === 'object' ? category.title : null
                            if (!categoryTitle) return null
                            return (
                              <span
                                key={typeof category === 'object' ? category.id : category}
                                className="text-[var(--link)] text-xs px-2 py-1 bg-[var(--card)] rounded"
                              >
                                {categoryTitle}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              </AnimatedSection>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
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
