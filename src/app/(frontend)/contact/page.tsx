import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AnimatedText } from '@/components/AnimatedText'
import { EasterEggs } from '@/components/EasterEggs'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const payload = await getPayload({ config })

  // Fetch contact page content
  let contactData = null
  try {
    contactData = await payload.findGlobal({
      slug: 'contact',
    })
  } catch {
    // Global might not exist yet
  }

  const email = contactData?.email || 'omartaheri2005@gmail.com'
  const description = contactData?.description || "Feel free to reach out if you want to collaborate, have a question, or just want to say hi!"
  const socialLinks = contactData?.socialLinks || [
    { platform: 'GitHub', url: 'https://github.com/omartaheri' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/omartaheri' },
  ]

  return (
    <div className="space-y-8">
      <EasterEggs />

      {/* Header */}
      <header>
        <h1 className="text-4xl md:text-5xl font-bold">
          <AnimatedText text={contactData?.title || 'Contact me'} />
        </h1>
      </header>

      {/* Description */}
      <AnimatedSection delay={0.3}>
        <p className="text-[var(--text)]">{description}</p>
      </AnimatedSection>

      {/* Email */}
      <AnimatedSection delay={0.4}>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Email</h2>
          <a
            href={`mailto:${email}`}
            className="text-[var(--link)] hover:text-[var(--link-hover)] underline animated-link hover-scale inline-block"
          >
            {email}
          </a>
        </div>
      </AnimatedSection>

      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <AnimatedSection delay={0.5}>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Links</h2>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link, index) => (
                <AnimatedSection key={index} delay={0.6 + index * 0.1}>
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--link)] hover:text-[var(--link-hover)] underline animated-link hover-scale inline-block"
                  >
                    {link.platform}
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Contact - Omar Taheri',
  description: 'Get in touch with Omar Taheri',
}
