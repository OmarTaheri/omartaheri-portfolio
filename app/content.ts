export type StoryChapter = {
  id: string;
  marker: string;
  title: string;
  body: string;
  art: string;
};

export type Metric = {
  value: string;
  label: string;
  detail: string;
};

export type Skill = {
  name: string;
  category: "Build" | "Automate" | "Operate" | "Explore";
  logo: string;
  logoLabel: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  status: string;
  tags: readonly string[];
  technologies: readonly string[];
  art?: string;
  fullArt?: boolean;
  video?: string;
  repository?: string;
  website?: string;
};

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "larache",
    marker: "Larache · Morocco",
    title: "The spawn point",
    body: "I grew up in Larache—L3rayech—where my dad ran a school and my mom did the hardest job: raising me. Larache felt quiet. Building things on a computer felt anything but.",
    art: "/stickers/larache-lighthouse.webp",
  },
  {
    id: "khamsat",
    marker: "Age 12",
    title: "The first paid quest",
    body: "At twelve, I landed my first freelance gig on Khamsat, the Arabic answer to Fiverr. That small job made the web feel like a place where curiosity could become real work.",
    art: "/stickers/ai-spark.webp",
  },
  {
    id: "repair-shop",
    marker: "The repair-shop era",
    title: "Windows, RAM, repeat",
    body: "Next came a computer repair shop: installing Windows 7, swapping RAM, and learning that understanding the machine is often the fastest way to make it useful again.",
    art: "/stickers/retro-computer.webp",
  },
  {
    id: "millions",
    marker: "The open web",
    title: "From fixes to scale",
    body: "I moved from repairing computers to building and hosting websites of my own. Some of those sites went on to reach millions of views.",
    art: "/stickers/server-rack.webp",
  },
  {
    id: "aui",
    marker: "Ifrane · Morocco",
    title: "Computer science in the mountains",
    body: "I am now a computer science student at Al Akhawayn University, where I built and self-host the Robotics Club website between classes and cold Ifrane mornings.",
    art: "/stickers/ifrane-mountain.webp",
  },
  {
    id: "now",
    marker: "Right now",
    title: "High-traffic systems",
    body: "Today I build Next.js and Node.js applications, manage servers moving more than 200 TB each month, and help a streaming platform prepare for traffic beyond 200,000 unique users a month.",
    art: "/stickers/robot-claw.webp",
  },
] as const;

export const metrics: readonly Metric[] = [
  {
    value: "12",
    label: "Age at my first freelance gig",
    detail: "One Khamsat project was enough to get me hooked on building for people.",
  },
  {
    value: "Millions",
    label: "Views reached",
    detail: "Across websites I have built, hosted, and kept online.",
  },
  {
    value: "200+ TB",
    label: "Data transfer each month",
    detail: "Handled by infrastructure I help operate and maintain.",
  },
  {
    value: "200k+",
    label: "Monthly unique users",
    detail: "On the streaming platform I am currently helping scale.",
  },
] as const;

export const skills: readonly Skill[] = [
  {
    name: "Next.js",
    category: "Build",
    logo: "/logos/nextjs.svg",
    logoLabel: "Next.js",
  },
  {
    name: "Node.js",
    category: "Build",
    logo: "/logos/nodejs.svg",
    logoLabel: "Node.js",
  },
  {
    name: "Kotlin",
    category: "Build",
    logo: "/logos/kotlin.svg",
    logoLabel: "Kotlin",
  },
  {
    name: "Python",
    category: "Automate",
    logo: "/logos/python.svg",
    logoLabel: "Python",
  },
  {
    name: "Self-hosting",
    category: "Operate",
    logo: "/logos/docker.svg",
    logoLabel: "Docker",
  },
  {
    name: "Infrastructure",
    category: "Operate",
    logo: "/logos/cloudflare.svg",
    logoLabel: "Cloudflare",
  },
  {
    name: "AI experiments",
    category: "Explore",
    logo: "/logos/huggingface.svg",
    logoLabel: "Hugging Face",
  },
] as const;

export const projects: readonly Project[] = [
  {
    slug: "heynotai",
    title: "HeyNotAI",
    description:
      "A multimodal AI-content detector for text, images, audio, and video, available on the web and in the browser.",
    status: "Active development",
    tags: ["AI detection", "Multimodal"],
    technologies: ["Next.js 16", "React 19", "WXT", "Hono", "TypeScript", "PocketBase", "Zod"],
    art: "/art/project-heynotai.svg",
    repository: "https://github.com/OmarTaheri/heynotai",
    website: "https://heynotai.com/",
  },
  {
    slug: "portfolio-omartaheri",
    title: "Omar's Digital Deck",
    description:
      "The personal portfolio you are exploring right now—rebuilt as a playful deck of stories, projects, and experiments.",
    status: "Live",
    tags: ["Web", "Portfolio"],
    technologies: ["Next.js", "React", "TypeScript", "vinext", "Cloudflare Workers"],
    art: "/website-image.jpg",
    fullArt: true,
    video: "/showcase.mp4",
    repository: "https://github.com/OmarTaheri/omartaheri-portfolio",
    website: "/",
  },
  {
    slug: "tiermaker-js",
    title: "TierMaker.js",
    description:
      "A typed TierMaker client for Node.js and Bun, paired with documentation built to be as focused as the library.",
    status: "Live",
    tags: ["Open source", "Developer tools"],
    technologies: ["TypeScript", "Node.js", "Bun", "Vitest", "Next.js", "npm"],
    art: "/art/project-tiermaker-js.svg",
    repository: "https://github.com/OmarTaheri/tiermaker.js",
    website: "https://tiermakerjs.omartaheri.com/",
  },
  {
    slug: "netlogger",
    title: "NetLogger",
    description:
      "A consent-first visitor-intelligence workspace for tracking links, live activity, and custom domains.",
    status: "Live",
    tags: ["Analytics", "Privacy"],
    technologies: ["React", "TypeScript", "Vite", "Express", "PostgreSQL", "Drizzle ORM", "WebSockets"],
    art: "/art/project-netlogger.svg",
    repository: "https://github.com/OmarTaheri/NetLogger",
    website: "https://netlogger.omartaheri.com/",
  },
  {
    slug: "roseden",
    title: "Rose Den",
    description:
      "A season-led floral storefront with an editorial, motion-rich experience for bouquets and custom events.",
    status: "Live",
    tags: ["E-commerce", "Brand experience"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "vinext", "Cloudflare"],
    art: "/art/project-roseden.png",
    fullArt: true,
    repository: "https://github.com/OmarTaheri/roseden",
    website: "https://roseden.omartaheri.com/",
  },
  {
    slug: "go-plan",
    title: "goPlan",
    description:
      "A degree planner that helps AUI students see prerequisites, progress, and graduation paths before registration surprises them.",
    status: "Active development",
    tags: ["AI", "Education"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "MySQL 8", "DeepSeek API", "Tailwind CSS", "Zod"],
    art: "/art/project-go-plan.webp",
    repository: "https://github.com/OmarTaheri/goPlan",
  },
  {
    slug: "the-ultimate-tier-board",
    title: "The Ultimate Tier Board",
    description:
      "A full-stack place to build, share, and argue—politely, of course—about tier lists, together in real time.",
    status: "Active development",
    tags: ["Full stack", "Realtime"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Drizzle ORM", "Liveblocks", "Better Auth", "Stripe"],
    art: "/art/project-ultimate-tier-board.svg",
    repository: "https://github.com/OmarTaheri/the-ultimate-tier-board",
  },
  {
    slug: "aui-summer-school",
    title: "AUI Summer School",
    description:
      "The public home for AUI's 2026 Summer School on Industry 4.0 and Smart Manufacturing.",
    status: "Live",
    tags: ["Education", "Event website"],
    technologies: ["HTML", "CSS", "JavaScript", "Responsive design", "Accessibility"],
    art: "/art/project-aui-summer-school.svg",
    repository: "https://github.com/OmarTaheri/aui-summer-school",
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
