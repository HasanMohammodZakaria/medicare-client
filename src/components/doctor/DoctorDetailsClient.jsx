"use client";

import Link from "next/link";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";

// ── Back Button ──────────────────────────────────────────────────
export function BackLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/doctors"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        fontWeight: 600,
        color: hovered ? "var(--primary)" : "var(--text-muted)",
        textDecoration: "none",
        marginBottom: 24,
        transition: "color 150ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MdArrowBack size={16} /> Back to Doctors
    </Link>
  );
}

// ── Book Now Button ──────────────────────────────────────────────

export function BookNowButton({ doctorId }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/booking/${doctorId}`} style={{ textDecoration: "none" }}>
      <button
        type="button"
        style={{
          padding: "12px 32px",
          background: hovered ? "var(--primary-hover)" : "var(--primary)",
          color: "var(--background)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "var(--shadow-sm)",
          transform: hovered ? "scale(1.02)" : "scale(1)",
          transition: "background 150ms, transform 150ms",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Book Now
      </button>
    </Link>
  );
}
