"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function OfflineFallbackView() {
  const router = useRouter();
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setReconnecting(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [router]);

  const handleRetry = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#14191E] text-[#F9F8F6] flex items-center justify-center p-6 overflow-hidden font-sans">
      {/* Background architectural ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6A9D94]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C89975]/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative max-w-md w-full bg-[#1A232B]/85 border border-[#E5E2DC]/15 rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
        {/* Animated geometric signal pulse */}
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

        <div className="mb-3">
          <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#6B7785] select-none">
            PETTA • Architectural Practice
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-sans font-light tracking-wide text-[#F9F8F6] mb-2">
          Koneksi terputus
        </h1>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14191E] border border-[#6A9D94]/30 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6A9D94] animate-pulse" />
          <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#6A9D94]">
            {reconnecting ? "Koneksi pulih • Memuat..." : "Menunggu jaringan kembali…"}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xs mx-auto mb-8">
          Halaman ini belum tersedia di cache perangkat saat offline. Halaman akan terbuka secara otomatis segera setelah jaringan kembali.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-sans tracking-widest uppercase border border-[#6A9D94]/50 hover:border-[#6A9D94] text-[#F9F8F6] hover:bg-[#6A9D94]/15 active:scale-95 transition-all duration-200"
          >
            Muat Ulang
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-sans tracking-widest uppercase border border-[#E5E2DC]/20 hover:border-[#E5E2DC]/50 text-[#94A3B8] hover:text-[#F9F8F6] hover:bg-white/5 active:scale-95 transition-all duration-200"
          >
            Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
