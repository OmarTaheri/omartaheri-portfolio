import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import RichText from '@/components/RichText'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { EasterEggs } from '@/components/EasterEggs'
import { DitherCanvas } from '@/components/DitherCanvas'

export const dynamic = 'force-dynamic'

export default async function MePage() {
  const payload = await getPayload({ config })

  // Fetch me page content
  let meData = null
  try {
    meData = await payload.findGlobal({
      slug: 'me',
      depth: 2,
    })
  } catch {
    // Global might not exist yet
  }

  const profileImage = (meData?.profileImage && typeof meData.profileImage === 'object' && meData.profileImage.url)
    ? meData.profileImage.url
    : '/omartaheri.jpg'

  // Check if we have rich text content
  const hasContent = meData?.content && meData.content.root?.children?.length > 0

  return (
    <div className="space-y-8">
      <EasterEggs />

      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-bold">
          <AnimatedText text={meData?.title || 'Hello world'} />
        </h1>
        <AnimatedSection delay={0.1}>
          <p className="text-[var(--text)] mt-2">{meData?.subtitle || 'I am Omar.'}</p>
        </AnimatedSection>
      </header>

      {/* Profile Image with Dithering Effect */}
      <AnimatedSection delay={0.15} direction="left">
        <div className="relative w-full max-w-md">
          <DitherCanvas
            imageSrc={profileImage}
            maxWidth={400}
            className="w-full"
          />
        </div>
      </AnimatedSection>

      {/* Bio Content */}
      {hasContent && meData?.content ? (
        <AnimatedSection delay={0.1}>
          <div className="prose prose-invert max-w-none">
            <RichText data={meData.content} enableGutter={false} />
          </div>
        </AnimatedSection>
      ) : (
        <div className="space-y-6 text-[var(--text)]">
          <AnimatedSection delay={0.1}>
            <p>I grew up in Larache (L3rayech), Morocco. My dad was a school director, and my mom did the hardest job &ldquo;raising me&rdquo;. While they told me to go outside and get off the computer, I&apos;m glad I didn&apos;t, l3rayech is boring, and it much more fun to build.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p>At 12, I got my first freelance gig on Khamsat (the Arabic version of Fiverr). Later I worked in a computer repair shop installing windows 7 and changing RAM for clients, then built and hosted websites that reached millions of views.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p>I build and run high-traffic web apps (Next.js + Node.js) and manage servers handling 200+TB/month of data transfer and I can also make a solid pasta</p>
          </AnimatedSection>
          <AnimatedSection delay={0.25}>
            <p>I&apos;m a CS student at Al Akhawayn University (Ifrane), where I also self host and built the Robotics Club website. I&apos;m working with client in a streaming platform to scale their infrastructure for higher traffic currently +200k unique user a month.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p>Purposeful work with a diverse team of talented people.</p>
          </AnimatedSection>
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Me - Omar Taheri',
  description: 'About Omar Taheri - Web developer and CS student',
}
