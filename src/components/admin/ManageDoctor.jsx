"use client";

import { useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  verifyDoctor,
  rejectDoctor,
  revokeDoctor,
} from "@/app/lib/actions/admin.action";
import {
  MdSearch,
  MdRefresh,
  MdVerified,
  MdCancel,
  MdPending,
} from "react-icons/md";

// ── Status config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  verified: {
    label: "Verified",
    color: "var(--success)",
    bg: "var(--success-subtle)",
    dot: "var(--success)",
  },
  pending: {
    label: "Pending",
    color: "var(--warning)",
    bg: "var(--warning-subtle)",
    dot: "var(--warning)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--danger)",
    bg: "var(--danger-subtle)",
    dot: "var(--danger)",
  },
};

function getInitials(name) {
  if (!name) return "DR";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({ label, count, active, onClick, color }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: active ? color + "18" : "var(--bg-card)",
        border: `1.5px solid ${active ? color : "var(--border)"}`,
        borderRadius: "14px",
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: active ? color : "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 28,
          fontWeight: 700,
          color: active ? color : "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {count}
      </p>
    </motion.div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}

// ── Doctor Row ─────────────────────────────────────────────────────
function DoctorRow({ doctor, onAction, index }) {
  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] = useState(null);

  const handleAction = (type, fn) => {
    setActionType(type);
    startTransition(async () => {
      try {
        await fn(doctor._id);
        onAction();
      } catch (err) {
        console.error(err);
      } finally {
        setActionType(null);
      }
    });
  };

  const status = doctor.verificationStatus || "pending";

  const btnStyle = (bg, color, border) => ({
    height: 30,
    padding: "0 12px",
    borderRadius: "8px",
    fontSize: 12,
    fontWeight: 600,
    cursor: isPending ? "not-allowed" : "pointer",
    border: border ? `1px solid ${border}` : "none",
    background: bg,
    color,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    opacity: isPending ? 0.6 : 1,
    transition: "opacity 0.15s",
    whiteSpace: "nowrap",
  });

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: isPending ? 0.5 : 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Doctor info */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--primary-subtle)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {getInitials(doctor.doctorName || doctor.name)}
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {doctor.doctorName || doctor.name || "Unknown"}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {doctor.userEmail || "—"}
            </p>
          </div>
        </div>
      </td>

      {/* Specialization */}
      <td style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {doctor.specialization || "—"}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {doctor.experience ? `${doctor.experience} yrs exp.` : ""}
        </p>
      </td>

      {/* Qualifications */}
      <td style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-secondary)",
            maxWidth: 160,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {doctor.qualifications || "—"}
        </p>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 16px" }}>
        <StatusBadge status={status} />
      </td>

      {/* Registered */}
      <td style={{ padding: "14px 16px" }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
          {doctor.createdAt
            ? new Date(doctor.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </p>
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {status === "pending" && (
            <>
              <button
                disabled={isPending}
                onClick={() => handleAction("verify", verifyDoctor)}
                style={btnStyle("var(--primary)", "#fff", null)}
              >
                {isPending && actionType === "verify" && <Spinner />}
                Verify
              </button>
              <button
                disabled={isPending}
                onClick={() => handleAction("reject", rejectDoctor)}
                style={btnStyle(
                  "var(--danger-subtle)",
                  "var(--danger)",
                  "var(--danger)",
                )}
              >
                {isPending && actionType === "reject" && (
                  <Spinner color="var(--danger)" />
                )}
                Reject
              </button>
            </>
          )}
          {status === "verified" && (
            <button
              disabled={isPending}
              onClick={() => handleAction("revoke", revokeDoctor)}
              style={btnStyle(
                "var(--warning-subtle)",
                "var(--warning)",
                "var(--warning)",
              )}
            >
              {isPending && actionType === "revoke" && (
                <Spinner color="var(--warning)" />
              )}
              Revoke
            </button>
          )}
          {status === "rejected" && (
            <button
              disabled={isPending}
              onClick={() => handleAction("verify", verifyDoctor)}
              style={btnStyle(
                "var(--success-subtle)",
                "var(--success)",
                "var(--success)",
              )}
            >
              {isPending && actionType === "verify" && (
                <Spinner color="var(--success)" />
              )}
              Re-verify
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

// ── Spinner ────────────────────────────────────────────────────────
function Spinner({ color = "#fff" }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 11,
        height: 11,
        border: `2px solid ${color}40`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

// ── Empty State ────────────────────────────────────────────────────
function EmptyState({ search, filter }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 20px" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "20px",
          background: "var(--bg-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          color: "var(--text-muted)",
        }}
      >
        <MdVerified size={32} />
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        No doctors found
      </p>
      <p
        style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)" }}
      >
        {search
          ? "Try adjusting your search."
          : filter === "all"
            ? "No doctors have registered yet."
            : `No ${filter} doctors right now.`}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function ManageDoctorsClient({ initialDoctors = [] }) {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        d.doctorName?.toLowerCase().includes(q) ||
        d.name?.toLowerCase().includes(q) ||
        d.userEmail?.toLowerCase().includes(q) ||
        d.specialization?.toLowerCase().includes(q);
      const matchFilter = filter === "all" || d.verificationStatus === filter;
      return matchSearch && matchFilter;
    });
  }, [doctors, search, filter]);

  const counts = useMemo(
    () => ({
      all: doctors.length,
      pending: doctors.filter(
        (d) => (d.verificationStatus || "pending") === "pending",
      ).length,
      verified: doctors.filter((d) => d.verificationStatus === "verified")
        .length,
      rejected: doctors.filter((d) => d.verificationStatus === "rejected")
        .length,
    }),
    [doctors],
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { getDoctors } = await import("@/app/lib/actions/admin.action");
      const fresh = await getDoctors();
      setDoctors(fresh);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const statCards = [
    { key: "all", label: "Total Doctors", color: "var(--primary)" },
    { key: "pending", label: "Pending Review", color: "var(--warning)" },
    { key: "verified", label: "Verified", color: "var(--success)" },
    { key: "rejected", label: "Rejected", color: "var(--danger)" },
  ];

  return (
    <div style={{ padding: "24px 20px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 24 }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Manage Doctors
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          Review and manage doctor verification requests
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {statCards.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <StatCard
              label={s.label}
              count={counts[s.key]}
              active={filter === s.key}
              color={s.color}
              onClick={() => setFilter(s.key)}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 220px", position: "relative" }}>
          <MdSearch
            size={18}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-muted)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--bg-muted)",
            color: "var(--text-secondary)",
            fontSize: 13,
            fontWeight: 600,
            cursor: isRefreshing ? "not-allowed" : "pointer",
            opacity: isRefreshing ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          <MdRefresh
            size={16}
            style={{
              animation: isRefreshing ? "spin 1s linear infinite" : "none",
            }}
          />
          Refresh
        </button>
      </motion.div>

      {/* ── Results count ── */}
      <p
        style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-muted)" }}
      >
        Showing{" "}
        <strong style={{ color: "var(--text-primary)" }}>
          {filtered.length}
        </strong>{" "}
        of {doctors.length} doctors
      </p>

      {/* ── Table (desktop) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
        className="doctor-table-wrapper"
      >
        {filtered.length === 0 ? (
          <EmptyState search={search} filter={filter} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--bg-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {[
                    "Doctor",
                    "Specialization",
                    "Qualifications",
                    "Status",
                    "Registered",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((doctor, i) => (
                    <DoctorRow
                      key={doctor._id}
                      doctor={doctor}
                      index={i}
                      onAction={handleRefresh}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Mobile Cards ── */}
      <div
        className="doctor-mobile-cards"
        style={{ display: "none", flexDirection: "column", gap: 10 }}
      >
        <AnimatePresence>
          {filtered.map((doctor, i) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--primary-subtle)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(doctor.doctorName || doctor.name)}
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {doctor.doctorName || doctor.name || "Unknown"}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      {doctor.specialization || "—"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={doctor.verificationStatus || "pending"} />
              </div>
              <DoctorRow
                doctor={doctor}
                index={i}
                onAction={handleRefresh}
                mobileOnly
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Responsive */}
      <style>{`
                @media (max-width: 768px) {
                    .doctor-table-wrapper { display: none !important; }
                    .doctor-mobile-cards { display: flex !important; }
                }
            `}</style>
    </div>
  );
}
