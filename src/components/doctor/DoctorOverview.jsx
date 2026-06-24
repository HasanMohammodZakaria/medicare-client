"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MdPeople,
  MdCalendarMonth,
  MdStar,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdPendingActions,
  MdTrendingUp,
} from "react-icons/md";
import Person from "@gravity-ui/icons/Person";
import Calendar from "@gravity-ui/icons/Calendar";
import Star from "@gravity-ui/icons/Star";
import ChartLine from "@gravity-ui/icons/ChartLine";
import Image from "next/image";

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px 22px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "14px",
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
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-muted)",
            marginBottom: 3,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {value ?? 0}
        </p>
        {sub && (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
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
  const config = {
    pending: {
      label: "Pending",
      color: "var(--warning)",
      bg: "var(--warning-subtle)",
      icon: <MdPendingActions size={12} />,
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
  const s = config[status] ?? config.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
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

// ── Mini Bar Chart (pure CSS) ──────────────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 52}px` }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
            style={{
              width: "100%",
              borderRadius: "4px 4px 0 0",
              background: d.color,
              minHeight: 4,
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Recent Appointment Row ─────────────────────────────────────────
function AppointmentRow({ appt, index }) {
  const date = appt.appointmentDate
    ? new Date(appt.appointmentDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "var(--primary-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {appt.patientImage ? (
          <Image
            src={appt.patientImage}
            alt={appt.patientName}
            width={38}
            height={38}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <MdPeople size={20} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {appt.patientName ?? "Patient"}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {date} {appt.appointmentTime ? `· ${appt.appointmentTime}` : ""}
        </p>
      </div>

      {/* Status */}
      <StatusBadge status={appt.appointmentStatus} />
    </motion.div>
  );
}

// ── Quick Action Card ──────────────────────────────────────────────
function QuickAction({ icon, label, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = color + "08";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--bg-card)";
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
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
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          {desc}
        </p>
      </div>
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function DoctorOverviewClient({
  overview = {},
  appointments = [],
  doctor = {},
}) {
  const [showAll, setShowAll] = useState(false);

  // Appointment breakdown for mini chart
  const chartData = [
    {
      label: "Pending",
      value: appointments.filter((a) => a.appointmentStatus === "pending")
        .length,
      color: "var(--warning)",
    },
    {
      label: "Accepted",
      value: appointments.filter((a) => a.appointmentStatus === "accepted")
        .length,
      color: "var(--info)",
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.appointmentStatus === "completed")
        .length,
      color: "var(--success)",
    },
    {
      label: "Rejected",
      value: appointments.filter((a) => a.appointmentStatus === "rejected")
        .length,
      color: "var(--danger)",
    },
  ];

  const recentAppointments = appointments.slice(0, showAll ? 10 : 5);

  // Today's appointments
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) =>
    a.appointmentDate?.startsWith(today),
  );

  const statCards = [
    {
      icon: <Person style={{ width: 22, height: 22 }} />,
      label: "Total Patients",
      value: overview.totalPatients ?? 0,
      sub: "Unique patients served",
      color: "var(--primary)",
    },
    {
      icon: <Calendar style={{ width: 22, height: 22 }} />,
      label: "Today's Appointments",
      value: overview.todaysAppointments ?? 0,
      sub:
        todayAppts.length > 0
          ? `Next: ${todayAppts[0]?.appointmentTime ?? "—"}`
          : "No appointments today",
      color: "var(--info)",
    },
    {
      icon: <Star style={{ width: 22, height: 22 }} />,
      label: "Reviews Received",
      value: overview.totalReviews ?? 0,
      sub: overview.avgRating
        ? `★ ${overview.avgRating} average rating`
        : "No reviews yet",
      color: "var(--warning)",
    },
    {
      icon: <ChartLine style={{ width: 22, height: 22 }} />,
      label: "Total Appointments",
      value: overview.totalAppointments ?? 0,
      sub: `${overview.pendingAppointments ?? 0} pending`,
      color: "var(--success)",
    },
  ];

  return (
    <div style={{ padding: "24px 20px" }}>
      {/* ── Welcome Header ── */}
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
          Welcome back,{" "}
          <span style={{ color: "var(--primary)" }}>
            {doctor.name ?? "Doctor"}
          </span>{" "}
          👋
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} index={i} />
        ))}
      </div>

      {/* ── Bottom Grid: Chart + Recent Appointments + Quick Actions ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {/* ── Appointment Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Appointment Breakdown
            </h3>
            <MdTrendingUp size={18} style={{ color: "var(--text-muted)" }} />
          </div>

          <MiniBarChart data={chartData} />

          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 16px",
              marginTop: 14,
            }}
          >
            {chartData.map((d, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    background: d.color,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {d.label}:{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {d.value}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Recent Appointments ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Recent Appointments
            </h3>
            <button
              onClick={() => setShowAll((p) => !p)}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showAll ? "Show less" : "View all"}
            </button>
          </div>

          {appointments.length === 0 ? (
            <div style={{ padding: "30px 0", textAlign: "center" }}>
              <MdCalendarMonth
                size={36}
                style={{ color: "var(--text-muted)", marginBottom: 8 }}
              />
              <p
                style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}
              >
                No appointments yet
              </p>
            </div>
          ) : (
            <div>
              {recentAppointments.map((appt, i) => (
                <AppointmentRow key={appt._id} appt={appt} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Quick Actions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <QuickAction
              icon={<MdCalendarMonth size={20} />}
              label="Manage Schedule"
              desc="Update your available days & slots"
              color="var(--primary)"
              onClick={() =>
                (window.location.href = "/dashboard/doctor/schedule")
              }
            />
            <QuickAction
              icon={<MdPendingActions size={20} />}
              label="Pending Requests"
              desc={`${overview.pendingAppointments ?? 0} appointments waiting`}
              color="var(--warning)"
              onClick={() =>
                (window.location.href = "/dashboard/doctor/appointments")
              }
            />
            <QuickAction
              icon={<MdStar size={20} />}
              label="View Reviews"
              desc={`${overview.totalReviews ?? 0} reviews received`}
              color="var(--success)"
              onClick={() =>
                (window.location.href = "/dashboard/doctor/profile")
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
