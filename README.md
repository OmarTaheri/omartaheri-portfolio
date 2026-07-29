# omartaheri.com

The source for my portfolio, project archive, and blog at [omartaheri.com](https://omartaheri.com).

The site uses Next.js and Payload CMS in one TypeScript codebase. Payload manages pages, posts, media, navigation, forms, and SEO metadata; PostgreSQL stores the content.

<!-- Add desktop and mobile screenshots here. -->

## Highlights

- CMS-managed portfolio pages and project content
- blog with categories, drafts, and rich-text editing
- responsive media and SEO metadata
- Payload administration interface
- search, redirects, forms, and sitemap generation
- light/dark visual themes with Moroccan zellige-inspired details
- integration tests with Vitest
- browser tests with Playwright

## Stack

- Next.js 15
- React 19
- Payload CMS 3
- PostgreSQL
- TypeScript
- Tailwind CSS
- Vitest and Playwright

## Local development

### Prerequisites

- Node.js 20+
- pnpm 9 or 10
- PostgreSQL

### Setup

```bash
git clone https://github.com/OmarTaheri/omartaheri-portfolio.git
cd omartaheri-portfolio
pnpm install
cp .env.example .env
```

Configure the required values:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/omartaheri
PAYLOAD_SECRET=generate-a-long-random-value
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
CRON_SECRET=generate-another-random-value
PREVIEW_SECRET=generate-another-random-value
```

Start the development server:

```bash
pnpm dev
```

Open:

- site: <http://localhost:3000>
- Payload admin: <http://localhost:3000/admin>

## Quality checks

```bash
pnpm lint
pnpm test:int
pnpm test:e2e
pnpm build
```

## Project structure

```text
src/
├── app/          Next.js routes and Payload admin
├── blocks/       CMS page-building blocks
├── collections/  Payload content collections
├── components/   site UI
├── globals/      global CMS configuration
└── payload.config.ts
```

## Design decisions

- **One codebase:** the site and CMS share types, deployment, and content models.
- **Content over hard-coding:** projects and posts can be updated without a code release.
- **Server-rendered content:** project and blog pages remain indexable and shareable.
- **Progressive personality:** visual details and small interactions support the content instead of replacing it.

## Deployment

Production requires:

- a PostgreSQL database;
- persistent media storage or an external storage adapter;
- unique secrets for Payload, previews, and cron jobs;
- `NEXT_PUBLIC_SERVER_URL` set to the canonical HTTPS origin.

## License

No open-source license is currently included. Add a license before inviting reuse or claiming that the project is MIT-licensed.
