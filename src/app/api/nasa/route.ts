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

export async function GET() {
  try {
    // Generate random date within last 2 years for variety
    const today = new Date()
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(today.getFullYear() - 2)

    const randomTime =
      twoYearsAgo.getTime() + Math.random() * (today.getTime() - twoYearsAgo.getTime())
    const randomDate = new Date(randomTime)
    const dateString = randomDate.toISOString().split('T')[0]

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY || 'DEMO_KEY'}&date=${dateString}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error('Failed to fetch NASA APOD')
    }

    const data: NasaApod = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('NASA API error:', error)
    return NextResponse.json({ error: 'Failed to fetch NASA data' }, { status: 500 })
  }
}
