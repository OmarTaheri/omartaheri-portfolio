## Overview

HeyNotAI is a multimodal detector for AI-generated content. It accepts text, images, audio, video, and YouTube URLs, then returns a human, mixed, or AI verdict with a confidence score.

## Product surfaces

- A Chrome Manifest V3 extension with in-page scanning, a dockable dashboard, YouTube overlays, and selected-text checks.
- A Next.js web application with scan history, collections, model selection, account preferences, and billing.
- A Hono API that owns the detection workflow, validation, storage access, and provider integrations.

## Architecture

The web application and extension communicate with the public API over HTTPS. PocketBase stays behind that API for authentication, storage, and realtime updates instead of being exposed directly to either client. Detection jobs move through queued, scanning, done, or failed states, and results can be reused from a per-engine cache.

## Technologies

- Next.js 16, React 19, TypeScript, and Tailwind CSS 4
- WXT, React, and Chrome Manifest V3 for the extension
- Hono on Node.js 22 for the API
- PocketBase for authentication, storage, realtime updates, and schema
- Zod for shared validation schemas
- Hugging Face Inference and Modulate Velma detection providers
- FFmpeg and yt-dlp for video and YouTube ingestion
- Stripe for subscriptions and billing
- Docker Compose and Coolify for deployment

## Current status

The web application is live at heynotai.com and the public repository is in active pre-release development. YouTube and selected-text extension scans use the real backend; some social-platform extension results and a few dashboard areas are still fixture-backed.
