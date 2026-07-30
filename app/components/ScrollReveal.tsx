"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".section-heading",
  ".project-deck__item",
  ".story-route__stop",
  ".story-section__annotation",
  ".metric-card",
  ".skill-hand > h3",
  ".skill-card",
  ".contact-finale",
].join(", ");

const STAGGER_STEP = 90;
const MAX_STAGGER = 360;

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const registered = new WeakSet<Element>();
    const sectionCounts = new WeakMap<Element, number>();
    const settleTimers = new Set<number>();

    const reveal = (element: HTMLElement) => {
      let settled = false;

      const settle = () => {
        if (settled) return;
        settled = true;
        element.removeEventListener("transitionend", onTransitionEnd);
        element.removeAttribute("data-reveal");
        element.removeAttribute("data-reveal-visible");
        element.style.removeProperty("--reveal-delay");
      };

      const onTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName === "transform") settle();
      };

      element.addEventListener("transitionend", onTransitionEnd);
      window.requestAnimationFrame(() => {
        element.dataset.revealVisible = "true";
      });

      const timer = window.setTimeout(() => {
        settleTimers.delete(timer);
        settle();
      }, 1800);
      settleTimers.add(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          reveal(element);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    const register = (scope: ParentNode) => {
      const elements = Array.from(
        scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
      );

      elements.forEach((element) => {
        if (registered.has(element)) return;
        registered.add(element);

        const group = element.closest("section") ?? document.body;
        const index = sectionCounts.get(group) ?? 0;
        sectionCounts.set(group, index + 1);

        element.dataset.reveal = "true";
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(index * STAGGER_STEP, MAX_STAGGER)}ms`,
        );

        if (element.getBoundingClientRect().top < window.innerHeight * 0.88) {
          reveal(element);
        } else {
          observer.observe(element);
        }
      });
    };

    root.classList.add("reveal-ready");
    register(document);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(REVEAL_SELECTOR)) register(node.parentElement ?? node);
            register(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
