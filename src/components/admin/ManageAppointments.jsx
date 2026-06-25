"use client";
// app/dashboard/admin/manage-appointments/_components/ManageAppointmentsClient.jsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminAppointments } from "@/app/lib/actions/admin.action";
import {
  MdSearch,
  MdRefresh,
  MdCalendarMonth,
  MdPerson,
  MdLocalHospital,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdPending,
} from "react-icons/md";
import Calendar from "@gravity-ui/icons/Calendar";
import Person from "@gravity-ui/icons/Person";

// ── Status config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "var(--warning)",
    bg: "var(--warning-subtle)",
    icon: <MdPending size={12} />,
  },
  accepted: {
    label: "Accepted",
    color: "var(--info)",
    bg: "var(--info-subtle)",
    icon: <MdAccessTime size={12} />,
  },
  completed: {
    label: "Completed",
    color: "var(--success)",
    bg: "var(--success-subtle)",
    icon: <MdCheckCircle size={12} />,
  },
  rejected: {
    label: "Rejected",
    color: "var(--danger)",
    bg: "var(--danger-subtle)",
    icon: <MdCancel size={12} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--text-muted)",
    bg: "var(--bg-muted)",
    icon: <MdCancel size={12} />,
  },
};

// ── Payment Status config ──────────────────────────────────────────
const PAYMENT_CONFIG = {
  paid: { label: "Paid", color: "var(--success)", bg: "var(--success-subtle)" },
  unpaid: {
    label: "Unpaid",
    color: "var(--danger)",
    bg: "var(--danger-subtle)",
  },
  pending: {
    label: "Pending",
    color: "var(--warning)",
    bg: "var(--warning-subtle)",
  },
};

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({ label, count, active, color, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: active ? color + "15" : "var(--bg-card)",
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

// ── Payment Badge ──────────────────────────────────────────────────
function PaymentBadge({ status }) {
  const s = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG.unpaid;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
      }}
    >
      {s.label}
    </span>
  );
}

// ── Appointment Row (Desktop) ──────────────────────────────────────
function AppointmentRow({ appt, index }) {
  const date = appt.appointmentDate
    ? new Date(appt.appointmentDate).toLocaleDateString("en-US", {
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
            {appt.patientName?.[0]?.toUpperCase() ?? "P"}
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
              {appt.patientName ?? "Unknown"}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 11,
                color: "var(--text-muted)",
              }}
            >
              {appt.patientEmail ?? "—"}
            </p>
          </div>
        </div>
      </td>

      {/* Doctor */}
      <td style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {appt.doctorName ?? "Unknown"}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          {appt.specialization ?? "—"}
        </p>
      </td>

      {/* Date & Time */}
      <td style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          <MdCalendarMonth
            size={14}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          {date}
        </div>
        {appt.appointmentTime && (
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 11,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <MdAccessTime size={12} /> {appt.appointmentTime}
          </p>
        )}
      </td>

      {/* Symptoms */}
      <td style={{ padding: "14px 16px", maxWidth: 160 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {appt.symptoms ?? "—"}
        </p>
      </td>

      {/* Appointment Status */}
      <td style={{ padding: "14px 16px" }}>
        <StatusBadge status={appt.appointmentStatus} />
      </td>

      {/* Payment Status */}
      <td style={{ padding: "14px 16px" }}>
        <PaymentBadge status={appt.paymentStatus} />
      </td>
    </motion.tr>
  );
}

// ── Appointment Card (Mobile) ──────────────────────────────────────
function AppointmentCard({ appt, index }) {
  const date = appt.appointmentDate
    ? new Date(appt.appointmentDate).toLocaleDateString("en-US", {
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
      {/* Top row */}
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
            {appt.patientName ?? "Unknown"}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 11,
              color: "var(--text-muted)",
            }}
          >
            {appt.patientEmail ?? "—"}
          </p>
        </div>
        <StatusBadge status={appt.appointmentStatus} />
      </div>

      {/* Doctor */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        <MdLocalHospital size={13} style={{ color: "var(--text-muted)" }} />
        <span>{appt.doctorName ?? "—"}</span>
        {appt.specialization && (
          <span style={{ color: "var(--text-muted)" }}>
            · {appt.specialization}
          </span>
        )}
      </div>

      {/* Date + Payment */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MdCalendarMonth size={13} /> {date}
          {appt.appointmentTime && ` · ${appt.appointmentTime}`}
        </span>
        <PaymentBadge status={appt.paymentStatus} />
      </div>
    </motion.div>
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
        <MdCalendarMonth size={32} />
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        No appointments found
      </p>
      <p
        style={{ margin: "6px 0 0", fontSize: 13, color: "var(--text-muted)" }}
      >
        {search
          ? "Try adjusting your search."
          : filter === "all"
            ? "No appointments have been booked yet."
            : `No ${filter} appointments right now.`}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function ManageAppointments({ initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Filter + Search ────────────────────────────────────────────
  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        a.patientName?.toLowerCase().includes(q) ||
        a.patientEmail?.toLowerCase().includes(q) ||
        a.doctorName?.toLowerCase().includes(q) ||
        a.specialization?.toLowerCase().includes(q) ||
        a.symptoms?.toLowerCase().includes(q);
      const matchFilter = filter === "all" || a.appointmentStatus === filter;
      return matchSearch && matchFilter;
    });
  }, [appointments, search, filter]);

  // ── Counts ────────────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      all: appointments.length,
      pending: appointments.filter((a) => a.appointmentStatus === "pending")
        .length,
      accepted: appointments.filter((a) => a.appointmentStatus === "accepted")
        .length,
      completed: appointments.filter((a) => a.appointmentStatus === "completed")
        .length,
      rejected: appointments.filter((a) => a.appointmentStatus === "rejected")
        .length,
      cancelled: appointments.filter((a) => a.appointmentStatus === "cancelled")
        .length,
    }),
    [appointments],
  );

  // ── Refresh ───────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await getAdminAppointments();
      setAppointments(fresh);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const statCards = [
    { key: "all", label: "Total", color: "var(--primary)" },
    { key: "pending", label: "Pending", color: "var(--warning)" },
    { key: "accepted", label: "Accepted", color: "var(--info)" },
    { key: "completed", label: "Completed", color: "var(--success)" },
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
          Manage Appointments
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          Monitor and track all patient appointments across the platform
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {statCards.map((s, i) => (
          <StatCard
            key={s.key}
            label={s.label}
            count={counts[s.key]}
            active={filter === s.key}
            color={s.color}
            onClick={() => setFilter(s.key)}
            index={i}
          />
        ))}
      </div>

      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
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
            placeholder="Search by patient, doctor, symptoms..."
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
        of {appointments.length} appointments
      </p>

      {/* ── Desktop Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="appt-table-wrap"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
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
                    "Patient",
                    "Doctor",
                    "Date & Time",
                    "Symptoms",
                    "Status",
                    "Payment",
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
                  {filtered.map((appt, i) => (
                    <AppointmentRow key={appt._id} appt={appt} index={i} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Mobile Cards ── */}
      <div
        className="appt-mobile-cards"
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
            <EmptyState search={search} filter={filter} />
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((appt, i) => (
              <AppointmentCard key={appt._id} appt={appt} index={i} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Responsive */}
      <style>{`
                @media (max-width: 768px) {
                    .appt-table-wrap { display: none !important; }
                    .appt-mobile-cards { display: flex !important; }
                }
            `}</style>
    </div>
  );
}
