"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import {
  createPrescription,
  updatePrescription,
} from "@/app/lib/api/doctor.api";
import { toast } from "react-toastify";
import {
  MdAdd,
  MdEdit,
  MdClose,
  MdMedicalServices,
  MdPerson,
  MdDateRange,
  MdNotes,
  MdLocalPharmacy,
  MdSearch,
  MdAssignment,
  MdCheckCircle,
  MdDelete,
} from "react-icons/md";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 border"
      style={{
        background: "var(--color-base-100)",
        borderColor: "var(--color-base-300)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
      <div>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--color-base-content)" }}
        >
          {value}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-base-content)", opacity: 0.5 }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Medication Row ───────────────────────────────────────────────────────────

function MedicationRow({ med, index, onChange, onRemove, readonly }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-2 p-3 rounded-xl border"
      style={{
        background: "var(--color-base-200)",
        borderColor: "var(--color-base-300)",
      }}
    >
      <div className="flex items-center gap-2 flex-0">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-0"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-primary-content)",
          }}
        >
          {index + 1}
        </span>
      </div>
      {readonly ? (
        <div className="flex flex-wrap gap-3 flex-1">
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--color-base-content)" }}
          >
            {med.name}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: "var(--color-base-300)",
              color: "var(--color-base-content)",
            }}
          >
            {med.dosage}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-content)",
              opacity: 0.85,
            }}
          >
            {med.duration}
          </span>
        </div>
      ) : (
        <>
          <input
            value={med.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            placeholder="Medicine name"
            className="flex-1 min-w-0 rounded-lg px-3 py-1.5 text-sm outline-none border"
            style={{
              background: "var(--color-base-100)",
              color: "var(--color-base-content)",
              borderColor: "var(--color-base-300)",
            }}
          />
          <input
            value={med.dosage}
            onChange={(e) => onChange(index, "dosage", e.target.value)}
            placeholder="Dosage (e.g. 500mg)"
            className="w-28 rounded-lg px-3 py-1.5 text-sm outline-none border"
            style={{
              background: "var(--color-base-100)",
              color: "var(--color-base-content)",
              borderColor: "var(--color-base-300)",
            }}
          />
          <input
            value={med.duration}
            onChange={(e) => onChange(index, "duration", e.target.value)}
            placeholder="Duration (e.g. 7 days)"
            className="w-32 rounded-lg px-3 py-1.5 text-sm outline-none border"
            style={{
              background: "var(--color-base-100)",
              color: "var(--color-base-content)",
              borderColor: "var(--color-base-300)",
            }}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-0 transition-all hover:opacity-80"
            style={{ background: "#fef2f2", color: "#ef4444" }}
          >
            <MdDelete className="text-sm" />
          </button>
        </>
      )}
    </div>
  );
}

// ─── Prescription Modal ───────────────────────────────────────────────────────

function PrescriptionModal({
  mode,
  prescription,
  completedAppointments,
  doctorId,
  onClose,
  onSubmit,
  loading,
}) {
  const isEdit = mode === "edit";

  const [selectedApptId, setSelectedApptId] = useState(
    isEdit ? (prescription?.appointmentId ?? "") : "",
  );
  const [diagnosis, setDiagnosis] = useState(
    isEdit ? (prescription?.diagnosis ?? "") : "",
  );
  const [notes, setNotes] = useState(isEdit ? (prescription?.notes ?? "") : "");
  const [medications, setMedications] = useState(
    isEdit
      ? (prescription?.medications ?? [])
      : [{ name: "", dosage: "", duration: "" }],
  );

  const selectedAppt = completedAppointments.find(
    (a) => a._id === selectedApptId,
  );

  const addMed = () =>
    setMedications((prev) => [...prev, { name: "", dosage: "", duration: "" }]);

  const changeMed = (i, field, val) =>
    setMedications((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)),
    );

  const removeMed = (i) =>
    setMedications((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (!isEdit && !selectedApptId) {
      toast.error("Please select a completed appointment");
      return;
    }
    if (!diagnosis.trim()) {
      toast.error("Please enter a diagnosis");
      return;
    }
    const validMeds = medications.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      toast.error("Please add at least one medication");
      return;
    }

    onSubmit({
      doctorId,
      patientId: selectedAppt?.patientId ?? prescription?.patientId,
      appointmentId: isEdit ? prescription?.appointmentId : selectedApptId,
      diagnosis: diagnosis.trim(),
      medications: validMeds,
      notes: notes.trim(),
    });
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all resize-none";
  const inputStyle = {
    background: "var(--color-base-200)",
    color: "var(--color-base-content)",
    borderColor: "var(--color-base-300)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border max-h-[90vh] flex flex-col"
        style={{
          background: "var(--color-base-100)",
          borderColor: "var(--color-base-300)",
        }}
      >
        {/* Accent */}
        <div
          className="h-1 w-full flex-0"
          style={{ background: "var(--color-primary)" }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-0"
          style={{ borderColor: "var(--color-base-300)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-primary)" }}
            >
              <MdMedicalServices className="text-white text-base" />
            </div>
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: "var(--color-base-content)" }}
              >
                {isEdit ? "Edit Prescription" : "Create Prescription"}
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--color-base-content)", opacity: 0.5 }}
              >
                {isEdit
                  ? "Update prescription details"
                  : "Fill in patient prescription"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
            style={{
              background: "var(--color-base-200)",
              color: "var(--color-base-content)",
            }}
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Appointment select (Create mode) */}
          {!isEdit && (
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-base-content)", opacity: 0.55 }}
              >
                Select Completed Appointment
              </label>
              {completedAppointments.length === 0 ? (
                <div
                  className="rounded-xl px-4 py-4 text-sm text-center border border-dashed"
                  style={{
                    borderColor: "var(--color-base-300)",
                    color: "var(--color-base-content)",
                    opacity: 0.6,
                  }}
                >
                  No completed appointments available
                </div>
              ) : (
                <select
                  value={selectedApptId}
                  onChange={(e) => setSelectedApptId(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border"
                  style={{
                    background: "var(--color-base-200)",
                    color: "var(--color-base-content)",
                    borderColor: selectedApptId
                      ? "var(--color-primary)"
                      : "var(--color-base-300)",
                  }}
                >
                  <option value="">— Select an appointment —</option>
                  {completedAppointments.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.patientName || a.patientId} •{" "}
                      {formatDate(a.appointmentDate)} • {a.appointmentTime}
                    </option>
                  ))}
                </select>
              )}

              {selectedAppt && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{
                    background: "var(--color-base-200)",
                    borderColor: "var(--color-primary)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-0"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <MdPerson className="text-white text-base" />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-base-content)" }}
                    >
                      {selectedAppt.patientName || "Patient"}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--color-base-content)",
                        opacity: 0.55,
                      }}
                    >
                      {selectedAppt.patientEmail} •{" "}
                      {formatDate(selectedAppt.appointmentDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit mode — show patient info */}
          {isEdit && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{
                background: "var(--color-base-200)",
                borderColor: "var(--color-base-300)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-0"
                style={{ background: "var(--color-primary)" }}
              >
                <MdPerson className="text-white text-base" />
              </div>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-base-content)" }}
                >
                  {prescription?.patientName || "Patient"}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-base-content)", opacity: 0.55 }}
                >
                  Editing existing prescription
                </p>
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-base-content)", opacity: 0.55 }}
            >
              Diagnosis
            </label>
            <textarea
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis details..."
              className={inputClass}
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-base-300)")
              }
            />
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-base-content)", opacity: 0.55 }}
              >
                Medications ({medications.length})
              </label>
              <button
                type="button"
                onClick={addMed}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-primary-content)",
                }}
              >
                <MdAdd className="text-sm" />
                Add Medicine
              </button>
            </div>
            <div className="space-y-2">
              {medications.map((med, i) => (
                <MedicationRow
                  key={i}
                  med={med}
                  index={i}
                  onChange={changeMed}
                  onRemove={removeMed}
                  readonly={false}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-base-content)", opacity: 0.55 }}
            >
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Follow-up instructions, dietary advice, etc."
              className={inputClass}
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-base-300)")
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-0"
          style={{ borderColor: "var(--color-base-300)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-75"
            style={{
              background: "var(--color-base-200)",
              color: "var(--color-base-content)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-content)",
            }}
          >
            <MdCheckCircle className="text-base" />
            {loading
              ? "Saving..."
              : isEdit
                ? "Update Prescription"
                : "Create Prescription"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Prescription Card ────────────────────────────────────────────────────────

function PrescriptionCard({ rx, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl border overflow-hidden group transition-shadow hover:shadow-md"
      style={{
        background: "var(--color-base-100)",
        borderColor: "var(--color-base-300)",
      }}
    >
      {/* Top accent */}
      <div
        className="h-1 w-full"
        style={{ background: "var(--color-primary)" }}
      />

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-0"
              style={{ background: "var(--color-primary)", opacity: 0.9 }}
            >
              <MdPerson className="text-white text-lg" />
            </div>
            <div className="min-w-0">
              <p
                className="font-bold text-sm truncate"
                style={{ color: "var(--color-base-content)" }}
              >
                {rx.patientName || "Patient"}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--color-base-content)", opacity: 0.5 }}
              >
                {rx.patientEmail || "—"}
              </p>
            </div>
          </div>
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-0"
            style={{ background: "#10b98118", color: "#10b981" }}
          >
            <MdCheckCircle className="text-sm" />
            Prescribed
          </span>
        </div>

        {/* Diagnosis */}
        <div
          className="px-4 py-3 rounded-xl"
          style={{ background: "var(--color-base-200)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: "var(--color-base-content)", opacity: 0.5 }}
          >
            Diagnosis
          </p>
          <p className="text-sm" style={{ color: "var(--color-base-content)" }}>
            {rx.diagnosis}
          </p>
        </div>

        {/* Medications preview */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--color-base-content)", opacity: 0.5 }}
          >
            Medications ({rx.medications?.length || 0})
          </p>
          <div className="space-y-1.5">
            {(expanded ? rx.medications : rx.medications?.slice(0, 2))?.map(
              (med, i) => (
                <MedicationRow key={i} med={med} index={i} readonly />
              ),
            )}
          </div>
          {rx.medications?.length > 2 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-xs font-medium transition-all hover:opacity-70"
              style={{ color: "var(--color-primary)" }}
            >
              {expanded ? "Show less" : `+${rx.medications.length - 2} more`}
            </button>
          )}
        </div>

        {/* Notes */}
        {rx.notes && (
          <div
            className="px-4 py-2 rounded-xl border-l-2"
            style={{
              background: "var(--color-base-200)",
              borderColor: "var(--color-primary)",
            }}
          >
            <p
              className="text-xs"
              style={{ color: "var(--color-base-content)", opacity: 0.7 }}
            >
              {rx.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--color-base-content)", opacity: 0.45 }}
          >
            <MdDateRange className="text-sm" />
            {formatDate(rx.createdAt)}
          </div>
          <button
            onClick={() => onEdit(rx)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 opacity-0 group-hover:opacity-100"
            style={{
              background: "var(--color-base-200)",
              color: "var(--color-base-content)",
            }}
          >
            <MdEdit className="text-sm" />
            Edit
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DoctorPrescriptions({
  initialPrescriptions,
  completedAppointments,
}) {
  const { data: session } = authClient.useSession();
  const doctorId = session?.user?.id;

  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [modal, setModal] = useState(null); // "create" | "edit"
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = prescriptions.length;
    const totalMeds = prescriptions.reduce(
      (s, r) => s + (r.medications?.length || 0),
      0,
    );
    const thisMonth = prescriptions.filter((r) => {
      const d = new Date(r.createdAt);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }).length;
    return { total, totalMeds, thisMonth };
  }, [prescriptions]);

  const filtered = useMemo(() => {
    if (!search.trim()) return prescriptions;
    const q = search.toLowerCase();
    return prescriptions.filter(
      (r) =>
        r.patientName?.toLowerCase().includes(q) ||
        r.diagnosis?.toLowerCase().includes(q) ||
        r.patientEmail?.toLowerCase().includes(q),
    );
  }, [prescriptions, search]);

  const openCreate = () => {
    setActive(null);
    setModal("create");
  };
  const openEdit = (rx) => {
    setActive(rx);
    setModal("edit");
  };
  const closeModal = () => {
    setModal(null);
    setActive(null);
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      const result = await createPrescription(data);
      const newRx = {
        _id: result.insertedId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setPrescriptions((prev) => [newRx, ...prev]);
      toast.success("Prescription created successfully!");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!active?._id) return;
    setLoading(true);
    try {
      await updatePrescription(active._id, data);
      setPrescriptions((prev) =>
        prev.map((r) => (r._id === active._id ? { ...r, ...data } : r)),
      );
      toast.success("Prescription updated!");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Failed to update prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-base-content)" }}
          >
            Prescription Management
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-base-content)", opacity: 0.55 }}
          >
            {prescriptions.length} prescription
            {prescriptions.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95 self-start sm:self-auto"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-primary-content)",
          }}
        >
          <MdAdd className="text-base" />
          New Prescription
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={MdAssignment}
          label="Total Prescriptions"
          value={stats.total}
          color="var(--color-primary)"
        />
        <StatCard
          icon={MdLocalPharmacy}
          label="Total Medications"
          value={stats.totalMeds}
          color="#10b981"
        />
        <StatCard
          icon={MdNotes}
          label="This Month"
          value={stats.thisMonth}
          color="#f59e0b"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <MdSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
          style={{ color: "var(--color-base-content)", opacity: 0.4 }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, diagnosis..."
          className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none border transition-all"
          style={{
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
            borderColor: "var(--color-base-300)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-base-300)")}
        />
      </div>

      {/* Grid / Empty */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-5"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed"
            style={{
              background: "var(--color-base-200)",
              borderColor: "var(--color-base-300)",
            }}
          >
            <MdMedicalServices
              className="text-5xl"
              style={{ color: "var(--color-primary)", opacity: 0.6 }}
            />
          </div>
          <div className="text-center">
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--color-base-content)" }}
            >
              {search ? "No results found" : "No Prescriptions Yet"}
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-base-content)", opacity: 0.55 }}
            >
              {search
                ? "Try a different search term"
                : "Create prescriptions for completed appointments"}
            </p>
          </div>
          {!search && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-primary-content)",
              }}
            >
              <MdAdd />
              Create First Prescription
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((rx) => (
              <PrescriptionCard key={rx._id} rx={rx} onEdit={openEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {(modal === "create" || modal === "edit") && (
          <PrescriptionModal
            key="prescription-modal"
            mode={modal}
            prescription={active}
            completedAppointments={completedAppointments}
            doctorId={doctorId}
            onClose={closeModal}
            onSubmit={modal === "create" ? handleCreate : handleUpdate}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
