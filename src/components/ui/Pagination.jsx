"use client";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // মাত্র ১ page হলে দেখাবে ন

  const getPageNumbers = () => {
    const pages = [];
    const showAround = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - showAround && i <= currentPage + showAround)
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." &&
        (i === currentPage - showAround - 1 ||
          i === currentPage + showAround + 1)
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 38,
    minWidth: 38,
    padding: "0 10px",
    borderRadius: "var(--radius-sm)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid var(--border)",
    transition: "all 0.15s",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 32,
        flexWrap: "wrap",
      }}
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...btnBase,
          background:
            currentPage === 1 ? "var(--surface-secondary)" : "var(--surface)",
          color:
            currentPage === 1 ? "var(--text-muted)" : "var(--text-primary)",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        <MdChevronLeft size={18} />
        <span style={{ marginLeft: 2 }}>Prev</span>
      </button>

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`dot-${i}`}
            style={{
              ...btnBase,
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "default",
              letterSpacing: 2,
            }}
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              ...btnBase,
              background:
                page === currentPage ? "var(--primary)" : "var(--surface)",
              color:
                page === currentPage
                  ? "var(--background)"
                  : "var(--text-primary)",
              border:
                page === currentPage
                  ? "1px solid var(--primary)"
                  : "1px solid var(--border)",
              transform: page === currentPage ? "scale(1.05)" : "scale(1)",
            }}
          >
            {page}
          </button>
        ),
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...btnBase,
          background:
            currentPage === totalPages
              ? "var(--surface-secondary)"
              : "var(--surface)",
          color:
            currentPage === totalPages
              ? "var(--text-muted)"
              : "var(--text-primary)",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        <span style={{ marginRight: 2 }}>Next</span>
        <MdChevronRight size={18} />
      </button>

      {/* Page info */}
      <span
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          marginLeft: 8,
          whiteSpace: "nowrap",
        }}
      >
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
