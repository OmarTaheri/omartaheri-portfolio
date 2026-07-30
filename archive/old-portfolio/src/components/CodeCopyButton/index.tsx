'use client'

import { useEffect } from 'react'

export const CodeCopyButton = () => {
  useEffect(() => {
    // Add copy buttons to all code blocks
    const codeBlocks = document.querySelectorAll('pre')

    codeBlocks.forEach((block) => {
      // Skip if already has a copy button
      if (block.querySelector('.copy-button')) return

      // Make the pre relative for positioning
      block.style.position = 'relative'

      const button = document.createElement('button')
      button.className = 'copy-button'
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `
      button.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 6px;
        background: var(--link);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        color: var(--background);
      `

      block.addEventListener('mouseenter', () => {
        button.style.opacity = '1'
      })
      block.addEventListener('mouseleave', () => {
        button.style.opacity = '0'
      })

      button.addEventListener('click', async () => {
        const code = block.querySelector('code')
        if (code) {
          try {
            await navigator.clipboard.writeText(code.textContent || '')
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            `
            setTimeout(() => {
              button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              `
            }, 1500)
          } catch (err) {
            console.error('Failed to copy:', err)
          }
        }
      })

      block.appendChild(button)
    })
  }, [])

  return null
}
