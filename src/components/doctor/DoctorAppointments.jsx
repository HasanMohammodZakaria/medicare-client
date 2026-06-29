"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  MdSearch,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty,
  MdDone,
  MdAccessTime,
  MdCalendarToday,
  MdCalendarMonth,
  MdPerson,
  MdClose,
  MdAssignment,
} from "react-icons/md";
import {
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
} from "@/app/lib/api/doctor.api";

// ─── Helpers ───────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "var(--warning)",
    bg: "var(--warning-bg)",
    icon: MdHourglassEmpty,
  },
  accepted: {
    label: "Accepted",
    color: "var(--success)",
    bg: "var(--success-bg)",
    icon: MdCheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "var(--danger)",
    bg: "var(--danger-bg)",
    icon: MdCancel,
  },
  completed: {
    label: "Completed",
    color: "var(--info)",
    bg: "var(--info-bg)",
    icon: MdDone,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Confirm Modal ─────────────────────────────────────────
function ConfirmModal({ type, appointment, onClose, onConfirm, loading }) {
  const config = {
    accept: {
      title: "Accept Appointment?",
      message: "This will confirm the appointment for the patient.",
      confirmLabel: "Yes, Accept",
      confirmColor: "var(--success)",
      icon: MdCheckCircle,
      iconBg: "var(--success-bg)",
      iconColor: "var(--success)",
    },
    reject: {
      title: "Reject Appointment?",
      message:
        "This will cancel the appointment. The patient will be notified.",
      confirmLabel: "Yes, Reject",
      confirmColor: "var(--danger)",
      icon: MdCancel,
      iconBg: "var(--danger-bg)",
      iconColor: "var(--danger)",
    },
    complete: {
      title: "Mark as Completed?",
      message:
        "You will be redirected to write a prescription for this patient.",
      confirmLabel: "Mark & Write Prescription",
      confirmColor: "var(--primary)",
      icon: MdAssignment,
      iconBg: "var(--info-bg)",
      iconColor: "var(--info)",
    },
  };

  const cfg = config[type];
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm rounded-2xl p-6 z-10"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg"
          style={{
            color: "var(--text-muted)",
            backgroundColor: "var(--surface-secondary)",
          }}
        >
          <MdClose size={16} />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: cfg.iconBg, color: cfg.iconColor }}
        >
          <Icon size={24} />
        </div>

        <h3
          className="text-base font-bold text-center mb-2"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {cfg.title}
        </h3>
        <p
          className="text-sm text-center mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          {cfg.message}
        </p>

        {/* Patient info */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5"
          style={{ backgroundColor: "var(--surface-secondary)" }}
        >
          {appointment.patientImage ? (
            <Image
              src={appointment.patientImage}
              alt={appointment.patientName ?? "Patient"}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {appointment.patientName?.[0]?.toUpperCase() ?? "P"}
            </div>
          )}
          <div className="min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {appointment.patientName ?? "Patient"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {formatDate(appointment.appointmentDate)} ·{" "}
              {appointment.appointmentTime ?? "—"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "var(--surface-secondary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(appointment._id)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: cfg.confirmColor }}
          >
            {loading ? "Processing…" : cfg.confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
const FILTERS = ["all", "pending", "accepted", "completed", "rejected"];

export default function DoctorAppointments({ initialAppointments, doctorId }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // { type, appointment }
  const [actionLoading, setActionLoading] = useState(false);

  // ── Filter + Search ──────────────────────────────────
  const filtered = appointments.filter((a) => {
    const matchFilter = filter === "all" || a.appointmentStatus === filter;
    const matchSearch =
      !search ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.symptoms?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── Stats ────────────────────────────────────────────
  const stats = [
    { label: "Total", value: appointments.length, color: "var(--doctor-card)" },
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
      color: "var(--success)",
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.appointmentStatus === "completed")
        .length,
      color: "var(--info)",
    },
  ];

  // ── Handlers ─────────────────────────────────────────
  const handleAction = async (type, appointmentId) => {
    setActionLoading(true);
    try {
      if (type === "accept") {
        await acceptAppointment(doctorId, appointmentId);
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId
              ? { ...a, appointmentStatus: "accepted" }
              : a,
          ),
        );
        toast.success("Appointment accepted!");
      } else if (type === "reject") {
        await rejectAppointment(doctorId, appointmentId);
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId
              ? { ...a, appointmentStatus: "rejected" }
              : a,
          ),
        );
        toast.success("Appointment rejected.");
      } else if (type === "complete") {
        await completeAppointment(doctorId, appointmentId);
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId
              ? { ...a, appointmentStatus: "completed" }
              : a,
          ),
        );
        toast.success("Marked as completed! Redirecting to prescription…");
        setTimeout(() => {
          router.push(
            `/dashboard/doctor/prescriptions?appointmentId=${appointmentId}`,
          );
        }, 1500);
      }
      setModal(null);
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* ── Header ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1
            className="text-xl font-bold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Appointment Requests
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Accept, reject, or mark appointments as completed
          </p>
        </motion.div>

        {/* ── Stats ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: s.color, fontFamily: "var(--font-heading)" }}
              >
                {s.value}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Search + Filter ──────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div
            className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <MdSearch size={18} style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Search by patient name or symptoms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <div
            className="flex gap-1 p-1 rounded-xl overflow-x-auto"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all"
                style={{
                  backgroundColor:
                    filter === f ? "var(--primary)" : "transparent",
                  color: filter === f ? "#fff" : "var(--text-muted)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Appointment List ─────────────────── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <MdCalendarMonth
              width={40}
              height={40}
              style={{ color: "var(--text-muted)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No appointments found
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filtered.map((apt, i) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="rounded-2xl p-4 sm:p-5"
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Patient info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {apt.patientImage ? (
                        <Image
                          src={apt.patientImage}
                          alt={apt.patientName ?? "Patient"}
                          width={44}
                          height={44}
                          className="rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          {apt.patientName?.[0]?.toUpperCase() ?? "P"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {apt.patientName ?? "Patient"}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {apt.patientEmail ?? "—"}
                        </p>
                      </div>
                    </div>

                    {/* Date + Time + Symptoms */}
                    <div
                      className="flex flex-wrap gap-3 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span className="flex items-center gap-1">
                        <MdCalendarToday size={13} />
                        {formatDate(apt.appointmentDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdAccessTime size={13} />
                        {apt.appointmentTime ?? "—"}
                      </span>
                      {apt.symptoms && (
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "var(--surface-secondary)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {apt.symptoms}
                        </span>
                      )}
                    </div>

                    {/* Status + Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <StatusBadge status={apt.appointmentStatus} />

                      {/* Pending → Accept / Reject */}
                      {apt.appointmentStatus === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              setModal({ type: "accept", appointment: apt })
                            }
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--success) 10%, transparent)",
                              color: "var(--success)",
                              border:
                                "1px solid color-mix(in srgb, var(--success) 25%, transparent)",
                            }}
                          >
                            <MdCheckCircle size={13} /> Accept
                          </button>
                          <button
                            onClick={() =>
                              setModal({ type: "reject", appointment: apt })
                            }
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--danger) 10%, transparent)",
                              color: "var(--danger)",
                              border:
                                "1px solid color-mix(in srgb, var(--danger) 25%, transparent)",
                            }}
                          >
                            <MdCancel size={13} /> Reject
                          </button>
                        </>
                      )}

                      {/* Accepted → Mark Complete */}
                      {apt.appointmentStatus === "accepted" && (
                        <button
                          onClick={() =>
                            setModal({ type: "complete", appointment: apt })
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--primary) 10%, transparent)",
                            color: "var(--primary)",
                            border:
                              "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
                          }}
                        >
                          <MdDone size={13} /> Mark Complete
                        </button>
                      )}

                      {/* Completed → View Prescription */}
                      {apt.appointmentStatus === "completed" && (
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/doctor/prescriptions?appointmentId=${apt._id}`,
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--info) 10%, transparent)",
                            color: "var(--info)",
                            border:
                              "1px solid color-mix(in srgb, var(--info) 25%, transparent)",
                          }}
                        >
                          <MdAssignment size={13} /> Prescription
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Confirm Modal ────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <ConfirmModal
            type={modal.type}
            appointment={modal.appointment}
            onClose={() => setModal(null)}
            onConfirm={(id) => handleAction(modal.type, id)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
