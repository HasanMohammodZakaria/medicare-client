"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MdSearch, MdFilterList, MdSort, MdClose } from "react-icons/md";
import DoctorCard from "./DoctorCard";
import Pagination from "@/components/ui/Pagination";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "fee_asc", label: "Fee: Low → High" },
  { value: "fee_desc", label: "Fee: High → Low" },
  { value: "experience", label: "Most Experienced" },
];

const selectStyle = {
  height: 42,
  padding: "0 14px",
  background: "var(--surface-secondary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};

export default function AllDoctors({
  initialDoctors, // doctor array
  totalDoctors, // মোট কতটা doctor (backend থেকে)
  totalPages, // মোট কতটা page
  specializations,
  initialFilters, // { search, specialization, sortBy, page }
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialFilters.search || "");
  const [specialization, setSpecialization] = useState(
    initialFilters.specialization || "all",
  );
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || "newest");

  const currentPage = parseInt(initialFilters.page) || 1;

  // ─── Filter/Page apply করো ───────────────────────────────────
  const applyFilters = (overrides = {}) => {
    const merged = { search, specialization, sortBy, page: 1, ...overrides };
    const params = new URLSearchParams();

    if (merged.search) params.set("search", merged.search);
    if (merged.specialization && merged.specialization !== "all")
      params.set("specialization", merged.specialization);
    if (merged.sortBy && merged.sortBy !== "newest")
      params.set("sortBy", merged.sortBy);
    if (merged.page > 1) params.set("page", merged.page);

    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  // Page বদলালে
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (specialization && specialization !== "all")
      params.set("specialization", specialization);
    if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
    if (newPage > 1) params.set("page", newPage);

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
      // উপরে scroll করো
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSpecialization("all");
    setSortBy("newest");
    startTransition(() => router.push(pathname));
  };

  const hasActiveFilters =
    search ||
    (specialization && specialization !== "all") ||
    (sortBy && sortBy !== "newest");

  // Showing X-Y of Z
  const perPage = 10;
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalDoctors);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* ── Page Header ── */}
      <div
        style={{
          background:
            "linear-gradient(160deg, var(--surface) 0%, var(--background) 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "48px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--primary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          MediNexa Directory
        </p>
        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            lineHeight: 1.2,
          }}
        >
          Find Your Doctor
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            color: "var(--text-muted)",
            maxWidth: 480,
            marginInline: "auto",
          }}
        >
          {totalDoctors} verified doctors ready to help you
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
        {/* ── Filter Bar ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: 28,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <MdSearch
              size={18}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters({ search })}
              style={{
                width: "100%",
                height: 42,
                paddingLeft: 38,
                paddingRight: 12,
                background: "var(--surface-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Specialization filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MdFilterList size={16} style={{ color: "var(--text-muted)" }} />
            <select
              value={specialization}
              onChange={(e) => {
                const val = e.target.value;
                setSpecialization(val);
                applyFilters({ specialization: val });
              }}
              style={selectStyle}
            >
              <option value="all">All Specializations</option>
              {specializations.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MdSort size={16} style={{ color: "var(--text-muted)" }} />
            <select
              value={sortBy}
              onChange={(e) => {
                const val = e.target.value;
                setSortBy(val);
                applyFilters({ sortBy: val });
              }}
              style={selectStyle}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <button
            onClick={() => applyFilters({ search })}
            disabled={isPending}
            style={{
              height: 42,
              padding: "0 22px",
              background: "var(--primary)",
              color: "var(--background)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: 14,
              fontWeight: 700,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.6 : 1,
              fontFamily: "inherit",
              transition: "opacity 150ms",
            }}
          >
            {isPending ? "..." : "Search"}
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                height: 42,
                padding: "0 16px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-muted)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "inherit",
              }}
            >
              <MdClose size={14} /> Clear
            </button>
          )}
        </div>

        {/* ── Results count ── */}
        {totalDoctors > 0 && (
          <p
            style={{
              margin: "0 0 20px",
              fontSize: 13,
              color: "var(--text-muted)",
              opacity: isPending ? 0.4 : 1,
            }}
          >
            Showing{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {from}–{to}
            </strong>{" "}
            of{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {totalDoctors}
            </strong>{" "}
            doctors
            {specialization &&
              specialization !== "all" &&
              ` in ${specialization}`}
          </p>
        )}

        {/* ── Doctor Grid ── */}
        {initialDoctors.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>🔍</p>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              No doctors found
            </p>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: "10px 24px",
                background: "var(--primary)",
                color: "var(--background)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(272px, 1fr))",
              gap: 20,
              opacity: isPending ? 0.5 : 1,
              transition: "opacity 200ms",
            }}
          >
            {initialDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
