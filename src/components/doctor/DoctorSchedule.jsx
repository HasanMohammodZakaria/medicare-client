"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  MdAdd,
  MdSave,
  MdAccessTime,
  MdCheck,
  MdCalendarMonth,
  MdCheckCircle,
  MdSchedule,
} from "react-icons/md";
import TrashBin from "@gravity-ui/icons/TrashBin";
import Clock from "@gravity-ui/icons/Clock";
import Calendar from "@gravity-ui/icons/Calendar";
import { updateDoctorSchedule } from "@/app/lib/api/doctor.api";

// ── Constants ──────────────────────────────────────────────
const ALL_DAYS = [
  { key: "Monday", short: "Mon", color: "var(--primary)" },
  { key: "Tuesday", short: "Tue", color: "var(--secondary)" },
  { key: "Wednesday", short: "Wed", color: "var(--appointment-card)" },
  { key: "Thursday", short: "Thu", color: "var(--doctor-card)" },
  { key: "Friday", short: "Fri", color: "var(--patient-card)" },
  { key: "Saturday", short: "Sat", color: "var(--review-card)" },
  { key: "Sunday", short: "Sun", color: "var(--danger)" },
];

const PRESET_SLOTS = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "07:00 PM",
];

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          color,
        }}
      >
        <Icon size={20} />
      </div>
      <div>
        <p
          className="text-xl font-bold"
          style={{ color, fontFamily: "var(--font-heading)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ── Day Toggle ─────────────────────────────────────────────
function DayToggle({ day, selected, onToggle }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={() => onToggle(day.key)}
      className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl flex-1 min-w-0 transition-all duration-200"
      style={{
        border: `2px solid ${selected ? day.color : "var(--border)"}`,
        backgroundColor: selected
          ? `color-mix(in srgb, ${day.color} 15%, transparent)`
          : "var(--surface-secondary)",
        color: selected ? day.color : "var(--text-muted)",
        cursor: "pointer",
      }}
    >
      <span className="text-xs font-bold">{day.short}</span>
      {selected ? (
        <MdCheck size={14} />
      ) : (
        <span style={{ width: 14, height: 14 }} />
      )}
    </motion.button>
  );
}

// ── Slot Chip ──────────────────────────────────────────────
function SlotChip({ slot, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
        border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
        color: "var(--primary)",
      }}
    >
      <MdAccessTime size={12} />
      {slot}
      <button
        onClick={() => onRemove(slot)}
        className="flex items-center opacity-60 hover:opacity-100 transition-opacity ml-1"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--primary)",
          padding: 0,
        }}
      >
        <TrashBin style={{ width: 12, height: 12 }} />
      </button>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function DoctorSchedulePage({ initialSchedule = {}, doctorId }) {
  const [selectedDays, setSelectedDays] = useState(
    initialSchedule.availableDays ?? [],
  );
  const [slots, setSlots] = useState(initialSchedule.availableSlots ?? []);
  const [customSlot, setCustomSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("days");

  // ── Day toggle ───────────────────────────────────────
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // ── Slot add ────────────────────────────────────────
  const addPresetSlot = (slot) => {
    if (slots.includes(slot)) {
      toast.info(`${slot} already added`);
      return;
    }
    setSlots((prev) => [...prev, slot].sort());
  };

  const addCustomSlot = () => {
    const trimmed = customSlot.trim();
    if (!trimmed) return;
    if (slots.includes(trimmed)) {
      toast.info("Slot already exists");
      return;
    }
    setSlots((prev) => [...prev, trimmed].sort());
    setCustomSlot("");
  };

  const removeSlot = (slot) =>
    setSlots((prev) => prev.filter((s) => s !== slot));

  // ── Save ────────────────────────────────────────────
  const handleSave = async () => {
    if (!doctorId) return toast.error("Session expired. Please refresh.");
    if (!selectedDays.length)
      return toast.error("Select at least one available day.");
    if (!slots.length) return toast.error("Add at least one time slot.");

    setLoading(true);
    try {
      await updateDoctorSchedule(doctorId, {
        availableDays: selectedDays,
        availableSlots: slots,
      });
      toast.success("Schedule saved successfully!");
    } catch {
      toast.error("Failed to save schedule. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    JSON.stringify([...selectedDays].sort()) !==
      JSON.stringify([...(initialSchedule.availableDays ?? [])].sort()) ||
    JSON.stringify(slots) !==
      JSON.stringify(initialSchedule.availableSlots ?? []);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1
            className="text-xl font-bold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Manage Schedule
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Set your available days and appointment time slots
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={loading || !hasChanges}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor:
              hasChanges && !loading
                ? "var(--primary)"
                : "var(--surface-secondary)",
            color: hasChanges && !loading ? "#fff" : "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          <MdSave size={17} />
          {loading ? "Saving…" : "Save Schedule"}
        </motion.button>
      </motion.div>

      {/* ── Stats ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={MdCalendarMonth}
          label="Days Selected"
          value={selectedDays.length}
          color="var(--primary)"
          delay={0.05}
        />
        <StatCard
          icon={MdAccessTime}
          label="Time Slots"
          value={slots.length}
          color="var(--secondary)"
          delay={0.1}
        />
        <StatCard
          icon={MdSchedule}
          label="Total Slots/Week"
          value={selectedDays.length * slots.length}
          color="var(--appointment-card)"
          delay={0.15}
        />
      </div>

      {/* ── Tab switcher (mobile) ─────────────────── */}
      <div
        className="flex gap-1 p-1 rounded-xl sm:hidden"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {[
          { key: "days", label: "Available Days" },
          { key: "slots", label: "Time Slots" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor:
                activeTab === tab.key ? "var(--primary)" : "transparent",
              color: activeTab === tab.key ? "#fff" : "var(--text-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Available Days */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-5 ${activeTab !== "days" ? "hidden sm:block" : ""}`}
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--primary) 12%, transparent)",
                color: "var(--primary)",
              }}
            >
              <Calendar style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Available Days
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {selectedDays.length} of 7 selected
              </p>
            </div>
          </div>

          {/* Day toggles */}
          <div className="flex gap-2 mb-4">
            {ALL_DAYS.map((day) => (
              <DayToggle
                key={day.key}
                day={day}
                selected={selectedDays.includes(day.key)}
                onToggle={toggleDay}
              />
            ))}
          </div>

          {/* Selected summary */}
          {selectedDays.length > 0 ? (
            <div
              className="rounded-xl p-3"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--primary) 8%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
              }}
            >
              <p
                className="text-xs font-medium flex items-center gap-1.5"
                style={{ color: "var(--primary)" }}
              >
                <MdCheckCircle size={14} />
                Available on: {selectedDays.join(", ")}
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center"
              style={{
                backgroundColor: "var(--surface-secondary)",
                border: "1px dashed var(--border)",
              }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                No days selected yet
              </p>
            </div>
          )}

          {/* Weekday/Weekend quick select */}
          <div className="flex gap-2 mt-3">
            {[
              {
                label: "Weekdays",
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              },
              { label: "Weekends", days: ["Saturday", "Sunday"] },
              { label: "All", days: ALL_DAYS.map((d) => d.key) },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setSelectedDays(preset.days)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedDays([])}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--danger) 10%, transparent)",
                color: "var(--danger)",
                border:
                  "1px solid color-mix(in srgb, var(--danger) 20%, transparent)",
              }}
            >
              Clear
            </button>
          </div>
        </motion.div>

        {/* Time Slots */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl p-5 ${activeTab !== "slots" ? "hidden sm:block" : ""}`}
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--secondary) 12%, transparent)",
                color: "var(--secondary)",
              }}
            >
              <Clock style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Time Slots
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {slots.length} slot{slots.length !== 1 ? "s" : ""} added
              </p>
            </div>
          </div>

          {/* Preset slots */}
          <p
            className="text-xs font-semibold mb-2 uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Quick Add
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {PRESET_SLOTS.map((slot) => {
              const added = slots.includes(slot);
              return (
                <button
                  key={slot}
                  onClick={() => addPresetSlot(slot)}
                  disabled={added}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    border: `1px solid ${added ? "var(--success)" : "var(--border)"}`,
                    backgroundColor: added
                      ? "color-mix(in srgb, var(--success) 12%, transparent)"
                      : "var(--surface-secondary)",
                    color: added ? "var(--success)" : "var(--text-secondary)",
                    cursor: added ? "default" : "pointer",
                  }}
                >
                  {added ? "✓ " : ""}
                  {slot}
                </button>
              );
            })}
          </div>

          {/* Custom slot */}
          <p
            className="text-xs font-semibold mb-2 uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Custom Slot
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. 08:30 AM"
              value={customSlot}
              onChange={(e) => setCustomSlot(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomSlot()}
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
              style={{
                backgroundColor: "var(--surface-secondary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              onClick={addCustomSlot}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--primary)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <MdAdd size={16} /> Add
            </button>
          </div>

          {/* Added slots */}
          {slots.length > 0 ? (
            <>
              <p
                className="text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Added Slots
              </p>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {slots.map((slot) => (
                    <SlotChip key={slot} slot={slot} onRemove={removeSlot} />
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div
              className="p-5 text-center rounded-xl"
              style={{
                backgroundColor: "var(--surface-secondary)",
                border: "1px dashed var(--border)",
              }}
            >
              <MdAccessTime
                size={28}
                style={{ color: "var(--text-muted)", marginBottom: 6 }}
              />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                No slots added yet
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Schedule Preview ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-sm font-bold"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Schedule Preview
          </h3>
          {selectedDays.length > 0 && slots.length > 0 && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--success) 12%, transparent)",
                color: "var(--success)",
              }}
            >
              {selectedDays.length * slots.length} total slots/week
            </span>
          )}
        </div>

        {selectedDays.length === 0 || slots.length === 0 ? (
          <div
            className="p-8 text-center rounded-xl"
            style={{
              backgroundColor: "var(--surface-secondary)",
              border: "1px dashed var(--border)",
            }}
          >
            <MdCalendarMonth
              size={36}
              style={{ color: "var(--text-muted)", marginBottom: 8 }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Select days and time slots to see your weekly schedule
            </p>
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            }}
          >
            {ALL_DAYS.filter((d) => selectedDays.includes(d.key)).map(
              (day, i) => (
                <motion.div
                  key={day.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: "var(--surface-secondary)",
                    border: `1px solid color-mix(in srgb, ${day.color} 25%, transparent)`,
                  }}
                >
                  <p
                    className="text-xs font-bold mb-2 pb-2"
                    style={{
                      color: day.color,
                      borderBottom: `1px solid color-mix(in srgb, ${day.color} 20%, transparent)`,
                    }}
                  >
                    {day.key}
                  </p>
                  <div className="flex flex-col gap-1">
                    {slots.map((slot) => (
                      <div
                        key={slot}
                        className="flex items-center gap-1 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <MdAccessTime
                          size={11}
                          style={{ color: "var(--text-muted)", flexShrink: 0 }}
                        />
                        {slot}
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-xs mt-2 font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {slots.length} slot{slots.length !== 1 ? "s" : ""}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
