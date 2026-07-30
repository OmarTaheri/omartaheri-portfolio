"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LoadingPhase = "loading" | "leaving";

function waitForCriticalImages() {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      ".loading-screen img, .card-stack img, .sticker-sixteen img",
    ),
  );

  return Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const finish = () => {
          image.removeEventListener("load", finish);
          image.removeEventListener("error", finish);
          resolve();
        };

        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
        if (image.complete) finish();
      });
    }),
  );
}

export function LoadingScreen() {
  const [phase, setPhase] = useState<LoadingPhase>("loading");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startedAt = performance.now();

    document.documentElement.dataset.loading = "true";

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, duration);
        timers.push(timer);
      });

    const revealPage = async () => {
      await Promise.race([
        Promise.all([
          waitForCriticalImages(),
          document.fonts?.ready ?? Promise.resolve(),
        ]),
        wait(5000),
      ]);

      const minimumDisplay = reducedMotion ? 180 : 1400;
      await wait(Math.max(0, minimumDisplay - (performance.now() - startedAt)));
      if (cancelled) return;

      setPhase("leaving");
      await wait(reducedMotion ? 160 : 900);
      if (cancelled) return;

      setVisible(false);
      delete document.documentElement.dataset.loading;
    };

    void revealPage();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      delete document.documentElement.dataset.loading;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loading-screen loading-screen--${phase}`}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      aria-label={
        phase === "loading"
          ? "Loading Omar Taheri portfolio"
          : "Omar Taheri portfolio ready"
      }
    >
      <div className="loading-cat" aria-hidden="true">
        <Image
          className="loading-cat__image"
          src="/stickers/neko-cat.gif"
          alt=""
          width={180}
          height={126}
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
