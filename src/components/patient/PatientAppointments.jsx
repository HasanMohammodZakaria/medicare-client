"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  MdCalendarToday,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdHourglassEmpty,
  MdEdit,
  MdClose,
  MdSearch,
} from "react-icons/md";
import { MdCalendarMonth, MdPerson } from "react-icons/md";
import {
  cancelAppointment,
  rescheduleAppointment,
} from "@/app/lib/api/patient.api";

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
  cancelled: {
    label: "Cancelled",
    color: "var(--danger)",
    bg: "var(--danger-bg)",
    icon: MdCancel,
  },
  completed: {
    label: "Completed",
    color: "var(--info)",
    bg: "var(--info-bg)",
    icon: MdCheckCircle,
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

// ─── Time Slots ────────────────────────────────────────────
const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

// ─── Reschedule Modal ──────────────────────────────────────
function RescheduleModal({ appointment, onClose, onConfirm, loading }) {
  const [date, setDate] = useState(
    appointment.appointmentDate?.slice(0, 10) ?? "",
  );
  const [time, setTime] = useState(appointment.appointmentTime ?? "");

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
        className="relative w-full max-w-md rounded-2xl p-6 z-10"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-bold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Reschedule Appointment
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              color: "var(--text-muted)",
              backgroundColor: "var(--surface-secondary)",
            }}
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Doctor info */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5"
          style={{ backgroundColor: "var(--surface-secondary)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary) 12%, transparent)",
              color: "var(--primary)",
            }}
          >
            <MdPerson size={16} />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {appointment.doctorName ?? "Doctor"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Current: {formatDate(appointment.appointmentDate)} ·{" "}
              {appointment.appointmentTime ?? "—"}
            </p>
          </div>
        </div>

        {/* New Date */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            New Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "var(--surface-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* New Time */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            New Time
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className="py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    time === slot
                      ? "var(--primary)"
                      : "var(--surface-secondary)",
                  color: time === slot ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${time === slot ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                {slot}
              </button>
            ))}
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
            onClick={() =>
              onConfirm(appointment._id, {
                appointmentDate: date,
                appointmentTime: time,
              })
            }
            disabled={!date || !time || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {loading ? "Saving…" : "Confirm"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Cancel Modal ──────────────────────────────────────────
function CancelModal({ appointment, onClose, onConfirm, loading }) {
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm rounded-2xl p-6 z-10"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            backgroundColor: "var(--danger-bg)",
            color: "var(--danger)",
          }}
        >
          <MdCancel size={24} />
        </div>
        <h3
          className="text-lg font-bold text-center mb-2"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Cancel Appointment?
        </h3>
        <p
          className="text-sm text-center mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Are you sure you want to cancel your appointment with{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {appointment.doctorName ?? "Doctor"}
          </span>
          ? This cannot be undone.
        </p>
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
            Keep it
          </button>
          <button
            onClick={() => onConfirm(appointment._id)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--danger)" }}
          >
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
const FILTERS = ["all", "pending", "accepted", "completed", "cancelled"];

export default function PatientAppointments({ initialAppointments }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Filter + Search ──────────────────────────────────
  const filtered = appointments.filter((a) => {
    const matchFilter = filter === "all" || a.appointmentStatus === filter;
    const matchSearch =
      !search ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      a.symptoms?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── Reschedule ────────────────────────────────────────
  const handleReschedule = async (id, data) => {
    setActionLoading(true);
    try {
      await rescheduleAppointment(id, data);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, ...data, appointmentStatus: "pending" } : a,
        ),
      );
      toast.success("Appointment rescheduled!");
      setRescheduleTarget(null);
    } catch {
      toast.error("Failed to reschedule. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Cancel ────────────────────────────────────────────
  const handleCancel = async (id) => {
    setActionLoading(true);
    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, appointmentStatus: "cancelled" } : a,
        ),
      );
      toast.success("Appointment cancelled.");
      setCancelTarget(null);
    } catch {
      toast.error("Failed to cancel. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const canAction = (status) => status === "pending" || status === "accepted";

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
            My Appointments
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Manage and track all your appointments
          </p>
        </motion.div>

        {/* ── Stats ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              label: "Total",
              value: appointments.length,
              color: "var(--doctor-card)",
            },
            {
              label: "Upcoming",
              value: appointments.filter(
                (a) =>
                  a.appointmentStatus === "pending" ||
                  a.appointmentStatus === "accepted",
              ).length,
              color: "var(--appointment-card)",
            },
            {
              label: "Completed",
              value: appointments.filter(
                (a) => a.appointmentStatus === "completed",
              ).length,
              color: "var(--success)",
            },
            {
              label: "Cancelled",
              value: appointments.filter(
                (a) => a.appointmentStatus === "cancelled",
              ).length,
              color: "var(--danger)",
            },
          ].map((s) => (
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
              placeholder="Search by doctor or symptoms…"
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

        {/* ── List ────────────────────────────── */}
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
                    {/* Doctor */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--primary) 12%, transparent)",
                          color: "var(--primary)",
                        }}
                      >
                        <MdPerson size={20} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {apt.doctorName ?? "Doctor"}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {apt.specialization ?? "General"}
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

                    {/* Status + Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={apt.appointmentStatus} />
                      {canAction(apt.appointmentStatus) && (
                        <>
                          <button
                            onClick={() => setRescheduleTarget(apt)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--primary) 10%, transparent)",
                              color: "var(--primary)",
                              border:
                                "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
                            }}
                          >
                            <MdEdit size={13} /> Reschedule
                          </button>
                          <button
                            onClick={() => setCancelTarget(apt)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--danger) 10%, transparent)",
                              color: "var(--danger)",
                              border:
                                "1px solid color-mix(in srgb, var(--danger) 20%, transparent)",
                            }}
                          >
                            <MdCancel size={13} /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Modals ────────────────────────────── */}
      <AnimatePresence>
        {rescheduleTarget && (
          <RescheduleModal
            appointment={rescheduleTarget}
            onClose={() => setRescheduleTarget(null)}
            onConfirm={handleReschedule}
            loading={actionLoading}
          />
        )}
        {cancelTarget && (
          <CancelModal
            appointment={cancelTarget}
            onClose={() => setCancelTarget(null)}
            onConfirm={handleCancel}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}
