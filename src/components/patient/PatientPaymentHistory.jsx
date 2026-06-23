"use client";
// app/dashboard/patient/payment-history/_components/PatientPaymentHistory.jsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdSearch,
  MdReceipt,
  MdPayment,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
} from "react-icons/md";
import CircleDollar from "@gravity-ui/icons/CircleDollar";
import ArrowDown from "@gravity-ui/icons/ArrowDown";
import ArrowUp from "@gravity-ui/icons/ArrowUp";
import Calendar from "@gravity-ui/icons/Calendar";

// ── Status config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    icon: <MdCheckCircle size={14} />,
    color: "var(--success)",
    bg: "var(--success-subtle)",
  },
  pending: {
    label: "Pending",
    icon: <MdAccessTime size={14} />,
    color: "var(--warning)",
    bg: "var(--warning-subtle)",
  },
  refunded: {
    label: "Refunded",
    icon: <MdCancel size={14} />,
    color: "var(--info)",
    bg: "var(--info-subtle)",
  },
  failed: {
    label: "Failed",
    icon: <MdCancel size={14} />,
    color: "var(--danger)",
    bg: "var(--danger-subtle)",
  },
};

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px 22px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            margin: 0,
            marginBottom: 2,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              margin: 0,
              marginTop: 3,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Payment Row (Desktop) ──────────────────────────────────────────
function PaymentRow({ payment, index }) {
  const status = STATUS_CONFIG[payment.paymentStatus] ?? STATUS_CONFIG.pending;
  const date = payment.paymentDate
    ? new Date(payment.paymentDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "var(--primary-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)",
              flexShrink: 0,
            }}
          >
            <MdReceipt size={18} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {payment.doctorName ?? "Doctor"}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
              {payment.doctorSpecialization ?? "Consultation"}
            </p>
          </div>
        </div>
      </td>
      <td
        style={{
          padding: "14px 16px",
          fontSize: 13,
          color: "var(--text-secondary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar
            style={{ width: 14, height: 14, color: "var(--text-muted)" }}
          />
          {date}
        </div>
      </td>
      <td
        style={{
          padding: "14px 16px",
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        {payment.transactionId ? (
          <span
            style={{
              fontFamily: "monospace",
              background: "var(--bg-muted)",
              padding: "3px 8px",
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            #{payment.transactionId.slice(-8).toUpperCase()}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td style={{ padding: "14px 16px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: status.color,
            background: status.bg,
          }}
        >
          {status.icon}
          {status.label}
        </span>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          $
          {(payment.amount ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      </td>
    </motion.tr>
  );
}

// ── Payment Card (Mobile) ──────────────────────────────────────────
function PaymentCard({ payment, index }) {
  const status = STATUS_CONFIG[payment.paymentStatus] ?? STATUS_CONFIG.pending;
  const date = payment.paymentDate
    ? new Date(payment.paymentDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
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
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              background: "var(--primary-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)",
            }}
          >
            <MdReceipt size={18} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {payment.doctorName ?? "Doctor"}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
              {payment.doctorSpecialization ?? "Consultation"}
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          $
          {(payment.amount ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          <Calendar style={{ width: 13, height: 13 }} />
          {date}
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 9px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            color: status.color,
            background: status.bg,
          }}
        >
          {status.icon}
          {status.label}
        </span>
      </div>

      {payment.transactionId && (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          Txn:{" "}
          <span
            style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}
          >
            #{payment.transactionId.slice(-8).toUpperCase()}
          </span>
        </p>
      )}
    </motion.div>
  );
}

// ── Empty State ────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "20px",
          background: "var(--bg-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
        }}
      >
        <MdPayment size={36} />
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        No payments found
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "var(--text-muted)",
          textAlign: "center",
          maxWidth: 260,
        }}
      >
        Your payment history will appear here after you complete an appointment.
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function PatientPaymentHistory({ initialPayments = [] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalPaid = initialPayments
      .filter((p) => p.paymentStatus === "paid")
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);
    const totalPending = initialPayments
      .filter((p) => p.paymentStatus === "pending")
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);
    const totalRefunded = initialPayments
      .filter((p) => p.paymentStatus === "refunded")
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);

    return {
      total: initialPayments.length,
      totalPaid,
      totalPending,
      totalRefunded,
    };
  }, [initialPayments]);

  // ── Filter + Search + Sort ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...initialPayments];

    if (statusFilter !== "all") {
      list = list.filter((p) => p.paymentStatus === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.doctorName?.toLowerCase().includes(q) ||
          p.doctorSpecialization?.toLowerCase().includes(q) ||
          p.transactionId?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      const da = new Date(a.paymentDate || 0);
      const db = new Date(b.paymentDate || 0);
      return sortOrder === "desc" ? db - da : da - db;
    });

    return list;
  }, [initialPayments, statusFilter, search, sortOrder]);

  const statCards = [
    {
      icon: <CircleDollar style={{ width: 22, height: 22 }} />,
      label: "Total Paid",
      value: `$${stats.totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: `${initialPayments.filter((p) => p.paymentStatus === "paid").length} transactions`,
      color: "var(--success)",
    },
    {
      icon: <MdAccessTime size={22} />,
      label: "Pending",
      value: `$${stats.totalPending.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: `${initialPayments.filter((p) => p.paymentStatus === "pending").length} payments`,
      color: "var(--warning)",
    },
    {
      icon: <MdReceipt size={22} />,
      label: "Refunded",
      value: `$${stats.totalRefunded.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: `${initialPayments.filter((p) => p.paymentStatus === "refunded").length} refunds`,
      color: "var(--info)",
    },
    {
      icon: <MdPayment size={22} />,
      label: "Total Transactions",
      value: stats.total,
      sub: "All time",
      color: "var(--primary)",
    },
  ];

  return (
    <div style={{ padding: "24px 20px" }}>
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
          Payment History
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          All your appointment payment records in one place
        </p>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} index={i} />
        ))}
      </div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search — native input, no HeroUI props */}
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
            placeholder="Search by doctor, specialization, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-muted)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: 150 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 32px 9px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-muted)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--bg-muted)",
            color: "var(--text-secondary)",
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {sortOrder === "desc" ? (
            <ArrowDown style={{ width: 15, height: 15 }} />
          ) : (
            <ArrowUp style={{ width: 15, height: 15 }} />
          )}
          {sortOrder === "desc" ? "Newest first" : "Oldest first"}
        </button>

        {/* Active filter chips */}
        {(statusFilter !== "all" || search) && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {statusFilter !== "all" && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "var(--primary-subtle)",
                  color: "var(--primary)",
                  border: "1px solid var(--primary)",
                  cursor: "pointer",
                }}
                onClick={() => setStatusFilter("all")}
              >
                {statusFilter} ✕
              </span>
            )}
            {search && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "var(--bg-muted)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                onClick={() => setSearch("")}
              >
                &ldquo;{search}&rdquo; ✕
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Results count ── */}
      <p
        style={{ margin: "0 0 12px", fontSize: 13, color: "var(--text-muted)" }}
      >
        Showing{" "}
        <strong style={{ color: "var(--text-primary)" }}>
          {filtered.length}
        </strong>{" "}
        of {initialPayments.length} payments
      </p>

      {/* ── Desktop Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
          display: "none",
        }}
        className="md-table-wrapper"
      >
        {filtered.length === 0 ? (
          <EmptyState />
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
                  {["Doctor", "Date", "Transaction ID", "Status", "Amount"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: h === "Amount" ? "right" : "left",
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
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((payment, i) => (
                    <PaymentRow key={payment._id} payment={payment} index={i} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Mobile Cards ── */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
        className="mobile-cards"
      >
        {filtered.length === 0 ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
            }}
          >
            <EmptyState />
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((payment, i) => (
              <PaymentCard key={payment._id} payment={payment} index={i} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Responsive styles — no Tailwind className conflict */}
      <style>{`
                @media (min-width: 768px) {
                    .md-table-wrapper { display: block !important; }
                    .mobile-cards { display: none !important; }
                }
            `}</style>
    </div>
  );
}
