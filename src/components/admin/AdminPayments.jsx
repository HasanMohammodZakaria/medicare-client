"use client";
// app/dashboard/admin/payments/_components/AdminPaymentsClient.jsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminPayments } from "@/app/lib/actions/admin.action";
import {
  MdSearch,
  MdRefresh,
  MdPayment,
  MdCheckCircle,
  MdAccessTime,
  MdCancel,
} from "react-icons/md";
import CircleDollar from "@gravity-ui/icons/CircleDollar";
import Calendar from "@gravity-ui/icons/Calendar";

// ── Payment Status config ──────────────────────────────────────────
const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    color: "var(--success)",
    bg: "var(--success-subtle)",
    icon: <MdCheckCircle size={12} />,
  },
  pending: {
    label: "Pending",
    color: "var(--warning)",
    bg: "var(--warning-subtle)",
    icon: <MdAccessTime size={12} />,
  },
  refunded: {
    label: "Refunded",
    color: "var(--info)",
    bg: "var(--info-subtle)",
    icon: <MdCancel size={12} />,
  },
  refund_requested: {
    label: "Refund Requested",
    color: "var(--warning)",
    bg: "var(--warning-subtle)",
    icon: <MdAccessTime size={12} />,
  },
  failed: {
    label: "Failed",
    color: "var(--danger)",
    bg: "var(--danger-subtle)",
    icon: <MdCancel size={12} />,
  },
};

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
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
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            {sub}
          </p>
        )}
      </div>
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
        gap: 4,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
      }}
    >
      {s.icon} {s.label}
    </span>
  );
}

// ── Payment Row (Desktop) ──────────────────────────────────────────
function PaymentRow({ pay, index }) {
  const date = pay.paymentDate
    ? new Date(pay.paymentDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Patient */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary-subtle)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {pay.patientName?.[0]?.toUpperCase() ?? "P"}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {pay.patientName ?? "Unknown"}
          </p>
        </div>
      </td>

      {/* Doctor */}
      <td style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {pay.doctorName ?? "Unknown"}
        </p>
      </td>

      {/* Amount */}
      <td style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: "var(--success)",
          }}
        >
          $
          {(pay.amount ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
      </td>

      {/* Transaction ID */}
      <td style={{ padding: "14px 16px" }}>
        {pay.transactionId ? (
          <span
            style={{
              fontFamily: "monospace",
              background: "var(--bg-muted)",
              padding: "3px 8px",
              borderRadius: 6,
              fontSize: 11,
              color: "var(--text-secondary)",
            }}
          >
            #{pay.transactionId.slice(-10).toUpperCase()}
          </span>
        ) : (
          "—"
        )}
      </td>

      {/* Date */}
      <td style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          <Calendar
            style={{ width: 13, height: 13, color: "var(--text-muted)" }}
          />
          {date}
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 16px" }}>
        <StatusBadge status={pay.paymentStatus} />
      </td>
    </motion.tr>
  );
}

// ── Payment Card (Mobile) ──────────────────────────────────────────
function PaymentCard({ pay, index }) {
  const date = pay.paymentDate
    ? new Date(pay.paymentDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
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
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {pay.patientName ?? "Unknown"}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            → {pay.doctorName ?? "Unknown"}
          </p>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: "var(--success)",
          }}
        >
          $
          {(pay.amount ?? 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Calendar style={{ width: 12, height: 12 }} /> {date}
        </span>
        <StatusBadge status={pay.paymentStatus} />
      </div>

      {pay.transactionId && (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          Txn:{" "}
          <span
            style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}
          >
            #{pay.transactionId.slice(-10).toUpperCase()}
          </span>
        </p>
      )}
    </motion.div>
  );
}

// ── Empty State ────────────────────────────────────────────────────
function EmptyState({ search }) {
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
        <MdPayment size={32} />
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        No payments found
      </p>
      <p
        style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)" }}
      >
        {search ? "Try adjusting your search." : "No payment records yet."}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function AdminPayments({ initialPayments = [] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.paymentStatus === "paid");
    const totalRevenue = paid.reduce((s, p) => s + (p.amount ?? 0), 0);
    const pending = payments.filter((p) => p.paymentStatus === "pending");
    const refunded = payments.filter((p) => p.paymentStatus === "refunded");
    return {
      totalRevenue,
      paidCount: paid.length,
      pendingCount: pending.length,
      refundedCount: refunded.length,
    };
  }, [payments]);

  // ── Filter + Search + Sort ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...payments];

    if (statusFilter !== "all") {
      list = list.filter((p) => p.paymentStatus === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.patientName?.toLowerCase().includes(q) ||
          p.doctorName?.toLowerCase().includes(q) ||
          p.transactionId?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      const da = new Date(a.paymentDate || 0);
      const db = new Date(b.paymentDate || 0);
      return sortOrder === "desc" ? db - da : da - db;
    });

    return list;
  }, [payments, statusFilter, search, sortOrder]);

  // ── Refresh ───────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getAdminPayments();
      setPayments(fresh);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: `${stats.paidCount} successful payments`,
      color: "var(--success)",
      icon: <CircleDollar style={{ width: 22, height: 22 }} />,
    },
    {
      label: "Pending Payments",
      value: stats.pendingCount,
      sub: "Awaiting confirmation",
      color: "var(--warning)",
      icon: <MdAccessTime size={22} />,
    },
    {
      label: "Total Records",
      value: payments.length,
      sub: "All time",
      color: "var(--primary)",
      icon: <MdPayment size={22} />,
    },
    {
      label: "Refunded",
      value: stats.refundedCount,
      sub: "Processed refunds",
      color: "var(--info)",
      icon: <MdCancel size={22} />,
    },
  ];

  const selectStyle = {
    padding: "9px 32px 9px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg-muted)",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };

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
          Payment Management
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          Monitor all payment transactions across the platform
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} index={i} />
        ))}
      </div>

      {/* ── Toolbar — single row, 4 items side by side ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "14px 16px",
          marginBottom: 16,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* 1. Search */}
        <div style={{ flex: "2 1 200px", position: "relative" }}>
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
            placeholder="Search patient, doctor, txn..."
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

        {/* 2. All Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 120px" }}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>

        {/* 3. Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ ...selectStyle, flex: "1 1 130px" }}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>

        {/* 4. Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            flex: "0 0 auto",
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
        of {payments.length} records
      </p>

      {/* ── Desktop Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="pay-table-wrap"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {filtered.length === 0 ? (
          <EmptyState search={search} />
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
                    "Patient",
                    "Doctor",
                    "Amount",
                    "Transaction ID",
                    "Date",
                    "Status",
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
                  {filtered.map((pay, i) => (
                    <PaymentRow key={pay._id} pay={pay} index={i} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Mobile Cards ── */}
      <div
        className="pay-mobile-cards"
        style={{ display: "none", flexDirection: "column", gap: 10 }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
            }}
          >
            <EmptyState search={search} />
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((pay, i) => (
              <PaymentCard key={pay._id} pay={pay} index={i} />
            ))}
          </AnimatePresence>
        )}
      </div>

      <style>{`
                @media (max-width: 768px) {
                    .pay-table-wrap { display: none !important; }
                    .pay-mobile-cards { display: flex !important; }
                }
            `}</style>
    </div>
  );
}
