"use client";

import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Movable, ResetLayoutButton } from "./MovementSystem";

const EMAIL_ADDRESS = "omartaheri2005@gmail.com";
const THEME_STORAGE_KEY = "omar-theme";

const navItems = [
  { label: "Profile", href: "/#profile", movableId: "header-nav-profile" },
  { label: "Story", href: "/#story", movableId: "header-nav-story" },
  { label: "Projects", href: "/projects", movableId: "header-nav-projects" },
  { label: "Now", href: "/#now", movableId: "header-nav-now" },
  { label: "Contact", href: "/#contact", movableId: "header-nav-contact" },
] as const;

type Theme = "dark" | "light";

function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const themeTransitionRef = useRef(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const root = document.documentElement;
    root.dataset.menuOpen = "true";

    const focusTimer = window.setTimeout(() => {
      document
        .querySelector<HTMLAnchorElement>(
          '[data-movable-id="header-nav-profile"]',
        )
        ?.focus();
    }, 80);

    const handleMenuKeys = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        document
          .querySelector<HTMLButtonElement>('[data-movable-id="header-menu"]')
          ?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = document
        .getElementById("site-navigation")
        ?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 821px)");

    document.addEventListener("keydown", handleMenuKeys);
    desktopQuery.addEventListener("change", closeAtDesktopWidth);
    return () => {
      delete root.dataset.menuOpen;
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleMenuKeys);
      desktopQuery.removeEventListener("change", closeAtDesktopWidth);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(
    () => () => {
      if (arrivalTimerRef.current !== null) {
        window.clearTimeout(arrivalTimerRef.current);
      }
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  const navigateToSection = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    closeMenu();

    const destination = new URL(href, window.location.href);
    if (
      destination.pathname !== window.location.pathname ||
      !destination.hash
    ) {
      return;
    }

    const target = document.getElementById(destination.hash.slice(1));
    if (!target) return;

    event.preventDefault();
    setActiveNav(href);

    document
      .querySelector<HTMLElement>('[data-scroll-target="true"]')
      ?.removeAttribute("data-scroll-target");

    if (window.location.hash !== destination.hash) {
      window.history.pushState(null, "", destination.hash);
    }

    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }
    if (arrivalTimerRef.current !== null) {
      window.clearTimeout(arrivalTimerRef.current);
    }

    const startY = window.scrollY;
    const scrollPadding =
      Number.parseFloat(
        window.getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || 0;
    const targetY = Math.max(
      0,
      target.getBoundingClientRect().top + startY - scrollPadding,
    );
    const distance = targetY - startY;
    const duration = Math.min(
      1100,
      Math.max(680, Math.abs(distance) * 0.18),
    );
    let startedAt: number | null = null;

    const finishNavigation = () => {
      scrollFrameRef.current = null;
      target.dataset.scrollTarget = "true";
      setActiveNav(null);

      arrivalTimerRef.current = window.setTimeout(() => {
        target.removeAttribute("data-scroll-target");
      }, 950);
    };

    const animateScroll = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        scrollFrameRef.current = window.requestAnimationFrame(animateScroll);
      } else {
        finishNavigation();
      }
    };

    if (Math.abs(distance) < 2) {
      finishNavigation();
    } else {
      scrollFrameRef.current = window.requestAnimationFrame(animateScroll);
    }
  };

  const toggleTheme = () => {
    if (themeTransitionRef.current) return;

    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    let themeCommitted = false;
    const commitTheme = () => {
      if (themeCommitted) return;
      themeCommitted = true;
      root.dataset.theme = nextTheme;

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // The selected theme still applies when storage is unavailable.
      }
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      commitTheme();
      return;
    }

    const backgroundReveal = document.createElement("span");
    const revealDiameter = 160;
    const cornerRadius = Math.hypot(
      window.innerWidth / 2,
      window.innerHeight / 2,
    ) + 2;
    const finalScale = cornerRadius / (revealDiameter / 2);

    backgroundReveal.className = "theme-background-reveal";
    backgroundReveal.dataset.theme = nextTheme;
    backgroundReveal.setAttribute("aria-hidden", "true");
    document.body.prepend(backgroundReveal);

    themeTransitionRef.current = true;

    const cleanupTransition = () => {
      backgroundReveal.remove();
      themeTransitionRef.current = false;
    };
    let reveal: Animation;

    try {
      reveal = backgroundReveal.animate(
        [
          { transform: "translate3d(-50%, -50%, 0) scale(0.001)" },
          {
            transform: `translate3d(-50%, -50%, 0) scale(${finalScale})`,
          },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        },
      );
    } catch {
      commitTheme();
      cleanupTransition();
      return;
    }

    void (async () => {
      try {
        await reveal.finished;
        commitTheme();
      } catch {
        commitTheme();
      } finally {
        cleanupTransition();
      }
    })();
  };

  return (
    <>
      <header className="site-header" data-menu-open={isMenuOpen}>
      <Movable
        as="a"
        movableId="header-monogram"
        className="site-monogram header-touch-target"
        href="/"
        aria-label="Omar Taheri — home"
        onClick={closeMenu}
      >
        <span className="monogram-glyph" aria-hidden="true">
          <span>O</span>
          <span>T</span>
        </span>
      </Movable>

      <Movable
        as="button"
        movableId="header-menu"
        className="mobile-menu-toggle header-icon-button header-touch-target"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="site-navigation"
        aria-label={`${isMenuOpen ? "Close" : "Open"} navigation menu`}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span className="menu-toggle-lines" aria-hidden="true">
          <span />
          <span />
        </span>
      </Movable>

        <nav
          id="site-navigation"
          className={`site-navigation${isMenuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <div className="mobile-navigation-header">
            <span>Menu</span>
            <button
              className="mobile-navigation-close"
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <ul className="site-navigation-list">
            {navItems.map((item, index) => (
              <li
                key={item.href}
                style={{ "--nav-order": index } as CSSProperties}
              >
              <Movable
                as="a"
                movableId={item.movableId}
                className={`site-navigation-link header-touch-target${
                  activeNav === item.href ? " is-navigating" : ""
                }`}
                href={item.href}
                onClick={(event) => navigateToSection(event, item.href)}
              >
                {item.label}
              </Movable>
            </li>
            ))}
          </ul>
        </nav>

      <div className="header-actions">
        <Movable
          as="a"
          movableId="header-email"
          className="header-email-cta header-touch-target"
          href={`mailto:${EMAIL_ADDRESS}`}
        >
          Email me
        </Movable>

        <ResetLayoutButton className="header-reset header-touch-target" />

        <Movable
          as="button"
          movableId="header-theme"
          className="theme-toggle header-icon-button header-touch-target"
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle light and dark color theme"
          title="Toggle light and dark color theme"
        >
          <span className="theme-toggle-glyph" aria-hidden="true">
            ◐
          </span>
        </Movable>
        </div>
      </header>

      <button
        className={`mobile-navigation-scrim${isMenuOpen ? " is-open" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />
    </>
  );
}
