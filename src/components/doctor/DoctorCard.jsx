"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MdStar,
  MdWork,
  MdLocalHospital,
  MdAttachMoney,
  MdVerified,
} from "react-icons/md";

export default function DoctorCard({ doctor }) {
  const image = doctor.profileImage || doctor.userImage;
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "color-mix(in srgb, var(--primary) 40%, transparent)" : "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition:
          "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "var(--shadow-md)" : "none",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient top band */}
      <div
        style={{
          height: 80,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 25%, transparent), color-mix(in srgb, var(--secondary) 20%, transparent))",
          flexShrink: 0,
        }}
      />

      {/* Avatar */}
      <div style={{ padding: "0 20px", marginTop: -36, marginBottom: 12 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid var(--surface)",
            background: "var(--surface-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={doctor.doctorName || "Doctor"}
              width={72}
              height={72}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <span
              style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)" }}
            >
              {doctor.doctorName?.[0]?.toUpperCase() ?? "D"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "0 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Name + verified */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {doctor.doctorName || "Unknown"}
          </h3>
          {doctor.verificationStatus === "verified" && (
            <MdVerified
              size={16}
              style={{ color: "var(--primary)", flexShrink: 0 }}
            />
          )}
        </div>

        {/* Specialization */}
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--primary)",
          }}
        >
          {doctor.specialization || "General Physician"}
        </p>

        {/* Info rows */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
            marginBottom: 16,
            flex: 1,
          }}
        >
          {[
            {
              icon: <MdWork size={13} />,
              text: doctor.experience
                ? `${doctor.experience} yrs experience`
                : "—",
            },
            {
              icon: <MdLocalHospital size={13} />,
              text: doctor.hospitalName || "—",
            },
            {
              icon: <MdAttachMoney size={13} />,
              text: doctor.consultationFee
                ? `$${doctor.consultationFee} / visit`
                : "—",
            },
          ].map((item, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                {item.icon}
              </span>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.text}
              </span>
            </span>
          ))}
        </div>

        {/* Bottom row: rating + button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <MdStar size={15} style={{ color: "var(--warning)" }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {doctor.avgRating ?? "—"}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              ({doctor.totalReviews ?? 0})
            </span>
          </div>

          <Link
            href={`/doctors/${doctor._id}`}
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "7px 16px",
              borderRadius: "999px",
              background: btnHovered
                ? "var(--primary-hover)"
                : "var(--primary)",
              color: "var(--background)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background 150ms ease",
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
