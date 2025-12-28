import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ZelligeThemeIcon } from '@/components/ZelligeThemeIcon'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { GitHubStats } from '@/components/GitHubStats'
import { EasterEggs } from '@/components/EasterEggs'
import { TechStack } from '@/components/TechStack'

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
  let posts: Awaited<ReturnType<typeof payload.find<'posts'>>>['docs'] = []
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
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          <AnimatedText text={homeData?.name || 'Omar Taheri'} />
        </h1>
      </header>

      {/* Hero Section */}
      <AnimatedSection delay={0.2}>
        <section className="space-y-4">
          <ZelligeThemeIcon themeName="blue" />
          <h2 className="text-xl font-bold">{homeData?.tagline || 'Builds for the web obsessed with AI'}</h2>
          <div className="space-y-2 text-[var(--text)]">
            {(homeData?.intro || "Hi, I'm Omar Taheri and welcome to my digital corner. I'm happy you're here. Please make yourself comfortable.\nI love web dev, experimenting with new tools, and making things that feel good to use.").split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <p className="text-[var(--text)]">
            {homeData?.ctaText || 'Want to chat?'}{' '}
            <Link href="/contact" className="underline text-[var(--link)] hover:text-[var(--link-hover)] animated-link">
              {homeData?.ctaLink || 'Drop me a line'}
            </Link>
          </p>
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
          <h2 className="text-xl font-bold">Projects</h2>
          <div className="space-y-2">
            {homeData?.projects && homeData.projects.length > 0 ? (
              homeData.projects.map((project, index) => {
                const linkedPost = project.linkedPost && typeof project.linkedPost === 'object' ? project.linkedPost : null
                const postUrl = linkedPost?.slug ? `/blog/${linkedPost.slug}` : null

                return (
                  <AnimatedSection key={index} delay={0.4 + index * 0.1}>
                    <div className="text-[var(--text)]">
                      {postUrl ? (
                        <Link href={postUrl} className="font-bold text-[var(--title)] hover:text-[var(--link-hover)] animated-link">
                          {project.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-[var(--title)]">{project.name}</span>
                      )}{' '}
                      <span>{project.description}</span>
                    </div>
                  </AnimatedSection>
                )
              })
            ) : (
              <>
                <AnimatedSection delay={0.4}>
                  <div className="text-[var(--text)]">
                    <span className="font-bold text-[var(--title)]">Mechatronics website</span>{' '}
                    <span>A minimal website for a uni club</span>
                  </div>
                </AnimatedSection>
                <AnimatedSection delay={0.5}>
                  <div className="text-[var(--text)]">
                    <span className="font-bold text-[var(--title)]">Go Planner</span>{' '}
                    <span>A degree planer service for students using AI</span>
                  </div>
                </AnimatedSection>
              </>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Blog Section */}
      <AnimatedSection delay={0.5}>
        <section className="space-y-4">
          <ZelligeThemeIcon themeName="red" />
          <h2 className="text-xl font-bold">Blog</h2>
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

      {/* GitHub Section - At the bottom */}
      <AnimatedSection delay={0.8}>
        <section className="space-y-4">
          <h2 className="text-xl font-bold">GitHub Activity</h2>
          <GitHubStats />
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
