'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ZELLIGE_CLICKS_NEEDED = 7

export const EasterEggs = () => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [_zelligeClicks, setZelligeClicks] = useState(0)
  const [showMatrixRain, setShowMatrixRain] = useState(false)

  // Zellige multi-click easter egg
  useEffect(() => {
    const handleZelligeClick = () => {
      setZelligeClicks((prev) => {
        const newCount = prev + 1
        if (newCount >= ZELLIGE_CLICKS_NEEDED) {
          // Matrix rain effect!
          setShowMatrixRain(true)
          setTimeout(() => setShowMatrixRain(false), 5000)
          return 0
        }
        return newCount
      })

      // Reset counter after 2 seconds of no clicks
      setTimeout(() => {
        setZelligeClicks(0)
      }, 2000)
    }

    // Add click listener to zellige buttons
    const zelligeButtons = document.querySelectorAll('[aria-label*="theme"]')
    zelligeButtons.forEach((button) => {
      button.addEventListener('click', handleZelligeClick)
    })

    return () => {
      zelligeButtons.forEach((button) => {
        button.removeEventListener('click', handleZelligeClick)
      })
    }
  }, [])

  // Secret: typing "omar" anywhere
  const [secretWord, setSecretWord] = useState('')

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newWord = (secretWord + e.key.toLowerCase()).slice(-4)
      setSecretWord(newWord)

      if (newWord === 'omar') {
        setMessage("👋 Hey! You're looking for Omar? Well, you found his website! 🎮")
        setShowMessage(true)
        setSecretWord('')
        setTimeout(() => setShowMessage(false), 3000)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [secretWord])

  return (
    <>
      {/* Funny message popup */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] bg-[var(--background)] border-2 border-[var(--link)] rounded-lg p-6 shadow-2xl max-w-md text-center"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <p className="text-lg text-[var(--title)]">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matrix rain effect */}
      <AnimatePresence>
        {showMatrixRain && (
          <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden bg-black bg-opacity-90">
            <div className="absolute inset-0 flex">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="text-green-500 text-sm font-mono whitespace-nowrap"
                  style={{ width: '3.33%' }}
                  initial={{ y: -1000 }}
                  animate={{ y: '100vh' }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: 1,
                    ease: 'linear',
                  }}
                >
                  {[...Array(50)].map((_, j) => (
                    <div key={j} style={{ opacity: Math.random() }}>
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
            <motion.p
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500 text-2xl font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Wake up, Neo...
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
