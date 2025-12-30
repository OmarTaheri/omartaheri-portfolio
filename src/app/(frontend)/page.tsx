import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { ZelligeThemeIcon } from '@/components/ZelligeThemeIcon'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { GitHubStats } from '@/components/GitHubStats'
import { NasaApod } from '@/components/NasaApod'
import { EasterEggs } from '@/components/EasterEggs'
import { TechStack } from '@/components/TechStack'
import RichText from '@/components/RichText'
import type { Post } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch home page content with depth for linked posts
  let homeData = null
  try {
    homeData = await payload.findGlobal({
      slug: 'home',
      depth: 2,
    })
  } catch {
    // Global might not exist yet
  }

  // Fetch latest posts
  let posts: Post[] = []
  try {
    const postsResult = await payload.find({
      collection: 'posts',
      limit: 5,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })
    posts = postsResult.docs
  } catch {
    // Database not available during build
  }

  return (
    <div className="space-y-16">
      <EasterEggs />

      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <AnimatedText text={homeData?.name || 'Omar Taheri'} />
        </h1>
        {/* Profile GIF/Image */}
        {homeData?.profileGif && typeof homeData.profileGif === 'object' && homeData.profileGif.url && (
          <AnimatedSection delay={0.1}>
            <div className="max-w-xs mb-8">
              <Image
                src={homeData.profileGif.url}
                alt={homeData.profileGif.alt || 'Profile'}
                width={homeData.profileGif.width || 300}
                height={homeData.profileGif.height || 300}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          </AnimatedSection>
        )}
      </header>

      {/* Hero Section */}
      <AnimatedSection delay={0.2}>
        <section className="space-y-4">
          <ZelligeThemeIcon themeName="blue" />
          <h2 className="font-bold">{homeData?.tagline || 'Builds for the web obsessed with AI'}</h2>
          {homeData?.introContent ? (
            <div className="prose prose-invert max-w-none text-[var(--text)]">
              <RichText data={homeData.introContent} enableGutter={false} />
            </div>
          ) : (
            <>
              <div className="space-y-2 text-[var(--text)]">
                <p>Hi, I&apos;m Omar Taheri and welcome to my digital corner. I&apos;m happy you&apos;re here. Please make yourself comfortable.</p>
                <p>I love web dev, experimenting with new tools, and making things that feel good to use.</p>
              </div>
              <p className="text-[var(--text)]">
                Want to chat?{' '}
                <Link href="/contact" className="underline text-[var(--link)] hover:text-[var(--link-hover)] animated-link">
                  Drop me a line
                </Link>
              </p>
            </>
          )}
          {/* Tech Stack Icons */}
          <div className="pt-4">
            <TechStack />
          </div>
        </section>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection delay={0.3}>
        <section className="space-y-4">
          <ZelligeThemeIcon themeName="green" />
          <h2 className="font-bold">Projects</h2>
          {homeData?.projectsContent ? (
            <div className="prose prose-invert max-w-none text-[var(--text)]">
              <RichText data={homeData.projectsContent} enableGutter={false} />
            </div>
          ) : (
            <div className="space-y-2 text-[var(--text)]">
              <p>
                <span className="font-bold text-[var(--title)]">Mechatronics website</span>{' '}
                — A minimal website for a uni club
              </p>
              <p>
                <span className="font-bold text-[var(--title)]">Go Planner</span>{' '}
                — A degree planer service for students using AI
              </p>
            </div>
          )}
        </section>
      </AnimatedSection>

      {/* Blog Section */}
      <AnimatedSection delay={0.5}>
        <section className="space-y-4">
          <ZelligeThemeIcon themeName="red" />
          <h2 className="font-bold">Blog</h2>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <AnimatedSection key={post.id} delay={0.6 + index * 0.1}>
                  <article className="space-y-1 hover-scale">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-[var(--title)] hover:text-[var(--link-hover)] block animated-link"
                    >
                      {post.title}
                    </Link>
                    {post.meta?.description && (
                      <p className="text-[var(--text)] text-sm">{post.meta.description}</p>
                    )}
                    {post.publishedAt && (
                      <p className="text-[var(--link)] text-xs">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </article>
                </AnimatedSection>
              ))}
              <AnimatedSection delay={1.1}>
                <Link
                  href="/blog"
                  className="inline-block text-[var(--link)] hover:text-[var(--link-hover)] underline mt-4 animated-link"
                >
                  View all posts →
                </Link>
              </AnimatedSection>
            </div>
          ) : (
            <p className="text-[var(--text)]">No posts yet. Check back soon!</p>
          )}
        </section>
      </AnimatedSection>

      {/* GitHub Section */}
      <AnimatedSection delay={0.8}>
        <section className="space-y-4">
          <h2 className="font-bold">GitHub Activity</h2>
          <GitHubStats />
        </section>
      </AnimatedSection>

      {/* NASA APOD Section */}
      <AnimatedSection delay={0.9}>
        <section className="space-y-4">
          <h2 className="font-bold">From NASA</h2>
          <NasaApod />
        </section>
      </AnimatedSection>
    </div>
  )
}

export function generateMetadata() {
  return {
    title: 'Omar Taheri - Portfolio',
    description: 'Portfolio of Omar Taheri - Builds for the web obsessed with AI',
  }
}
