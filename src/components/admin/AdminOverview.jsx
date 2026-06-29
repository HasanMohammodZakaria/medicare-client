"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MdPeople,
  MdMedicalServices,
  MdCalendarMonth,
  MdAttachMoney,
  MdVerified,
  MdStar,
  MdPersonOff,
  MdThumbUp,
} from "react-icons/md";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { delay } }}
      className="rounded-2xl p-5 flex items-center gap-4 border transition-shadow hover:shadow-md"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p
          className="text-2xl font-bold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {value ?? "—"}
        </p>
        <p
          className="text-xs font-medium mt-0.5"
          style={{ color: "var(--text-primary)", opacity: 0.5 }}
        >
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-0.5 font-medium" style={{ color }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label, color = "var(--primary)" }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 rounded-full" style={{ background: color }} />
      <h2
        className="text-sm font-bold uppercase tracking-widest"
        style={{ color: "var(--text-primary)", opacity: 0.65 }}
      >
        {label}
      </h2>
    </div>
  );
}

// ─── Chart Card Wrapper ───────────────────────────────────────────────────────

function ChartCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { delay } }}
      className="rounded-2xl border p-5"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-sm font-bold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      {children}
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-lg border text-sm space-y-1"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Doctor Performance Table ─────────────────────────────────────────────────

function DoctorTable({ data }) {
  if (!data?.length)
    return (
      <div
        className="py-10 text-center text-sm"
        style={{ color: "var(--text-primary)", opacity: 0.5 }}
      >
        No doctor data available
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {[
              "#",
              "Doctor",
              "Specialization",
              "Rating",
              "Reviews",
              "Appointments",
              "Status",
            ].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-primary)", opacity: 0.5 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 8).map((doc, i) => (
            <tr
              key={i}
              className="transition-colors hover:opacity-80"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <td
                className="py-3 px-3 font-bold"
                style={{ color: "var(--text-primary)", opacity: 0.4 }}
              >
                {i + 1}
              </td>
              <td
                className="py-3 px-3 font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {doc.name}
              </td>
              <td
                className="py-3 px-3"
                style={{ color: "var(--text-primary)", opacity: 0.6 }}
              >
                {doc.specialization}
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-1">
                  <MdStar className="text-amber-400 text-sm" />
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {doc.avgRating || "—"}
                  </span>
                </div>
              </td>
              <td
                className="py-3 px-3 font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {doc.totalReviews}
              </td>
              <td
                className="py-3 px-3 font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {doc.totalAppointments}
              </td>
              <td className="py-3 px-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                  style={
                    doc.verificationStatus === "verified"
                      ? { background: "#10b98118", color: "#10b981" }
                      : doc.verificationStatus === "rejected"
                        ? { background: "#ef444418", color: "#ef4444" }
                        : { background: "#f59e0b18", color: "#f59e0b" }
                  }
                >
                  {doc.verificationStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
const APPT_COLORS = {
  total: "var(--primary)",
  completed: "#10b981",
  cancelled: "#ef4444",
};

export default function AdminOverview({ overview = {}, analytics = {} }) {
  const [axisColor, setAxisColor] = useState("#888");
  const [primaryColor, setPrimaryColor] = useState("#6366f1");

  useEffect(() => {
    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      const textPrimary = style.getPropertyValue("--text-primary").trim();
      const primary = style.getPropertyValue("--primary").trim();
      if (textPrimary) setAxisColor(textPrimary);
      if (primary) setPrimaryColor(primary);
    };

    getColors();

    const observer = new MutationObserver(getColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ── Pie data — appointment status ─────────────────────────────────────────
  const apptPieData = useMemo(() => {
    const s = analytics?.appointmentStats || {};
    return [
      { name: "Pending", value: s.pending || 0 },
      { name: "Accepted", value: s.accepted || 0 },
      { name: "Completed", value: s.completed || 0 },
      { name: "Cancelled", value: s.cancelled || 0 },
      { name: "Rejected", value: s.rejected || 0 },
    ].filter((d) => d.value > 0);
  }, [analytics]);

  // Pie data — doctor verification
  const verifyPieData = useMemo(() => {
    const v = analytics?.verificationStats || {};
    return [
      { name: "Verified", value: v.verified || 0 },
      { name: "Pending", value: v.pending || 0 },
      { name: "Rejected", value: v.rejected || 0 },
    ].filter((d) => d.value > 0);
  }, [analytics]);

  const statCards = [
    {
      icon: MdPeople,
      label: "Total Patients",
      value: overview.totalPatients ?? 0,
      color: "var(--primary)",
      sub: `${overview.totalUsers ?? 0} total users`,
    },
    {
      icon: MdMedicalServices,
      label: "Total Doctors",
      value: overview.totalDoctors ?? 0,
      color: "#6366f1",
      sub: `${overview.verifiedDoctors ?? 0} verified`,
    },
    {
      icon: MdCalendarMonth,
      label: "Total Appointments",
      value: overview.totalAppointments ?? 0,
      color: "#f59e0b",
      sub: `${overview.pendingAppointments ?? 0} pending`,
    },
    {
      icon: MdAttachMoney,
      label: "Total Revenue",
      value: fmt(overview.totalRevenue ?? 0),
      color: "#10b981",
      sub: `${overview.totalPayments ?? 0} transactions`,
    },
    {
      icon: MdVerified,
      label: "Verified Doctors",
      value: overview.verifiedDoctors ?? 0,
      color: "#10b981",
      sub: `${overview.pendingDoctors ?? 0} awaiting`,
    },
    {
      icon: MdPersonOff,
      label: "Suspended Users",
      value: overview.suspendedUsers ?? 0,
      color: "#ef4444",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden relative"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 50%, #7c3aed) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <div
          className="absolute right-32 top-4 w-20 h-20 rounded-full opacity-10"
          style={{ background: "white" }}
        />

        <div className="px-8 py-7 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Admin Dashboard
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Platform overview —{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: MdPeople, val: `${overview.totalUsers ?? 0} Users` },
                {
                  icon: MdThumbUp,
                  val: `${analytics.totalReviews ?? 0} Reviews`,
                },
              ].map(({ icon: Icon, val }) => (
                <div
                  key={val}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: "var(--surface-hover)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Icon className="text-base" />
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div>
        <SectionHeader label="Platform Statistics" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={card.label} {...card} delay={i * 0.04} />
          ))}
        </div>
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <ChartCard title="Monthly Revenue (Last 6 Months)" delay={0.1}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.monthlyRevenue || []} barSize={28}>
              <XAxis
                dataKey="month"
                tick={{ fill: axisColor, fontSize: 12, opacity: 0.7 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: axisColor, fontSize: 11, opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                name="Revenue ($)"
                fill={primaryColor}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Appointments Line Chart */}
        <ChartCard title="Monthly Appointments (Last 6 Months)" delay={0.12}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={analytics.monthlyAppointments || []}>
              <XAxis
                dataKey="month"
                tick={{ fill: axisColor, fontSize: 12, opacity: 0.7 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 11, opacity: 0.6 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: axisColor, opacity: 0.75 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={primaryColor}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                name="Cancelled"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Appointment Status Pie */}
        <ChartCard title="Appointment Status Breakdown" delay={0.15}>
          {apptPieData.length === 0 ? (
            <div
              className="h-48 flex items-center justify-center text-sm"
              style={{ color: "var(--text-primary)", opacity: 0.5 }}
            >
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={apptPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {apptPieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: "var(--text-primary)",
                    opacity: 0.7,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Doctor Verification Pie */}
        <ChartCard title="Doctor Verification Status" delay={0.17}>
          {verifyPieData.length === 0 ? (
            <div
              className="h-48 flex items-center justify-center text-sm"
              style={{ color: "var(--text-primary)", opacity: 0.5 }}
            >
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={verifyPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {verifyPieData.map((_, i) => (
                    <Cell key={i} fill={["#10b981", "#f59e0b", "#ef4444"][i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Doctor Performance Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="rounded-2xl border p-5"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <SectionHeader
          label="Doctor Performance (Rating Based)"
          color="#6366f1"
        />
        <DoctorTable data={analytics.doctorPerformance} />
      </motion.div>
    </div>
  );
}
