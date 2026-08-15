## The small idea behind a bigger project

I originally built NetLogger for a light-hearted surprise: I wanted to know where a friend was so I could plan it. A small personal experiment grew into a complete product, and people are still surprised that I built all of this for one moment like that.

That origin is also why consent sits at the centre of the project. Location and device information are personal. A clever technical build is never a reason to ignore somebody else's privacy.

## What I built

- Shareable tracking links with live visitor activity and signal summaries.
- A user dashboard for links, visits, analytics, and locations.
- Custom domains with DNS verification and per-domain link slugs.
- Guided Google sign-in and several matching tracking-page templates.
- A read-only administrator view across accounts, links, visits, and domains.
- Real-time updates through WebSockets and resettable demo data for safe product tours.

## Consent is a feature

NetLogger is for transparent, legitimate use—not surveillance. People should clearly agree to what is collected and why. The product should collect only what is needed, provide meaningful notice, and respect requests to stop.

## Built with

- React, TypeScript, and Vite
- Express
- PostgreSQL and Drizzle ORM
- WebSockets

## Current status

The application is live at [netlogger.omartaheri.com](https://netlogger.omartaheri.com). The product supports real tracking links, dashboards, custom domains, authentication, and live updates, with privacy and responsible use treated as product requirements rather than fine print.

