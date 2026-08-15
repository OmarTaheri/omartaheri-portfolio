import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const expectedSectionIds = [
  "profile",
  "projects",
  "story",
  "stats",
  "now",
  "contact",
];

const expectedProjects = [
  {
    slug: "heynotai",
    title: "HeyNotAI",
    markdownHeadings: ["Overview", "Product surfaces", "Architecture", "Technologies", "Current status"],
    markdownTechnologies: ["Next.js 16", "WXT", "Hono", "PocketBase", "Zod", "Stripe"],
    externalLinks: ["https://heynotai.com/", "https://github.com/OmarTaheri/heynotai"],
  },
  {
    slug: "portfolio-omartaheri",
    title: "Omar's Digital Deck",
    markdownHeadings: ["Overview", "What I built", "Technologies", "Design direction", "Current status"],
    markdownTechnologies: ["Next.js", "React", "TypeScript", "vinext", "Cloudflare Workers"],
    externalLinks: ["https://github.com/OmarTaheri/omartaheri-portfolio"],
  },
  {
    slug: "tiermaker-js",
    title: "TierMaker.js",
    markdownHeadings: ["Why I built it", "What it does", "The documentation", "Built with", "Current status"],
    markdownTechnologies: ["TypeScript", "Node.js", "Bun", "Vitest", "Next.js", "npm"],
    externalLinks: ["https://tiermakerjs.omartaheri.com/", "https://github.com/OmarTaheri/tiermaker.js", "https://www.npmjs.com/package/tiermaker.js", "https://tiermakerjs.omartaheri.com/docs"],
  },
  {
    slug: "netlogger",
    title: "NetLogger",
    markdownHeadings: ["The small idea behind a bigger project", "What I built", "Consent is a feature", "Built with", "Current status"],
    markdownTechnologies: ["React", "TypeScript", "Vite", "Express", "PostgreSQL", "Drizzle ORM", "WebSockets"],
    externalLinks: ["https://netlogger.omartaheri.com/", "https://github.com/OmarTaheri/NetLogger", "https://netlogger.omartaheri.com"],
  },
  {
    slug: "roseden",
    title: "Rose Den",
    markdownHeadings: ["Overview", "What I built", "Technologies", "Design direction", "Current status"],
    markdownTechnologies: ["Next.js", "React", "TypeScript", "vinext", "Cloudflare Workers"],
    externalLinks: ["https://roseden.omartaheri.com/", "https://github.com/OmarTaheri/roseden", "https://roseden.omartaheri.com/", "https://github.com/OmarTaheri/roseden"],
  },
  {
    slug: "go-plan",
    title: "goPlan",
    markdownHeadings: ["Why I built it", "What it changes", "Keeping AI in its place", "Built with", "Current status"],
    markdownTechnologies: ["Next.js 16", "React 19", "TypeScript", "MySQL 8", "DeepSeek API", "Zod"],
    externalLinks: ["https://github.com/OmarTaheri/goPlan"],
  },
  {
    slug: "the-ultimate-tier-board",
    title: "The Ultimate Tier Board",
    markdownHeadings: ["Why I built it", "What it can do", "Built with", "The idea that stayed"],
    markdownTechnologies: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Drizzle ORM", "Better Auth", "Liveblocks", "Stripe"],
    externalLinks: ["https://github.com/OmarTaheri/the-ultimate-tier-board"],
  },
  {
    slug: "aui-summer-school",
    title: "AUI Summer School",
    markdownHeadings: ["Overview", "What I built", "Built with", "Keeping it useful", "Current status"],
    markdownTechnologies: ["HTML", "CSS", "JavaScript", "Responsive design"],
    externalLinks: ["https://github.com/OmarTaheri/aui-summer-school"],
  },
];

const homeProjects = expectedProjects.slice(0, 3);

const expectedHeroStickers = [
  "/stickers/omar.png",
  "/stickers/morocco.png",
  "/stickers/laptob.webp",
  "/stickers/vinyl.webp",
  "/stickers/dumbbell.png",
  "/stickers/surfboard.png",
  "/stickers/spaghetti.webp",
  "/stickers/football.webp",
  "/stickers/cat.png",
  "/stickers/spaceship.png",
  "/stickers/rtx5080.png",
  "/stickers/tor-browser-icon.png",
  "/stickers/vs-code.png",
  "/stickers/Starbucks-Cup-PNG-Clipart.png",
  "/stickers/sade.webp",
  "/stickers/me-again.png",
  "/stickers/hunters-licens.webp",
  "/stickers/sakura.gif",
  "/stickers/computer-pixel.gif",
];

const expectedMovableIds = [
  "header-monogram",
  "header-menu",
  "header-nav-profile",
  "header-nav-story",
  "header-nav-projects",
  "header-nav-now",
  "header-nav-contact",
  "header-email",
  "header-reset",
  "header-theme",
  "hero-card-back-left",
  "hero-card-back-right",
  "hero-card-front",
  "hero-intro",
  "hero-sticker-1",
  "hero-sticker-2",
  "hero-sticker-3",
  "hero-sticker-4",
  "hero-sticker-5",
  "hero-sticker-6",
  "hero-sticker-7",
  "hero-sticker-8",
  "hero-sticker-9",
  "hero-sticker-10",
  "hero-sticker-11",
  "hero-sticker-12",
  "hero-sticker-13",
  "hero-sticker-14",
  "hero-sticker-15",
  "hero-sticker-16",
  "hero-sticker-17",
  "hero-sticker-18",
  "hero-sticker-19",
  "story-heading",
  "story-card-1",
  "story-card-2",
  "story-card-3",
  "story-card-4",
  "story-card-5",
  "story-card-6",
  "story-annotation",
  "stats-heading",
  "metric-card-1",
  "metric-card-2",
  "metric-card-3",
  "metric-card-4",
  "skill-card-1",
  "skill-card-2",
  "skill-card-3",
  "skill-card-4",
  "skill-card-5",
  "skill-card-6",
  "skill-card-7",
  "projects-heading",
  "project-card-heynotai",
  "project-card-portfolio-omartaheri",
  "project-card-tiermaker-js",
  "project-card-see-more",
  "now-card",
  "contact-card",
];

let workerPromise;
const renderedPagePromises = new Map();

async function getWorker() {
  workerPromise ??= (async () => {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
    return (await import(workerUrl.href)).default;
  })();

  return workerPromise;
}

async function renderPage(pathname = "/") {
  const requestUrl = new URL(pathname, "http://localhost");
  const cacheKey = `${requestUrl.pathname}${requestUrl.search}`;

  if (!renderedPagePromises.has(cacheKey)) {
    renderedPagePromises.set(
      cacheKey,
      (async () => {
        const worker = await getWorker();
        const response = await worker.fetch(
          new Request(requestUrl, {
            headers: { accept: "text/html" },
          }),
          {
            ASSETS: {
              fetch: async () => new Response("Not found", { status: 404 }),
            },
          },
          {
            waitUntil() {},
            passThroughOnException() {},
          },
        );

        const html = await response.text();
        const closingHtmlIndex = html.toLowerCase().indexOf("</html>");

        assert.notEqual(
          closingHtmlIndex,
          -1,
          "the response should contain a complete HTML document",
        );

        return {
          status: response.status,
          contentType: response.headers.get("content-type") ?? "",
          html,
          documentHtml: html.slice(0, closingHtmlIndex + "</html>".length),
        };
      })(),
    );
  }

  return renderedPagePromises.get(cacheKey);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi,
    (entity, decimal, hexadecimal, named) => {
      if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
      if (hexadecimal) {
        return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      }

      return namedEntities[named?.toLowerCase()] ?? entity;
    },
  );
}

function textContent(fragment) {
  return decodeHtmlEntities(
    fragment
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function attribute(tag, name) {
  const match = tag.match(
    new RegExp(`\\b${escapeRegExp(name)}\\s*=\\s*(["'])(.*?)\\1`, "is"),
  );

  return match ? decodeHtmlEntities(match[2]) : null;
}

function anchorHrefs(fragment) {
  return [...fragment.matchAll(/<a\b[^>]*>/gi)]
    .map(([tag]) => attribute(tag, "href"))
    .filter((href) => href !== null);
}

function elementFragment(fragment, tagName, predicate) {
  const openingTagPattern = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
  const openingTag = [...fragment.matchAll(openingTagPattern)].find(([tag]) =>
    predicate(tag),
  );

  if (!openingTag || openingTag.index === undefined) return null;

  const closingTag = `</${tagName}>`;
  const closingTagIndex = fragment
    .toLowerCase()
    .indexOf(closingTag.toLowerCase(), openingTag.index + openingTag[0].length);

  if (closingTagIndex === -1) return null;

  return fragment.slice(
    openingTag.index,
    closingTagIndex + closingTag.length,
  );
}

function elementFragmentById(fragment, tagName, id) {
  return elementFragment(
    fragment,
    tagName,
    (tag) => attribute(tag, "id") === id,
  );
}

function elementFragmentByClass(fragment, tagName, className) {
  return elementFragment(fragment, tagName, (tag) =>
    (attribute(tag, "class") ?? "").split(/\s+/).includes(className),
  );
}

function headingTexts(fragment, level) {
  return [
    ...fragment.matchAll(
      new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"),
    ),
  ].map((match) => textContent(match[1]));
}

function externalAnchorHrefs(fragment) {
  return anchorHrefs(fragment).filter((href) => /^https?:\/\//i.test(href));
}

test("server-renders the completed portfolio document", async () => {
  const { status, contentType, documentHtml } = await renderPage();

  assert.equal(status, 200);
  assert.match(contentType, /^text\/html\b/i);

  const titleMatch = documentHtml.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  assert.ok(titleMatch, "the portfolio should render a document title");
  assert.match(textContent(titleMatch[1]), /Omar Taheri/i);

  const descriptionTag = [...documentHtml.matchAll(/<meta\b[^>]*>/gi)].find(
    ([tag]) => attribute(tag, "name")?.toLowerCase() === "description",
  )?.[0];
  assert.ok(descriptionTag, "the portfolio should render a meta description");

  const description = attribute(descriptionTag, "content");
  assert.ok(description?.trim(), "the meta description should not be empty");

  const h1Matches = [...documentHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(h1Matches.length, 1, "the page should render exactly one H1");
  assert.ok(textContent(h1Matches[0][1]), "the H1 should contain visible text");
});

test("renders the homepage sections in order with three projects and a see-more card", async () => {
  const { documentHtml } = await renderPage();
  const sectionIds = [...documentHtml.matchAll(/<section\b[^>]*>/gi)]
    .map(([tag]) => attribute(tag, "id"))
    .filter((id) => id !== null);

  assert.deepEqual(
    sectionIds,
    expectedSectionIds,
    "projects should sit directly below the profile hero and before the story",
  );

  const projectsSection = elementFragmentById(
    documentHtml,
    "section",
    "projects",
  );
  assert.ok(projectsSection, "the homepage should render the projects section");
  assert.match(textContent(projectsSection), /Projects in the deck\./i);

  const projectHrefs = anchorHrefs(projectsSection);
  assert.equal(
    projectHrefs.length,
    4,
    "the homepage project preview should contain only four card links",
  );
  const detailHrefs = projectHrefs.filter((href) =>
    /^\/projects\/[^/?#]+$/.test(href),
  );
  assert.deepEqual(
    detailHrefs,
    homeProjects.map((project) => `/projects/${project.slug}`),
    "the homepage should render exactly the three selected project links",
  );
  assert.equal(
    projectHrefs.filter((href) => href === "/projects").length,
    1,
    "the homepage should render exactly one see-more link to /projects",
  );
  const seeMoreAnchor = [
    ...projectsSection.matchAll(/<a\b[^>]*>/gi),
  ].find(([tag]) => attribute(tag, "href") === "/projects")?.[0];
  assert.ok(
    (attribute(seeMoreAnchor ?? "", "class") ?? "")
      .split(/\s+/)
      .includes("project-more-card"),
    "the /projects link should render as the see-more card",
  );

  for (const project of homeProjects) {
    assert.match(
      textContent(projectsSection),
      new RegExp(escapeRegExp(project.title), "i"),
      `the homepage project preview should include ${project.title}`,
    );
  }

  const portfolioImage = [
    ...projectsSection.matchAll(/<img\b[^>]*>/gi),
  ].find(([tag]) => attribute(tag, "src") === "/website-image.jpg")?.[0];
  assert.ok(
    portfolioImage,
    "the Digital Deck project card should render the website image",
  );
  assert.doesNotMatch(
    projectsSection,
    /<video\b/i,
    "the showcase video should live in the project content, not its card",
  );
});

test("renders all eight project cards on the project index", async () => {
  const { status, contentType, documentHtml } = await renderPage("/projects");

  assert.equal(status, 200);
  assert.match(contentType, /^text\/html\b/i);
  assert.deepEqual(headingTexts(documentHtml, 1), [
    "Every project in the deck.",
  ]);

  const collection = elementFragmentByClass(
    documentHtml,
    "section",
    "projects-index-collection",
  );
  assert.ok(collection, "the project index should render its card collection");

  const detailHrefs = anchorHrefs(collection).filter((href) =>
    /^\/projects\/[^/?#]+$/.test(href),
  );
  assert.equal(
    anchorHrefs(collection).length,
    8,
    "the full project collection should contain exactly eight card links",
  );
  assert.deepEqual(
    detailHrefs,
    expectedProjects.map((project) => `/projects/${project.slug}`),
    "the project index should link each of the eight known projects once",
  );
  assert.equal(new Set(detailHrefs).size, 8);

  const collectionText = textContent(collection);
  for (const project of expectedProjects) {
    assert.match(
      collectionText,
      new RegExp(escapeRegExp(project.title), "i"),
      `the project index should include ${project.title}`,
    );
  }
});

test("server-renders every Markdown-backed project detail page", async () => {
  for (const project of expectedProjects) {
    const pathname = `/projects/${project.slug}`;
    const { status, contentType, documentHtml } = await renderPage(pathname);

    assert.equal(status, 200, `${pathname} should render successfully`);
    assert.match(contentType, /^text\/html\b/i);
    assert.deepEqual(
      headingTexts(documentHtml, 1),
      [project.title],
      `${pathname} should render the project title as its only H1`,
    );

    const markdown = elementFragmentByClass(
      documentHtml,
      "div",
      "project-markdown",
    );
    assert.ok(markdown, `${pathname} should render its Markdown note`);
    assert.deepEqual(
      headingTexts(markdown, 2),
      project.markdownHeadings,
      `${pathname} should render all expected Markdown headings in order`,
    );

    const markdownText = textContent(markdown);
    for (const technology of project.markdownTechnologies) {
      assert.match(
        markdownText,
        new RegExp(escapeRegExp(technology), "i"),
        `${pathname} Markdown should include ${technology}`,
      );
    }

    assert.deepEqual(
      externalAnchorHrefs(documentHtml),
      project.externalLinks,
      `${pathname} should render only its configured external project links`,
    );
  }
});

test("uses full-card header art and puts the one-shot showcase in Overview", async () => {
  const { documentHtml: rosedenHtml } = await renderPage(
    "/projects/roseden",
  );
  const { documentHtml } = await renderPage(
    "/projects/portfolio-omartaheri",
  );
  const hero = elementFragmentByClass(
    documentHtml,
    "section",
    "project-detail-hero",
  );
  const markdown = elementFragmentByClass(
    documentHtml,
    "div",
    "project-markdown",
  );
  const showcaseVideo = [
    ...(markdown ?? "").matchAll(/<video\b[^>]*>/gi),
  ].find(([tag]) => attribute(tag, "src") === "/showcase.mp4")?.[0];

  assert.ok(hero, "the project detail should render its hero card");
  assert.match(
    hero,
    /<img\b[^>]*src="\/website-image\.jpg"/i,
    "the hero should use the website image",
  );
  assert.doesNotMatch(hero, /<video\b/i);
  assert.ok(markdown, "the project detail should render its Overview content");
  assert.ok(showcaseVideo, "Overview should render the showcase video");
  assert.equal(attribute(showcaseVideo, "loop"), null);
  assert.notEqual(attribute(showcaseVideo, "controls"), null);
  assert.match(
    documentHtml,
    /<section\b[^>]*class="[^"]*\bproject-detail-hero--full-art\b[^"]*"/i,
    "the portfolio project should use the full-card image treatment",
  );
  assert.match(
    rosedenHtml,
    /<section\b[^>]*class="[^"]*\bproject-detail-hero--full-art\b[^"]*"/i,
    "Rose Den should use the same full-card image treatment as the portfolio project",
  );
  assert.match(
    rosedenHtml,
    /<img\b[^>]*src="\/art\/project-roseden\.png"/i,
    "Rose Den should render its official project artwork",
  );
  const overviewHeadingIndex = markdown.indexOf(">Overview</h2>");
  const showcaseIndex = markdown.indexOf('src="/showcase.mp4"');
  assert.notEqual(overviewHeadingIndex, -1);
  assert.notEqual(showcaseIndex, -1);
  assert.ok(
    overviewHeadingIndex < showcaseIndex,
    "the showcase should appear directly after the Overview heading",
  );

  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const fullCardArtRule = css.match(
    /\.project-detail-hero--full-art\s+\.project-detail-hero__art\s*\{[^}]*\}/s,
  )?.[0];
  assert.ok(
    fullCardArtRule,
    "the stylesheet should expand the image across the hero card",
  );
  assert.match(fullCardArtRule, /position:\s*absolute\s*;/);
  assert.match(fullCardArtRule, /inset:\s*0\s*;/);
  assert.match(fullCardArtRule, /border:\s*0\s*;/);

  const showcaseRule = css.match(
    /\.project-markdown__showcase\s*\{[^}]*\}/s,
  )?.[0];
  assert.ok(showcaseRule, "the stylesheet should define the content video");
  assert.match(showcaseRule, /aspect-ratio:\s*16\s*\/\s*9\s*;/);
});

test("renders the older ornate hero stack and direct image assets", async () => {
  const { documentHtml } = await renderPage();
  const h1Match = documentHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);

  assert.ok(h1Match, "the hero should render its title");
  assert.equal(textContent(h1Match[1]), "Omar Taheri");
  assert.match(documentHtml, /\bcard-stack\b/i);
  assert.match(documentHtml, /\bcard-back-left\b/i);
  assert.match(documentHtml, /\bcard-back-right\b/i);
  assert.doesNotMatch(documentHtml, /\bprofile-note\b/i);
  assert.match(
    textContent(documentHtml),
    /Builds for the web,\s*obsessed with AI\./i,
  );

  const imageSources = [...documentHtml.matchAll(/<img\b[^>]*>/gi)]
    .map(([tag]) => attribute(tag, "src"))
    .filter((src) => src !== null);

  assert.ok(imageSources.length > 0, "the portfolio should render images");
  assert.ok(
    imageSources.every((src) => !src.startsWith("/_vinext/image")),
    "images should use deployable direct asset URLs",
  );
  assert.ok(
    imageSources.some((src) => src.startsWith("/stickers/")),
    "sticker images should render from public assets",
  );
  assert.ok(
    imageSources.some((src) => src.startsWith("/art/")),
    "project images should render from public assets",
  );
  assert.ok(
    imageSources.includes("/card-back-pattern.webp") &&
      imageSources.includes("/card-border-ornate-front.webp"),
    "the older hero artwork should render from direct public asset URLs",
  );
  for (const stickerSource of expectedHeroStickers) {
    assert.ok(
      imageSources.includes(stickerSource),
      `the hero should include ${stickerSource}`,
    );
    assert.equal(
      imageSources.filter((src) => src === stickerSource).length,
      1,
      `the hero should render ${stickerSource} only once`,
    );
  }
});

test("makes each ornate hero card independently movable without selection effects", async () => {
  const { documentHtml } = await renderPage();
  const heroCardIds = [
    "hero-card-back-left",
    "hero-card-back-right",
    "hero-card-front",
  ];

  for (const movableId of heroCardIds) {
    assert.match(
      documentHtml,
      new RegExp(`\\bdata-movable-id=(["'])${movableId}\\1`, "i"),
    );
  }
  assert.doesNotMatch(
    documentHtml,
    /\bdata-movable-id=(["'])hero-card-stack\1/i,
  );

  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(css, /\.card-front\[data-selected="true"\]\s*\{/i);
  assert.doesNotMatch(css, /\.card-front:hover\s*[,{]/i);
});

test("raises the hero cards before the lower centered introduction", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const heroRule = [
    ...css.matchAll(/\.profile-section\s*\{([\s\S]*?)\}/g),
  ].find((match) => /\bmin-height\s*:/.test(match[1]));
  const cardRule = css.match(/\.card\s*\{([\s\S]*?)\}/);
  const introRule = css.match(/\.profile-intro\s*\{([\s\S]*?)\}/);
  const introParagraphRule = css.match(/\.profile-intro p\s*\{([\s\S]*?)\}/);

  assert.ok(heroRule, "the hero should define its full-height layout");
  assert.match(heroRule[1], /min-height:\s*max\(100svh,\s*62rem\)/i);
  assert.match(heroRule[1], /--hero-stage-height:\s*max\(100svh,\s*40rem\)/i);
  assert.match(
    heroRule[1],
    /--hero-safe-top:\s*max\(84px,\s*calc\(env\(safe-area-inset-top\)\s*\+\s*76px\)\)/i,
  );
  assert.ok(cardRule, "the hero should position its cards");
  assert.match(
    heroRule[1],
    /--hero-card-center-y:\s*max\([\s\S]*?var\(--hero-stage-height\)[\s\S]*?var\(--hero-safe-top\)[\s\S]*?var\(--card-half-height\)/i,
  );
  assert.match(
    cardRule[1],
    /top:\s*calc\(var\(--hero-card-center-y\)\s*-\s*var\(--card-half-height\)\)/i,
  );
  assert.match(
    cardRule[1],
    /left:\s*calc\(50%\s*-\s*var\(--card-half-width\)\)/i,
  );
  assert.ok(introRule, "the hero should define its lower introduction");
  assert.match(introRule[1], /bottom:\s*10rem/i);
  assert.match(introRule[1], /left:\s*50%/i);
  assert.match(introRule[1], /transform:\s*translateX\(-50%\)/i);
  assert.ok(introParagraphRule, "the hero should define its introduction copy");
  assert.match(introParagraphRule[1], /margin:\s*0\s+auto/i);
});

test("keeps the site header visually transparent", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const headerRule = css.match(/\.site-header\s*\{([\s\S]*?)\}/);

  assert.ok(headerRule, "the stylesheet should define the site header");
  assert.match(headerRule[1], /\bposition:\s*absolute\s*;/i);
  assert.doesNotMatch(headerRule[1], /\bposition:\s*sticky\s*;/i);
  assert.match(headerRule[1], /\bbackground:\s*transparent\s*;/i);
  assert.match(headerRule[1], /\bbackdrop-filter:\s*none\s*;/i);
});

test("insets the ornate front-card border", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const frontBorderRule = css.match(/\.front-border\s*\{([\s\S]*?)\}/);

  assert.ok(frontBorderRule, "the stylesheet should define the front border");
  assert.match(frontBorderRule[1], /\bpadding:\s*10px\s*;/i);
});

test("uses every hero sticker once without repetition", async () => {
  const stickerSource = await readFile(
    new URL("../app/components/DraggableStickers.tsx", import.meta.url),
    "utf8",
  );
  const configuredSources = [
    ...stickerSource.matchAll(/\bsrc:\s*"([^"]+\.(?:gif|webp|png|jpg))"/g),
  ].map((match) => match[1]);

  assert.deepEqual(configuredSources.sort(), [...expectedHeroStickers].sort());
  assert.equal(new Set(configuredSources).size, expectedHeroStickers.length);
});

test("keeps the me-again sticker visible and eagerly loaded", async () => {
  const { documentHtml } = await renderPage();
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const meAgainImage = [
    ...documentHtml.matchAll(/<img\b[^>]*\bsrc=(["'])\/stickers\/me-again\.png\1[^>]*>/gi),
  ][0]?.[0];
  const stickerFieldRule = css.match(/\.sticker-field\s*\{([\s\S]*?)\}/);

  assert.ok(meAgainImage, "the me-again sticker should server-render");
  assert.equal(attribute(meAgainImage, "loading"), "eager");
  assert.equal(attribute(meAgainImage, "fetchpriority"), "high");
  assert.ok(stickerFieldRule, "the sticker field should have a stacking layer");
  assert.match(stickerFieldRule[1], /\bz-index:\s*10\s*;/i);
});

test("uses one fluid sticker stage with card-anchored portrait and cat", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const stickerSource = await readFile(
    new URL("../app/components/DraggableStickers.tsx", import.meta.url),
    "utf8",
  );
  const cardFrontRule = css.match(/\.card-front\s*\{([\s\S]*?)\}/);
  const stickerFieldRule = css.match(/\.sticker-field\s*\{([\s\S]*?)\}/);
  const portraitRule = css.match(/\.sticker-one\s*\{([\s\S]*?)\}/);
  const catRule = css.match(/\.sticker-nine\s*\{([\s\S]*?)\}/);

  assert.ok(cardFrontRule, "the front hero card should have a stacking layer");
  assert.match(cardFrontRule[1], /\bz-index:\s*20\s*;/i);
  assert.match(css, /--card-width:\s*clamp\(288px,\s*40vw,\s*470px\)/i);
  assert.ok(stickerFieldRule, "the hero should define one bounded sticker stage");
  assert.match(stickerFieldRule[1], /height:\s*var\(--hero-stage-height\)/i);
  assert.match(stickerFieldRule[1], /width:\s*min\(100%,\s*100rem\)/i);
  assert.ok(portraitRule, "the portrait should have a stable card anchor");
  assert.match(
    portraitRule[1],
    /--portrait-size:\s*clamp\(112px,\s*22vmin,\s*246px\)/i,
  );
  assert.match(
    portraitRule[1],
    /top:\s*max\([\s\S]*?var\(--hero-safe-top\)[\s\S]*?var\(--hero-card-top\)[\s\S]*?var\(--portrait-size\)/i,
  );
  assert.match(
    portraitRule[1],
    /left:\s*calc\([\s\S]*?var\(--card-width\)\s*\*\s*0\.24[\s\S]*?var\(--portrait-size\)\s*\*\s*0\.5/i,
  );
  assert.ok(catRule, "the cat should have a stable card-edge anchor");
  assert.match(
    catRule[1],
    /--cat-size:\s*clamp\(64px,\s*13\.5vmin,\s*132px\)/i,
  );
  assert.match(
    catRule[1],
    /top:\s*calc\(var\(--hero-card-center-y\)\s*-\s*\(var\(--cat-size\)\s*\*\s*0\.58\)\)/i,
  );
  assert.match(
    catRule[1],
    /left:\s*min\([\s\S]*?var\(--card-half-width\)[\s\S]*?var\(--cat-size\)/i,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?--hero-tail:\s*calc\(\s*var\(--hero-stage-height\)\s*-\s*var\(--hero-card-bottom\)\s*\)/i,
  );
  assert.match(
    css,
    /\.sticker-eight\s*\{\s*top:\s*calc\(\s*var\(--hero-card-bottom\)\s*\+\s*var\(--hero-tail\)/i,
  );
  assert.doesNotMatch(css, /max-aspect-ratio:\s*5\s*\/\s*4/i);

  assert.match(
    stickerSource,
    /className:\s*"sticker-one",\s*rotation:\s*"0deg"/i,
  );
  assert.match(
    stickerSource,
    /className:\s*"sticker-nine",\s*rotation:\s*"0deg"/i,
  );
});

test("renders the complete movable layout and reset control", async () => {
  const { documentHtml } = await renderPage();
  const movableIds = new Set(
    [...documentHtml.matchAll(/<[^>]+\bdata-movable-id=(["'])(.*?)\1[^>]*>/gi)]
      .map((match) => decodeHtmlEntities(match[2])),
  );

  for (const movableId of expectedMovableIds) {
    assert.ok(
      movableIds.has(movableId),
      `the page should server-render the stable movable ID ${movableId}`,
    );
    const movableTag = [
      ...documentHtml.matchAll(/<[^>]+\bdata-movable-id=(["'])(.*?)\1[^>]*>/gi),
    ].find((match) => decodeHtmlEntities(match[2]) === movableId)?.[0];
    assert.equal(
      attribute(movableTag ?? "", "draggable"),
      "false",
      `${movableId} should disable native browser dragging`,
    );
  }

  const resetButton = [...documentHtml.matchAll(/<button\b[^>]*>/gi)].find(
    ([tag]) => attribute(tag, "data-movable-id") === "header-reset",
  )?.[0];
  assert.ok(resetButton, "the header should render the movable Reset button");
});

test("removes sticker hover-only animation", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(css, /\.draggable-sticker:hover\s*\{/i);
  assert.doesNotMatch(
    css,
    /\.draggable-sticker\[data-dragging="true"\][^{]*\{[^}]*\b(?:filter|scale)\s*:/is,
  );
});

test("keeps live dragging on the compositor hot path", async () => {
  const movementSource = await readFile(
    new URL("../app/components/MovementSystem.tsx", import.meta.url),
    "utf8",
  );
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(movementSource, /requestAnimationFrame\(runDragFrame\)/);
  assert.match(movementSource, /element\.style\.translate\s*=/);
  assert.doesNotMatch(movementSource, /--move-[xy]/);
  assert.match(movementSource, /const sharedLayoutStore = createLayoutStore\(\)/);
  assert.doesNotMatch(
    movementSource,
    /Movable must be rendered inside MovementProvider/,
  );
  assert.doesNotMatch(css, /background-attachment:\s*fixed/i);
  assert.match(
    css,
    /\.movable-shell\[data-dragging="true"\][\s\S]*?will-change:\s*translate/,
  );
  assert.doesNotMatch(css, /data-drag-ready/i);

  const activateDrag = movementSource.match(
    /const activateDrag = useCallback\(\(\) => \{([\s\S]*?)\n  \}, \[\]\);/,
  );
  assert.ok(activateDrag, "drag activation should be independently testable");
  assert.doesNotMatch(
    activateDrag[1],
    /queueDragFrame/,
    "a stationary hold must not start movement or edge scrolling",
  );
  assert.match(
    movementSource,
    /if \(dragRef\.current\?\.kind === "touch"\) \{\s*dragRef\.current\.armed = true;/,
    "a long touch should only arm dragging until meaningful movement occurs",
  );
});

test("keeps card stacking order while dragging and uses a simple filled reset state", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const draggingRule = css.match(
    /\.movable-shell\[data-dragging="true"\]\s*\{([^}]*)\}/i,
  );
  const activeResetRule = css.match(
    /\.header-reset\[data-reset-active="true"\]\s*\{([^}]*)\}/i,
  );

  assert.ok(draggingRule, "movable elements should expose a dragging state");
  assert.doesNotMatch(
    draggingRule[1],
    /\bz-index\s*:/i,
    "dragging should not change an element's stacking order",
  );
  assert.doesNotMatch(
    css,
    /\.card\[data-dragging="true"\]\s*\{[^}]*\bz-index\s*:/is,
    "hero cards should retain their original stacking order",
  );

  assert.ok(activeResetRule, "the reset button should have an active state");
  assert.match(activeResetRule[1], /\bbackground:\s*var\(--rust\)\s*;/i);
  assert.doesNotMatch(
    activeResetRule[1],
    /\b(?:animation|box-shadow|text-shadow)\s*:/i,
    "the active reset state should be a simple fill",
  );
  assert.doesNotMatch(
    css,
    /\.header-reset\[data-reset-active="true"\]::before/i,
    "the active reset state should not add a decorative ring",
  );
});

test("keeps navigation, project links, and contact actions valid", async () => {
  const { documentHtml } = await renderPage();
  const renderedIds = new Set(
    [...documentHtml.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) =>
      decodeHtmlEntities(match[2]),
    ),
  );
  const primaryNavigation = elementFragmentById(
    documentHtml,
    "nav",
    "site-navigation",
  );
  assert.ok(primaryNavigation, "the portfolio should render primary navigation");

  const navigationHrefs = anchorHrefs(primaryNavigation);
  assert.deepEqual(
    navigationHrefs,
    ["/#profile", "/#story", "/projects", "/#now", "/#contact"],
    "header navigation should use routes that remain valid from every page",
  );
  assert.ok(
    navigationHrefs.every((href) => href.startsWith("/")),
    "header navigation should not use page-relative links",
  );

  for (const href of navigationHrefs) {
    const target = new URL(href, "http://localhost");
    if (target.pathname !== "/" || !target.hash) continue;
    const id = target.hash.slice(1);
    assert.ok(
      renderedIds.has(id),
      `the navigation target /#${id} should exist on the homepage`,
    );
  }

  const hrefs = anchorHrefs(documentHtml);
  assert.deepEqual(
    externalAnchorHrefs(documentHtml),
    [],
    "homepage project cards should route to local detail pages, not external sites",
  );
  assert.equal(
    hrefs.filter((href) => href === "mailto:omartaheri2005@gmail.com").length,
    3,
    "the header, profile, and contact email actions should all email Omar",
  );
});

test("does not leak starter content or local font paths", async () => {
  const { html } = await renderPage();

  assert.doesNotMatch(
    html,
    /codex-preview|Your site is taking shape|Building your site|react-loading-skeleton|SkeletonPreview/i,
  );
  assert.doesNotMatch(html, /C:[\\/]+Users\b/i);
  assert.doesNotMatch(html, /\bfile:\/\//i);
});
