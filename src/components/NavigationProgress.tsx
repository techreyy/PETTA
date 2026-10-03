"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Complete and reset progress on route change
  useEffect(() => {
    const bar = barRef.current;
    const container = containerRef.current;
    if (!bar || !container) return;

    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }

    // Complete the bar
    bar.style.width = "100%";
    const resetTimer = setTimeout(() => {
      container.style.opacity = "0";
      setTimeout(() => {
        bar.style.transition = "none";
        bar.style.width = "0%";
      }, 200);
    }, 200);

    return () => clearTimeout(resetTimer);
  }, [pathname, searchParams]);

  // Intercept click on internal links
  useEffect(() => {
    function startProgress() {
      const bar = barRef.current;
      const container = containerRef.current;
      if (!bar || !container) return;

      if (stepTimerRef.current) clearInterval(stepTimerRef.current);

      bar.style.transition = "width 200ms ease-out";
      bar.style.width = "25%";
      container.style.opacity = "1";

      let current = 25;
      stepTimerRef.current = setInterval(() => {
        if (current >= 85) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          return;
        }
        current += Math.random() * 15;
        bar.style.width = `${Math.min(current, 85)}%`;
      }, 150);
    }

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      try {
        const targetUrl = new URL(href, window.location.href);
        if (
          targetUrl.origin === window.location.origin &&
          (targetUrl.pathname !== window.location.pathname ||
            targetUrl.search !== window.location.search)
        ) {
          startProgress();
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    function handlePopState() {
      startProgress();
    }

    window.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 h-[2px] z-[99999] pointer-events-none opacity-0 transition-opacity duration-200"
      role="progressbar"
      aria-label="Navigasi halaman"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#6A9D94] via-[#C89975] to-[#6A9D94] shadow-[0_0_8px_rgba(106,157,148,0.7)]"
        style={{ width: "0%" }}
      />
    </div>
  );
}
