"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot(): boolean {
  return navigator.onLine;
}

function getServerSnapshot(): boolean {
  return true;
}

export function OfflineExperience() {
  const router = useRouter();
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getServerSnapshot);
  const [reconnected, setReconnected] = useState(false);

  // Register service worker for offline fallback
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          if (process.env.NODE_ENV === "development") {
            console.debug("[SW] Registration skipped or failed:", err);
          }
        });
    }
  }, []);

  // Show brief reconnection banner when coming back online
  useEffect(() => {
    function onOnline() {
      setReconnected(true);
      const timer = setTimeout(() => {
        setReconnected(false);
        try {
          router.refresh();
        } catch {
          window.location.reload();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [router]);

  const handleManualRetry = useCallback(() => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      const button = document.getElementById("petta-offline-retry-btn");
      if (button) {
        button.classList.add("scale-95");
        setTimeout(() => button.classList.remove("scale-95"), 150);
      }
    }
  }, []);

  if (isOnline && !reconnected) {
    return null;
  }

  // Brief toast banner when reconnected
  if (reconnected && isOnline) {
    return (
      <aside
        className="fixed bottom-6 right-6 z-[99999] bg-[#14191E] border border-[#6A9D94]/50 text-[#F9F8F6] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none select-none"
        role="status"
        aria-live="polite"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6A9D94] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6A9D94]" />
        </span>
        <span className="text-xs font-sans tracking-wide">
          Koneksi terhubung kembali • Memperbarui...
        </span>
      </aside>
    );
  }

  // Full custom architectural offline overlay
  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#14191E]/96 backdrop-blur-md flex items-center justify-center p-6 text-[#F9F8F6] transition-opacity duration-300"
      role="alert"
      aria-live="assertive"
      aria-label="Koneksi terputus"
    >
      <div className="relative max-w-md w-full bg-[#1A232B]/90 border border-[#E5E2DC]/15 rounded-2xl p-8 sm:p-10 shadow-2xl text-center overflow-hidden">
        {/* Subtle background architectural glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6A9D94]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C89975]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Minimalist animated hairline circle / disconnected signal mark */}
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#6A9D94]/30 animate-ping [animation-duration:2.8s]" />
          <div className="relative w-14 h-14 rounded-full border border-[#E5E2DC]/20 flex items-center justify-center bg-[#14191E]">
            <svg
              className="w-6 h-6 text-[#6A9D94]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
        </div>

        {/* Studio Identifier */}
        <div className="mb-3">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#6B7785] select-none">
            PETTA • Architectural Practice
          </span>
        </div>

        {/* Required Texts */}
        <h2 className="text-xl sm:text-2xl font-sans font-light tracking-wide text-[#F9F8F6] mb-2">
          Koneksi terputus
        </h2>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14191E] border border-[#6A9D94]/25 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6A9D94] animate-pulse" />
          <span className="text-xs font-sans uppercase tracking-[0.18em] text-[#6A9D94]">
            Menunggu jaringan kembali…
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xs mx-auto mb-7">
          Perangkat Anda sedang tidak terhubung ke internet. Halaman akan dimuat ulang secara otomatis ketika jaringan kembali.
        </p>

        {/* Manual retry action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="petta-offline-retry-btn"
            type="button"
            onClick={handleManualRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-sans tracking-widest uppercase border border-[#6A9D94]/40 hover:border-[#6A9D94] text-[#F9F8F6] hover:bg-[#6A9D94]/10 active:scale-95 transition-all duration-200"
          >
            Coba Hubungkan Ulang
          </button>
        </div>
      </div>
    </div>
  );
}
