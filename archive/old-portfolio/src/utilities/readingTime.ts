/**
 * Calculate reading time from rich text content
 * Assumes average reading speed of 200 words per minute
 */

interface LexicalNode {
  type: string
  text?: string
  children?: LexicalNode[]
}

interface RichTextContent {
  root?: {
    children?: LexicalNode[]
  }
}

function extractText(nodes: LexicalNode[]): string {
  let text = ''

  for (const node of nodes) {
    if (node.text) {
      text += node.text + ' '
    }
    if (node.children) {
      text += extractText(node.children)
    }
  }

  return text
}

export function calculateReadingTime(content: RichTextContent | null | undefined): number {
  if (!content?.root?.children) {
    return 0
  }

  const text = extractText(content.root.children)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(wordCount / 200)

  return Math.max(1, minutes) // Minimum 1 minute
}

export function formatReadingTime(minutes: number): string {
  if (minutes <= 1) {
    return '1 min read'
  }
  return `${minutes} min read`
}
