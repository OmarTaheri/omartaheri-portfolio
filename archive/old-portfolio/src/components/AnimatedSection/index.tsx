'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

const directionVariants = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
  none: { x: 0, y: 0 },
}

export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const initialPosition = directionVariants[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initialPosition }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...initialPosition }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// For staggered list items
interface AnimatedListProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
}

export const AnimatedList = ({ children, className = '', staggerDelay = 0.1 }: AnimatedListProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px' })

  return (
    <motion.div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{
            duration: 0.4,
            delay: index * staggerDelay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
