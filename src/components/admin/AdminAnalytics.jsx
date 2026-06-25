"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MdPeople,
  MdLocalHospital,
  MdCalendarMonth,
  MdAttachMoney,
  MdStar,
  MdTrendingUp,
} from "react-icons/md";

// ── Colors ────────────────────────────────────────────────────────
const COLORS = {
  primary: "#6366f1",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#a855f7",
};

const PIE_COLORS = [
  COLORS.success,
  COLORS.warning,
  COLORS.info,
  COLORS.danger,
  COLORS.purple,
];

// ── Custom Tooltip ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ margin: "2px 0", color: entry.color }}>
          {entry.name}:{" "}
          <strong>
            {typeof entry.value === "number" &&
            entry.name?.toLowerCase().includes("revenue")
              ? `$${entry.value.toLocaleString()}`
              : entry.value}
          </strong>
        </p>
      ))}
    </div>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px",
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
          background: color + "20",
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
            fontSize: 12,
            color: "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 24,
            fontWeight: 800,
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

// ── Chart Card ─────────────────────────────────────────────────────
function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  fullWidth = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// ── Doctor Performance Table ───────────────────────────────────────
function DoctorTable({ data = [] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {[
              "#",
              "Doctor",
              "Specialization",
              "Avg Rating",
              "Reviews",
              "Appointments",
              "Status",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
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
          {data.map((doc, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td
                style={{
                  padding: "12px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </td>
              <td style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--primary-subtle)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {doc.name?.[0]?.toUpperCase() ?? "D"}
                  </div>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    {doc.name}
                  </span>
                </div>
              </td>
              <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                {doc.specialization}
              </td>
              <td style={{ padding: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MdStar size={14} style={{ color: COLORS.warning }} />
                  <span
                    style={{ fontWeight: 700, color: "var(--text-primary)" }}
                  >
                    {doc.avgRating || "—"}
                  </span>
                </div>
              </td>
              <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                {doc.totalReviews}
              </td>
              <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                {doc.totalAppointments}
              </td>
              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    color:
                      doc.verificationStatus === "verified"
                        ? COLORS.success
                        : COLORS.warning,
                    background:
                      doc.verificationStatus === "verified"
                        ? COLORS.success + "20"
                        : COLORS.warning + "20",
                  }}
                >
                  {doc.verificationStatus === "verified"
                    ? "Verified"
                    : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function AdminAnalytics({ data = {} }) {
  const {
    totalPatients = 0,
    totalDoctors = 0,
    totalAppointments = 0,
    totalRevenue = 0,
    totalReviews = 0,
    appointmentStats = {},
    doctorPerformance = [],
    monthlyRevenue = [],
    monthlyAppointments = [],
    verificationStats = {},
  } = data;

  // ── Pie data ───────────────────────────────────────────────────
  const appointmentPieData = [
    { name: "Completed", value: appointmentStats.completed ?? 0 },
    { name: "Pending", value: appointmentStats.pending ?? 0 },
    { name: "Accepted", value: appointmentStats.accepted ?? 0 },
    { name: "Cancelled", value: appointmentStats.cancelled ?? 0 },
    { name: "Rejected", value: appointmentStats.rejected ?? 0 },
  ].filter((d) => d.value > 0);

  const verificationPieData = [
    { name: "Verified", value: verificationStats.verified ?? 0 },
    { name: "Pending", value: verificationStats.pending ?? 0 },
    { name: "Rejected", value: verificationStats.rejected ?? 0 },
  ].filter((d) => d.value > 0);

  const statCards = [
    {
      icon: <MdPeople size={22} />,
      label: "Total Patients",
      value: totalPatients,
      sub: "Registered patients",
      color: COLORS.primary,
    },
    {
      icon: <MdLocalHospital size={22} />,
      label: "Total Doctors",
      value: totalDoctors,
      sub: `${verificationStats.verified ?? 0} verified`,
      color: COLORS.success,
    },
    {
      icon: <MdCalendarMonth size={22} />,
      label: "Total Appointments",
      value: totalAppointments,
      sub: `${appointmentStats.completed ?? 0} completed`,
      color: COLORS.info,
    },
    {
      icon: <MdAttachMoney size={22} />,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      sub: "All time earnings",
      color: COLORS.warning,
    },
    {
      icon: <MdStar size={22} />,
      label: "Total Reviews",
      value: totalReviews,
      sub: "Patient feedback",
      color: COLORS.purple,
    },
    {
      icon: <MdTrendingUp size={22} />,
      label: "Pending Approvals",
      value: verificationStats.pending ?? 0,
      sub: "Doctors awaiting verification",
      color: COLORS.danger,
    },
  ];

  const axisStyle = { fill: "var(--text-muted)", fontSize: 11 };
  const gridStyle = { stroke: "var(--border)", strokeOpacity: 0.5 };

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
          Analytics
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          Platform performance overview and insights
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

      {/* ── Charts Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 16,
        }}
      >
        {/* Monthly Revenue — Area Chart */}
        <ChartCard
          title="Monthly Revenue"
          subtitle="Last 6 months earnings"
          delay={0.1}
          fullWidth={false}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={COLORS.primary}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={COLORS.primary}
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Appointments — Bar Chart */}
        <ChartCard
          title="Monthly Appointments"
          subtitle="Last 6 months breakdown"
          delay={0.15}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyAppointments}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
              />
              <Bar
                dataKey="total"
                name="Total"
                fill={COLORS.info}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="completed"
                name="Completed"
                fill={COLORS.success}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="cancelled"
                name="Cancelled"
                fill={COLORS.danger}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Appointment Status — Pie Chart */}
        <ChartCard
          title="Appointment Status"
          subtitle="Distribution by status"
          delay={0.2}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={appointmentPieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {appointmentPieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Doctor Verification — Pie Chart */}
        <ChartCard
          title="Doctor Verification"
          subtitle="Verification status breakdown"
          delay={0.25}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={verificationPieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {verificationPieData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.name === "Verified"
                        ? COLORS.success
                        : entry.name === "Pending"
                          ? COLORS.warning
                          : COLORS.danger
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Line Chart */}
        <ChartCard
          title="Revenue Trend"
          subtitle="Payment count vs revenue"
          delay={0.3}
          fullWidth
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis
                yAxisId="left"
                tick={axisStyle}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis yAxisId="right" orientation="right" tick={axisStyle} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke={COLORS.success}
                strokeWidth={2}
                dot={{ fill: COLORS.success, r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                name="Payments"
                stroke={COLORS.info}
                strokeWidth={2}
                dot={{ fill: COLORS.info, r: 4 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Doctor Performance Table */}
        <ChartCard
          title="Doctor Performance"
          subtitle="Top 10 doctors ranked by rating"
          delay={0.35}
          fullWidth
        >
          {doctorPerformance.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              No doctor data available yet.
            </div>
          ) : (
            <DoctorTable data={doctorPerformance} />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
