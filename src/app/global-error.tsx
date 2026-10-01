"use client";

import React from "react";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#14191E] text-[#F9F8F6] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#182028] border border-[#242E38] rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#6A9D94]/10 border border-[#6A9D94]/30 flex items-center justify-center text-[#6A9D94]">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white mb-2">
            Petta Desain — Memuat Halaman
          </h1>
          <p className="text-sm text-[#A2AFBD] mb-6">
            Terjadi kendala sementara pada koneksi server. Silakan coba muat ulang halaman.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 rounded-full bg-[#6A9D94] text-[#14191E] font-medium text-sm hover:bg-[#7FB0A7] transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
