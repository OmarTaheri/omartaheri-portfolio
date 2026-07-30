import type { Metadata } from "next";
import { headers } from "next/headers";
import { LoadingScreen } from "./components/LoadingScreen";
import { LayoutTracker } from "./components/LayoutTracker";
import { MovementProvider } from "./components/MovementSystem";
import { ScrollReveal } from "./components/ScrollReveal";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

const themeInitializer = `
  (() => {
    try {
      const saved = localStorage.getItem("omar-theme");
      const theme =
        saved === "light" || saved === "dark"
          ? saved
          : matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark";
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  })();
`;

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: "Omar Taheri — Builds for the web, obsessed with AI",
    description:
      "Omar Taheri is a web developer and computer science student building AI-powered products, high-traffic applications, and resilient infrastructure.",
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
    },
    openGraph: {
      title: "Omar Taheri — Digital Deck",
      description:
        "A collectible-card portfolio about web development, AI experiments, robotics, and scaling systems.",
      type: "website",
      images: [
        {
          url: new URL("/og-projects.png", baseUrl).toString(),
          width: 1536,
          height: 1024,
          alt: "Omar Taheri — Projects in the deck",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Omar Taheri — Digital Deck",
      description:
        "A collectible-card portfolio about web development, AI experiments, robotics, and scaling systems.",
      images: [new URL("/og-projects.png", baseUrl).toString()],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-loading="true" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/eb-garamond-latin-italic-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body>
        <MovementProvider>
          <LoadingScreen />
          <LayoutTracker />
          <ScrollReveal />
          <SiteHeader />
          {children}
        </MovementProvider>
      </body>
    </html>
  );
}
