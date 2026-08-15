## Why I built it

I wanted a straightforward way to work with TierMaker data from TypeScript without turning every project into a browser-automation project. TierMaker.js is the client I ended up wanting to use myself: typed, server-side, careful with sessions, and small enough to understand.

The library and its documentation belong together here. I built the docs because the client deserved a home that feels just as focused—fast to scan, pleasant to read, and full of examples that can be used immediately.

## What it does

- Searches templates, categories, profiles, rankings, videos, quizzes, and live polls.
- Loads complete templates with ordered rows and image items.
- Downloads template images with controlled concurrency.
- Saves tier lists through a caller-provided, authenticated TierMaker session.
- Provides strict types, lazy pagination, structured errors, safe retries, and cookie isolation.

## The documentation

The companion site combines a landing page, practical guides, and the full method reference in a dark, developer-first interface. Real signatures and install commands stay close to the explanations so it is possible to go from reading to building quickly.

## Built with

- TypeScript, Node.js, and Bun
- Vitest and GitHub Actions
- npm for package distribution
- Next.js, Vinext, and Vite for the documentation site

## Current status

TierMaker.js is available on [npm](https://www.npmjs.com/package/tiermaker.js). The [website and documentation](https://tiermakerjs.omartaheri.com/docs) are live, and parser fixes remain an ongoing part of maintaining an unofficial client for a service that can change over time.

