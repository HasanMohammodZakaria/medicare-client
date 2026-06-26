"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MdStar,
  MdWork,
  MdLocalHospital,
  MdAttachMoney,
  MdArrowForward,
} from "react-icons/md";

function DoctorCard({ doctor, index }) {
  const SPEC_COLORS = {
    Cardiology: "var(--doctor-card)",
    Neurology: "var(--appointment-card)",
    Orthopedics: "var(--warning)",
    Pediatrics: "var(--patient-card)",
    Dermatology: "var(--review-card)",
    Gynecology: "var(--danger)",
    Oncology: "var(--info)",
    Psychiatry: "var(--secondary)",
    "General Physician": "var(--payment-card)",
  };
  const color = SPEC_COLORS[doctor.specialization] ?? "var(--primary)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      whileHover={{ y: -4 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition: "box-shadow 0.25s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-md)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Top accent */}
      <div style={{ height: 4, background: color }} />

      <div style={{ padding: "20px" }}>
        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${color}`,
              flexShrink: 0,
              background: "var(--surface-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {doctor.profileImage ? (
              <Image
                src={doctor.profileImage}
                alt={doctor.doctorName}
                width={64}
                height={64}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <span style={{ fontSize: 24, fontWeight: 700, color }}>
                {doctor.doctorName?.[0] ?? "D"}
              </span>
            )}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {doctor.doctorName}
            </h3>
            <span
              style={{
                display: "inline-block",
                marginTop: 4,
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                background: color + "22",
                color,
              }}
            >
              {doctor.specialization}
            </span>
          </div>
        </div>

        {/* Info chips */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {[
            {
              icon: <MdWork size={14} />,
              text: `${doctor.experience ?? 0} years experience`,
            },
            {
              icon: <MdLocalHospital size={14} />,
              text: doctor.hospitalName || "—",
            },
            {
              icon: <MdAttachMoney size={14} />,
              text: `$${doctor.consultationFee ?? 0} / consultation`,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ color: "var(--text-muted)" }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Book Now button */}
        <Link href={`/doctors/${doctor.userId}`}>
          <button
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              background: color,
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View Profile <MdArrowForward size={15} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedDoctors({ doctors = [] }) {
  return (
    <section style={{ padding: "64px 20px", background: "var(--background)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: 20,
              background: "var(--primary)22",
              color: "var(--primary)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Our Specialists
          </span>
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Featured Doctors
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "var(--text-muted)",
              maxWidth: 480,
              marginInline: "auto",
            }}
          >
            Meet our verified healthcare professionals, ready to provide expert
            care.
          </p>
        </motion.div>

        {/* Doctor Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {doctors.length > 0 ? (
            doctors.map((doc, i) => (
              <DoctorCard key={doc._id ?? i} doctor={doc} index={i} />
            ))
          ) : (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              No verified doctors available yet.
            </p>
          )}
        </div>

        {/* View All button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          <Link href="/doctors">
            <button
              style={{
                padding: "12px 32px",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--primary)",
                border: "2px solid var(--primary)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--primary)";
              }}
            >
              View All Doctors <MdArrowForward size={16} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
