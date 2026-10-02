"use client";

import React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <head>
        <title>Kendala Sistem | Petta Desain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          margin: 0,
          padding: "24px",
          minHeight: "100vh",
          backgroundColor: "#14191E",
          color: "#F4F5F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "540px",
            width: "100%",
            backgroundColor: "#182028",
            border: "1px solid #242E38",
            borderRadius: "16px",
            padding: "36px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              backgroundColor: "rgba(106, 157, 148, 0.15)",
              border: "1px solid rgba(106, 157, 148, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6A9D94",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              margin: "0 0 8px",
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            Petta Desain — Kendala Server
          </h1>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#A2AFBD",
              margin: "0 0 16px",
            }}
          >
            Terjadi kendala saat menghubungkan ke server atau database.
          </p>

          {error?.message && (
            <div
              style={{
                textAlign: "left",
                fontSize: "12px",
                fontFamily: "monospace",
                backgroundColor: "#11151A",
                color: "#E2E8F0",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #242E38",
                marginBottom: "20px",
                wordBreak: "break-word",
                maxHeight: "140px",
                overflowY: "auto",
                lineHeight: 1.5,
              }}
            >
              <strong>Error: </strong>
              {error.message}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                backgroundColor: "#6A9D94",
                color: "#14191E",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Muat Ulang
            </button>
            <Link
              href="/"
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                backgroundColor: "transparent",
                color: "#CBD5E0",
                border: "1px solid #242E38",
                fontWeight: 500,
                fontSize: "14px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Ke Halaman Utama
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
