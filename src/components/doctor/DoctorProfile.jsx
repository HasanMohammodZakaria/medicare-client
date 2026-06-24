"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import { updateDoctorProfile } from "@/app/lib/api/doctor.api";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  MdEdit,
  MdSave,
  MdClose,
  MdVerified,
  MdWork,
  MdLocalHospital,
  MdAttachMoney,
  MdPerson,
  MdEmail,
  MdSchool,
  MdKeyboardArrowDown,
  MdCheck,
} from "react-icons/md";
import Stethoscope from "@gravity-ui/icons/Stethoscope";
import Person from "@gravity-ui/icons/Person";
import CircleDollar from "@gravity-ui/icons/CircleDollar";
import ImageUploader from "@/components/shared/ImageUploader";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
  "Oncology",
  "Psychiatry",
  "Radiology",
  "General Surgery",
  "Internal Medicine",
  "Ophthalmology",
  "ENT",
  "Urology",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "General Physician",
];

/* ── Custom Dropdown (browser-native select dark mode fix) ── */
function CustomSelect({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // outside click এ close
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative", zIndex: open ? 1000 : "auto" }}
    >
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "10px 36px 10px 14px",
          borderRadius: "10px",
          border: `1px solid ${open ? "var(--primary)" : "var(--border)"}`,
          background: "var(--bg-muted)",
          color: value ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: 14,
          textAlign: "left",
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          outline: "none",
          transition: "border-color 0.15s",
        }}
      >
        <span>{value || placeholder}</span>
        <MdKeyboardArrowDown
          size={18}
          style={{
            color: "var(--text-muted)",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              zIndex: 999,
              background: "var(--bg-muted)", // ✅ bg-card থেকে bg-muted — একটু lighter
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              maxHeight: 240,
              overflowY: "auto",
              margin: 0,
              padding: "6px",
              listStyle: "none",
              transformOrigin: "top",
            }}
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <li
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: selected
                      ? "var(--primary-subtle)"
                      : "transparent",
                    color: selected ? "var(--primary)" : "var(--text-primary)",
                    fontWeight: selected ? 600 : 400,
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      e.currentTarget.style.background = "var(--bg-card)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt}
                  {selected && (
                    <MdCheck size={15} style={{ color: "var(--primary)" }} />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({
  title,
  icon,
  color = "var(--primary)",
  children,
  delay = 0,
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
        overflow: "visible", // ✅ dropdown যেন clip না হয়
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-muted)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "10px",
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
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h3>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </motion.div>
  );
}

/* ── Field row ── */
function FieldRow({ label, value, editing, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--text-muted)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      {editing ? (
        children
      ) : (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: value ? "var(--text-primary)" : "var(--text-muted)",
            fontWeight: value ? 500 : 400,
            padding: "10px 14px",
            background: "var(--bg-muted)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
          }}
        >
          {value || "Not set"}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  background: "var(--bg-muted)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

/* ══════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════ */
export default function DoctorProfile({ initialProfile = {} }) {
  const { data: session } = authClient.useSession();
  const doctorId = session?.user?.id;
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";
  const userName = session?.user?.name ?? "";

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctorName: initialProfile.doctorName ?? userName,
    specialization: initialProfile.specialization ?? "",
    qualifications: initialProfile.qualifications ?? "",
    experience: initialProfile.experience ?? "",
    consultationFee: initialProfile.consultationFee ?? "",
    hospitalName: initialProfile.hospitalName ?? "",
    profileImage: initialProfile.profileImage ?? userImage,
    phone: initialProfile.phone ?? "",
    bio: initialProfile.bio ?? "",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async () => {
    if (!doctorId) return toast.error("Session expired");
    if (!form.doctorName.trim()) return toast.error("Name is required");
    if (!form.specialization) return toast.error("Specialization is required");
    setLoading(true);
    try {
      await updateDoctorProfile(doctorId, form);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      doctorName: initialProfile.doctorName ?? userName,
      specialization: initialProfile.specialization ?? "",
      qualifications: initialProfile.qualifications ?? "",
      experience: initialProfile.experience ?? "",
      consultationFee: initialProfile.consultationFee ?? "",
      hospitalName: initialProfile.hospitalName ?? "",
      profileImage: initialProfile.profileImage ?? userImage,
      phone: initialProfile.phone ?? "",
      bio: initialProfile.bio ?? "",
    });
    setEditing(false);
  };

  const isVerified = initialProfile.verificationStatus === "verified";

  return (
    <div style={{ padding: "24px 20px" }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            My Profile
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            Manage your professional information and credentials
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-muted)",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <MdClose size={16} /> Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <MdSave size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setEditing(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                background: "var(--primary)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <MdEdit size={16} /> Edit Profile
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ── Profile Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "28px",
          marginBottom: 16,
          display: "flex",
          alignItems: "flex-start",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${isVerified ? "var(--success)" : "var(--border)"}`,
              background: "var(--bg-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {form.profileImage || userImage ? (
              <Image
                src={form.profileImage || userImage}
                alt={form.doctorName || "Doctor"}
                width={96}
                height={96}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <MdPerson size={48} style={{ color: "var(--text-muted)" }} />
            )}
          </div>
          {isVerified && (
            <div
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                background: "var(--success)",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--bg-card)",
              }}
            >
              <MdVerified size={14} style={{ color: "#fff" }} />
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 6,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {form.doctorName || userName || "Your Name"}
            </h2>
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: isVerified
                  ? "var(--success-subtle)"
                  : "var(--warning-subtle)",
                color: isVerified ? "var(--success)" : "var(--warning)",
                border: `1px solid ${isVerified ? "var(--success)" : "var(--warning)"}`,
              }}
            >
              {isVerified ? "✓ Verified" : "⏳ Pending Verification"}
            </span>
          </div>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 14,
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            {form.specialization || "Specialization not set"}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
            {[
              {
                icon: <MdWork size={14} />,
                text: form.experience
                  ? `${form.experience} years exp.`
                  : "Experience not set",
              },
              {
                icon: <MdLocalHospital size={14} />,
                text: form.hospitalName || "Hospital not set",
              },
              {
                icon: <MdAttachMoney size={14} />,
                text: form.consultationFee
                  ? `$${form.consultationFee} fee`
                  : "Fee not set",
              },
              { icon: <MdEmail size={14} />, text: userEmail || "—" },
            ].map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Profile Image Uploader (edit mode only) ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: 16,
              overflow: "hidden",
            }}
          >
            <ImageUploader
              onUpload={(url) => set("profileImage", url)}
              shape="circle"
              defaultImage={form.profileImage}
              label="Profile Photo"
              size="lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {/* Basic Info */}
        <Section
          title="Basic Information"
          icon={<Person style={{ width: 18, height: 18 }} />}
          color="var(--primary)"
          delay={0.1}
        >
          <FieldRow label="Full Name" value={form.doctorName} editing={editing}>
            <input
              type="text"
              placeholder="Dr. John Smith"
              value={form.doctorName}
              onChange={(e) => set("doctorName", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </FieldRow>
          <FieldRow label="Phone" value={form.phone} editing={editing}>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </FieldRow>
          <FieldRow label="Bio" value={form.bio} editing={editing}>
            <textarea
              placeholder="Brief description about yourself..."
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </FieldRow>
        </Section>

        {/* Professional Details */}
        <Section
          title="Professional Details"
          icon={<Stethoscope style={{ width: 18, height: 18 }} />}
          color="var(--info)"
          delay={0.15}
        >
          <FieldRow
            label="Specialization"
            value={form.specialization}
            editing={editing}
          >
            {/* ✅ Custom dropdown — dark mode এ সঠিক color দেখাবে */}
            <CustomSelect
              value={form.specialization}
              onChange={(val) => set("specialization", val)}
              options={SPECIALIZATIONS}
              placeholder="Select specialization"
            />
          </FieldRow>

          <FieldRow
            label="Experience (years)"
            value={form.experience ? `${form.experience} years` : ""}
            editing={editing}
          >
            <input
              type="number"
              placeholder="e.g. 10"
              min={0}
              max={60}
              value={form.experience}
              onChange={(e) => set("experience", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </FieldRow>

          <FieldRow
            label="Hospital / Clinic"
            value={form.hospitalName}
            editing={editing}
          >
            <input
              type="text"
              placeholder="e.g. City General Hospital"
              value={form.hospitalName}
              onChange={(e) => set("hospitalName", e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </FieldRow>
        </Section>

        {/* Qualifications */}
        <Section
          title="Qualifications"
          icon={<MdSchool style={{ width: 18, height: 18 }} />}
          color="var(--warning)"
          delay={0.2}
        >
          <FieldRow
            label="Degrees & Certifications"
            value={form.qualifications}
            editing={editing}
          >
            <textarea
              placeholder={
                "e.g. MBBS, MD (Cardiology), FRCP\nOne per line or comma-separated"
              }
              value={form.qualifications}
              onChange={(e) => set("qualifications", e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </FieldRow>
          {!editing && form.qualifications && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: -8,
              }}
            >
              {form.qualifications
                .split(/[\n,]/)
                .filter(Boolean)
                .map((q, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: "var(--warning-subtle)",
                      color: "var(--warning)",
                      border: "1px solid var(--warning)",
                    }}
                  >
                    {q.trim()}
                  </span>
                ))}
            </div>
          )}
        </Section>

        {/* Consultation Fee */}
        <Section
          title="Consultation Fee"
          icon={<CircleDollar style={{ width: 18, height: 18 }} />}
          color="var(--success)"
          delay={0.25}
        >
          <FieldRow
            label="Fee (USD)"
            value={form.consultationFee ? `$${form.consultationFee}` : ""}
            editing={editing}
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              >
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                min={0}
                value={form.consultationFee}
                onChange={(e) => set("consultationFee", e.target.value)}
                style={{ ...inputStyle, paddingLeft: 28 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </FieldRow>
          {!editing && form.consultationFee && (
            <div
              style={{
                marginTop: -8,
                padding: "16px",
                background: "var(--success-subtle)",
                borderRadius: "12px",
                border: "1px solid var(--success)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--success)",
                }}
              >
                ${form.consultationFee}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "var(--success)",
                  opacity: 0.8,
                }}
              >
                per consultation
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* ── Verification Notice ── */}
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 16,
            padding: "14px 18px",
            background: "var(--warning-subtle)",
            border: "1px solid var(--warning)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>⏳</span>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                color: "var(--warning)",
              }}
            >
              Verification Pending
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "var(--warning)",
                opacity: 0.85,
              }}
            >
              Your profile is under review by the admin. You&apos;ll be notified
              once verified.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
