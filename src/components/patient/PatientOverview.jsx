"use client";

// app/dashboard/patient/_components/PatientOverviewClient.jsx
// ✅ এটা Client Component — animation, interactivity এখানে

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaHeart,
  FaStar,
  FaArrowRight,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

// ─── Animation Variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: FaExclamationCircle,
  },
  accepted: {
    label: "Confirmed",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: FaCheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: FaTimesCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: FaCheckCircle,
  },
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, href }) {
  const card = (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Accent blob */}
      <div
        className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 ${accent}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value ?? "—"}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${accent} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${accent.replace("bg-", "text-")}`} />
        </div>
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          View details <FaArrowRight className="w-3 h-3" />
        </Link>
      )}
    </motion.div>
  );

  return card;
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating = 0 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PatientOverviewClient({
  overview,
  upcomingAppointments = [],
  favDoctors = [],
}) {
  const stats = [
    {
      icon: FaClock,
      label: "Upcoming Appointments",
      value: overview?.upcomingCount ?? upcomingAppointments.length,
      accent: "bg-blue-500",
      href: "/dashboard/patient/appointments",
    },
    {
      icon: FaCalendarAlt,
      label: "Total Appointments",
      value: overview?.totalAppointments ?? "—",
      accent: "bg-violet-500",
      href: "/dashboard/patient/appointments",
    },
    {
      icon: FaCreditCard,
      label: "Total Paid",
      value: overview?.totalPaid != null ? `৳${overview.totalPaid}` : "৳0",
      accent: "bg-emerald-500",
      href: "/dashboard/patient/payments",
    },
    {
      icon: FaHeart,
      label: "Favorite Doctors",
      value: overview?.favDoctorsCount ?? favDoctors.length,
      accent: "bg-rose-500",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Welcome back! Here's what's happening with your health.
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </motion.div>

      {/* ── Bottom Grid: Appointments + Favorite Doctors ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Appointments Table — 2/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Upcoming Appointments
              </h2>
            </div>
            <Link
              href="/dashboard/patient/appointments"
              className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
            >
              View all <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Table */}
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <FaStethoscope className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                No upcoming appointments
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                Book a doctor to get started
              </p>
              <Link
                href="/find-doctors"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3 hidden sm:table-cell">Date</th>
                    <th className="px-6 py-3 hidden md:table-cell">Time</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {upcomingAppointments.map((appt, idx) => (
                    <motion.tr
                      key={appt._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.07 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Doctor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {appt.doctorName?.charAt(0) || "D"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                              {appt.doctorName || "Doctor"}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {appt.specialization || "Specialist"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {appt.appointmentDate
                            ? new Date(appt.appointmentDate).toLocaleDateString(
                                "en-BD",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {appt.appointmentTime || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={appt.appointmentStatus} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Favorite Doctors — 1/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <FaHeart className="w-5 h-5 text-rose-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Favorite Doctors
            </h2>
          </div>

          {favDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mb-3">
                <FaHeart className="w-6 h-6 text-rose-300" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                No favorites yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Doctors you book most often appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {favDoctors.map((doc, idx) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.07 }}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-linear-to-br from-rose-400 to-orange-400">
                    {doc.profileImage ? (
                      <Image
                        src={doc.profileImage}
                        alt={doc.doctorName ?? "Doctor"}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {doc.doctorName?.charAt(0) || "D"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.doctorName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {doc.specialization}
                    </p>
                    <StarRating rating={doc.averageRating} />
                  </div>

                  {/* Appointment count badge */}
                  {doc.appointmentCount && (
                    <span className="text-xs bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-semibold px-2 py-0.5 rounded-full shrink-0">
                      {doc.appointmentCount}x
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
