# 👋 Omar Taheri's Portfolio

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload-3.69-blue?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgNy4zNHYxMC4yNmwxMCA1LjI2IDEwLTUuMjZWNy4zNEwxMiAyeiIvPjwvc3ZnPg==)](https://payloadcms.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

**🌐 Visit the live site: [omartaheri.com](https://omartaheri.com)**

---

## 📝 About This Project

Hey there! 👋 This is my personal portfolio website. I built it to showcase my work, share some thoughts through blog posts, and have a nice little corner of the internet to call my own.

> ⚠️ **Heads up!** This is primarily built for **my personal use**, but hey, if you find it useful, feel free to fork it, learn from it, or use it as a starting point for your own portfolio. Just don't be surprised if some things are very specific to my needs! 😄

---

## 🛠️ Tech Stack

This portfolio is powered by some really cool technologies:

| Technology | Purpose |
|------------|---------|
| ⚡ **Next.js 15** | React framework for the frontend |
| 📦 **Payload CMS** | Headless CMS for content management |
| 🐘 **PostgreSQL** | Database for storing all content |
| 🎨 **TailwindCSS** | Styling and design |
| 🔤 **TypeScript** | Type-safe development |
| 🎭 **Framer Motion** | Smooth animations |

---

## 📦 What is Payload CMS?

If you're not familiar with [Payload CMS](https://payloadcms.com/), let me give you a quick rundown! 🚀

Payload is a **headless CMS** built with TypeScript and Node.js. What makes it special is that it:

- **Lives in your codebase** - No external services needed, it runs right alongside your Next.js app
- **Has an amazing admin panel** - Beautiful, intuitive, and fully customizable
- **Supports everything out of the box** - Authentication, access control, file uploads, rich text editing, and more
- **Is developer-friendly** - Define your content schema in code using TypeScript

In this project, Payload handles:
- 📄 **Pages** - Dynamic page content with a drag-and-drop layout builder
- ✍️ **Posts** - Blog posts with rich text editing (powered by Lexical)
- 🖼️ **Media** - Image uploads with automatic optimization
- 🏷️ **Categories** - Post organization and taxonomy
- 🔍 **SEO** - Meta tags, Open Graph, and more

The admin panel is accessible at `/admin` and gives me full control over all the content without touching code!

---

## 🐘 What's PostgreSQL Doing Here?

Great question! PostgreSQL is the **database** powering everything behind the scenes.

Every piece of content you see on the website - pages, posts, images, user accounts - it all lives in PostgreSQL. Here's why I chose it:

- 📊 **Reliable & Battle-tested** - PostgreSQL has been around for decades and is rock solid
- 🔐 **ACID Compliant** - Your data is safe and consistent
- 🚀 **Fast** - Query performance is excellent
- 🌐 **Widely Supported** - Easy to host anywhere (Vercel, Railway, Neon, self-hosted)

Payload uses PostgreSQL through its `@payloadcms/db-postgres` adapter, which means:
- Schema is defined in code and auto-generated
- Migrations keep track of database changes
- No manual SQL needed (unless you want to!)


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/omartaheri.git
   cd omartaheri
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Then edit .env with your database credentials
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Start the dev server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Visit `http://localhost:3000` and you're good to go! 🎉

---

## 📁 Project Structure

```
omartaheri/
├── 📂 src/
│   ├── 📂 app/          # Next.js app router pages
│   ├── 📂 components/   # React components
│   ├── 📂 blocks/       # Payload layout blocks
│   ├── 📂 collections/  # Payload collections (content schemas)
│   └── 📂 globals/      # Payload globals (header, footer)
├── 📂 public/           # Static assets
├── 📄 payload.config.ts # Payload CMS configuration
└── 📄 next.config.js    # Next.js configuration
```

---

## 🤝 Contributing

As I mentioned, this is my personal portfolio, so I'm not actively looking for contributions. But if you spot a bug or have a suggestion, feel free to open an issue! I appreciate the help. 💚

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Basically, do whatever you want with it! Just don't blame me if something breaks. 😅

---

<p align="center">
  Made with ❤️ and lots of ☕
</p>