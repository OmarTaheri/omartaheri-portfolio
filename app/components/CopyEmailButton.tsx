"use client";

import { useEffect, useId, useRef, useState } from "react";

const EMAIL_ADDRESS = "omartaheri2005@gmail.com";

type CopyStatus = "idle" | "copied" | "error";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard copy was unavailable.");
  }
}

export function CopyEmailButton() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const statusId = useId();
  const resetTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  const handleCopy = async () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    try {
      await copyText(EMAIL_ADDRESS);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimerRef.current = null;
    }, 4000);
  };

  const statusMessage =
    status === "copied"
      ? "Email address copied to your clipboard."
      : status === "error"
        ? `Copy failed. The email address is ${EMAIL_ADDRESS}.`
        : "";

  return (
    <span className="copy-email-control" data-copy-status={status}>
      <button
        className="copy-email-button header-touch-target"
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${EMAIL_ADDRESS} to clipboard`}
        aria-describedby={statusId}
      >
        <span aria-hidden="true">
          {status === "copied" ? "Copied!" : "Copy email"}
        </span>
      </button>
      <span
        id={statusId}
        className="copy-email-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </span>
    </span>
  );
}
