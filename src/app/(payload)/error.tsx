"use client";

import React from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#14191E",
        color: "#F4F5F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          backgroundColor: "#182028",
          border: "1px solid #242E38",
          borderRadius: "16px",
          padding: "36px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            backgroundColor: "rgba(229, 62, 62, 0.15)",
            color: "#FC8181",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          CMS · KENDALA DATABASE
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            margin: "0 0 12px",
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
          }}
        >
          Gagal Memuat Admin Panel
        </h1>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#A0AEC0",
            margin: "0 0 20px",
          }}
        >
          Terjadi kendala saat menghubungkan ke database PostgreSQL yang terpasang di konfigurasi server.
        </p>

        {error?.message && (
          <div
            style={{
              backgroundColor: "#11151A",
              borderRadius: "10px",
              padding: "14px 16px",
              border: "1px solid #283038",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#CBD5E0",
                marginBottom: "6px",
              }}
            >
              Pesan Kesalahan:
            </div>
            <div
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#FEB2B2",
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {error.message}
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: "#11151A",
            borderRadius: "10px",
            padding: "16px",
            border: "1px solid #202830",
            marginBottom: "24px",
            fontSize: "13px",
            color: "#A0AEC0",
            lineHeight: 1.7,
          }}
        >
          <strong style={{ color: "#E2E8F0" }}>Langkah Pengecekan:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
            <li>Pastikan database cloud (Supabase / Neon) sedang aktif dan tidak dalam status <em>paused</em>.</li>
            <li>Pastikan password dan host pada <code style={{ color: "#6A9D94" }}>DATABASE_URI</code> di Vercel Settings sudah benar.</li>
            <li>Jika menggunakan Neon / Supabase, pastikan mode SSL aktif (<code style={{ color: "#6A9D94" }}>?sslmode=require</code>).</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6A9D94",
              color: "#14191E",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Coba Muat Ulang
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "#CBD5E0",
              border: "1px solid #242E38",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            Kembali ke Website
          </Link>
        </div>
      </div>
    </main>
  );
}
