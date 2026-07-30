import { NextResponse } from 'next/server'

export interface NasaApod {
  title: string
  explanation: string
  url: string
  hdurl?: string
  media_type: string
  date: string
  copyright?: string
}

// NASA API key from environment
const NASA_API_KEY = process.env.NASA_API_KEY

function getRandomDate(): string {
  const today = new Date()
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(today.getFullYear() - 2)

  const randomTime =
    twoYearsAgo.getTime() + Math.random() * (today.getTime() - twoYearsAgo.getTime())
  const randomDate = new Date(randomTime)
  return randomDate.toISOString().split('T')[0]
}

async function fetchApod(date: string): Promise<NasaApod | null> {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`,
      { cache: 'no-store' },
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Only return if it's an image (not a video)
    if (data.media_type === 'image') {
      return data as NasaApod
    }
    return null
  } catch {
    return null
  }
}

export async function GET() {
  // Check if API key is configured
  if (!NASA_API_KEY) {
    return NextResponse.json({
      title: 'The Cosmos Awaits',
      explanation: 'NASA API key not configured. Add NASA_API_KEY to your environment variables.',
      url: '/blue.png',
      media_type: 'image',
      date: new Date().toISOString().split('T')[0],
    })
  }

  try {
    // Try up to 5 times to get a valid image
    for (let i = 0; i < 5; i++) {
      const date = getRandomDate()
      const data = await fetchApod(date)

      if (data) {
        return NextResponse.json(data)
      }
    }

    // Fallback: try today's date
    const today = new Date().toISOString().split('T')[0]
    const todayData = await fetchApod(today)

    if (todayData) {
      return NextResponse.json(todayData)
    }

    // If all else fails, return a static fallback
    return NextResponse.json({
      title: 'The Cosmos Awaits',
      explanation: 'Unable to fetch today\'s image. Please refresh to try again.',
      url: '/blue.png',
      media_type: 'image',
      date: today,
    })
  } catch (error) {
    console.error('NASA API error:', error)
    return NextResponse.json({
      title: 'The Cosmos Awaits',
      explanation: 'Unable to fetch NASA data. Please try again later.',
      url: '/blue.png',
      media_type: 'image',
      date: new Date().toISOString().split('T')[0],
    })
  }
}
