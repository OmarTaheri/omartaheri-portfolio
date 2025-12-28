import { NextResponse } from 'next/server'

export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  fork: boolean
}

export interface GitHubStats {
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  bio: string | null
  repos: GitHubRepo[]
}

const GITHUB_USERNAME = 'OmarTaheri'

export async function GET() {
  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!userResponse.ok) {
      throw new Error('Failed to fetch GitHub user data')
    }

    const userData = await userResponse.json()

    // Fetch repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 3600 },
      },
    )

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch GitHub repos')
    }

    const reposData = await reposResponse.json()

    const stats: GitHubStats = {
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      repos: reposData
        .filter((repo: GitHubRepo) => !repo.fork)
        .slice(0, 4)
        .map((repo: GitHubRepo) => ({
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          language: repo.language,
          fork: repo.fork,
        })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 },
    )
  }
}
