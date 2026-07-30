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
    technologies: [
      "Next.js 16",
      "React 19",
      "WXT",
      "Hono",
      "TypeScript",
      "PocketBase",
      "Zod",
    ],
    art: "/art/project-heynotai.svg",
    repository: "https://github.com/OmarTaheri/heynotai",
    website: "https://heynotai.com/",
  },
  {
    slug: "vex-u",
    title: "VEX U",
    description:
      "My current build: a robotics project still taking shape behind the workshop doors.",
    status: "In play now",
    tags: ["Robotics", "In progress"],
    technologies: ["Robotics hardware", "Iterative prototyping"],
    art: "/art/project-vex-u.webp",
  },
  {
    slug: "portfolio-omartaheri",
    title: "portfolio-omartaheri",
    description: "The personal portfolio you are exploring right now.",
    status: "Live",
    tags: ["Web", "Portfolio"],
    technologies: ["Next.js", "React", "TypeScript", "CSS", "Cloudflare"],
    art: "/art/project-portfolio.webp",
    website: "/",
  },
  {
    slug: "go-plan",
    title: "Go Plan",
    description:
      "An AI-powered degree planner designed for Al Akhawayn University students.",
    status: "Project",
    tags: ["AI", "Education"],
    technologies: ["AI-assisted planning", "Web application"],
    art: "/art/project-go-plan.webp",
  },
  {
    slug: "backblaze-site-backup",
    title: "backblaze-site-backup",
    description:
      "A Python utility that uses the Backblaze API to automate website backups.",
    status: "Utility",
    tags: ["Python", "Backblaze"],
    technologies: ["Python", "Backblaze API", "Backup automation"],
    art: "/art/project-backblaze.webp",
  },
  {
    slug: "floussi-merchant",
    title: "Floussi Merchant",
    description:
      "A Kotlin mobile app for managing money, built during the CIH Hackathon.",
    status: "Hackathon",
    tags: ["Kotlin", "Mobile"],
    technologies: ["Kotlin", "Android", "Mobile product design"],
    art: "/art/project-floussi.webp",
  },
  {
    slug: "mycv",
    title: "mycv",
    description: "A personal website shaped like a curriculum vitae.",
    status: "Experiment",
    tags: ["Web", "Personal"],
    technologies: ["HTML", "CSS", "Personal web design"],
    art: "/art/project-mycv.webp",
  },
  {
    slug: "robotics-club",
    title: "Robotics Club",
    description:
      "The web home of Al Akhawayn University's Robotics Club, built and self-hosted.",
    status: "Live",
    tags: ["Web app", "Self-hosted"],
    technologies: ["Web application", "Self-hosting", "Server operations"],
    art: "/art/project-robotics-club.webp",
    website: "https://auirobotics.com/",
  },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
