import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { EasterEggs } from '@/components/EasterEggs'
import { ProgressBar } from '@/components/ProgressBar'
import { TableOfContents } from '@/components/TableOfContents'
import { ShareButtons } from '@/components/ShareButtons'
import { CodeCopyButton } from '@/components/CodeCopyButton'
import { calculateReadingTime, formatReadingTime } from '@/utilities/readingTime'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Fetch the post
  const postsResult = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })

  const post = postsResult.docs[0]

  if (!post) {
    notFound()
  }

  const readingTime = calculateReadingTime(post.content)
  const postUrl = `https://omartaheri.com/blog/${slug}` // Update with your actual domain

  return (
    <div className="space-y-8">
      <ProgressBar />
      <TableOfContents />
      <EasterEggs />
      <CodeCopyButton />

      {/* Back Link */}
      <AnimatedSection delay={0}>
        <Link
          href="/blog"
          className="text-[var(--link)] hover:text-[var(--link-hover)] inline-flex items-center gap-2 animated-link"
        >
          <span>&larr;</span> Back to blog
        </Link>
      </AnimatedSection>

      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          <AnimatedText text={post.title} />
        </h1>
        <AnimatedSection delay={0.3}>
          <div className="flex items-center gap-4 text-sm text-[var(--link)] flex-wrap">
            {post.publishedAt && (
              <time>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {readingTime > 0 && (
              <span>{formatReadingTime(readingTime)}</span>
            )}
            {post.populatedAuthors && post.populatedAuthors.length > 0 && (
              <span>
                by {post.populatedAuthors.map((author) => author.name).join(', ')}
              </span>
            )}
          </div>
        </AnimatedSection>
        <AnimatedSection delay={0.4}>
          {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.categories.map((category) => {
                const categoryTitle = typeof category === 'object' ? category.title : null
                if (!categoryTitle) return null
                return (
                  <span
                    key={typeof category === 'object' ? category.id : category}
                    className="text-[var(--link)] text-xs px-2 py-1 bg-[var(--card)] rounded hover-lift"
                  >
                    {categoryTitle}
                  </span>
                )
              })}
            </div>
          )}
        </AnimatedSection>
      </header>

      {/* Content */}
      <AnimatedSection delay={0.5}>
        {post.content && (
          <article className="prose prose-invert max-w-none">
            <RichText data={post.content} enableGutter={false} />
          </article>
        )}
      </AnimatedSection>

      {/* Share Buttons */}
      <AnimatedSection delay={0.6}>
        <div className="border-t border-[var(--border)] pt-6">
          <ShareButtons title={post.title} url={postUrl} />
        </div>
      </AnimatedSection>

      {/* Related Posts */}
      {post.relatedPosts && Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0 && (
        <AnimatedSection delay={0.7}>
          <section className="border-t border-[var(--border)] pt-8 mt-12">
            <h2 className="text-xl font-bold mb-4">Related Posts</h2>
            <div className="space-y-4">
              {post.relatedPosts.map((relatedPost, index) => {
                if (typeof relatedPost !== 'object') return null
                return (
                  <AnimatedSection key={relatedPost.id} delay={0.8 + index * 0.1}>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="block text-[var(--title)] hover:text-[var(--link-hover)] animated-link hover-scale"
                    >
                      {relatedPost.title}
                    </Link>
                  </AnimatedSection>
                )
              })}
            </div>
          </section>
        </AnimatedSection>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const postsResult = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const post = postsResult.docs[0]

  if (!post) {
    return {
      title: 'Post Not Found - Omar Taheri',
    }
  }

  return {
    title: `${post.title} - Omar Taheri`,
    description: post.meta?.description || `Read ${post.title} by Omar Taheri`,
  }
}
