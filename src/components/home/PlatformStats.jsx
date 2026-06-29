import { getPlatformStats } from "@/app/lib/actions/public.actions";
import {
  MdPeople,
  MdLocalHospital,
  MdCalendarToday,
  MdStar,
} from "react-icons/md";

const STAT_CONFIG = [
  {
    key: "doctors",
    label: "Expert Doctors",
    icon: MdLocalHospital,
    color: "#6366f1",
    suffix: "+",
  },
  {
    key: "patients",
    label: "Happy Patients",
    icon: MdPeople,
    color: "#10b981",
    suffix: "+",
  },
  {
    key: "appointments",
    label: "Appointments",
    icon: MdCalendarToday,
    color: "#f59e0b",
    suffix: "+",
  },
  {
    key: "reviews",
    label: "Patient Reviews",
    icon: MdStar,
    color: "#ef4444",
    suffix: "+",
  },
];

export default async function PlatformStats() {
  const stats = await getPlatformStats();

  return (
    <section
      style={{
        background: "var(--color-base-200)",
        borderTop: "1px solid var(--color-base-300)",
        borderBottom: "1px solid var(--color-base-300)",
        padding: "60px 20px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              marginBottom: 8,
            }}
          >
            Platform Statistics
          </p>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-base-content)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Trusted by Thousands
          </h2>
          <p
            style={{
              marginTop: 12,
              fontSize: 15,
              color: "var(--color-base-content)",
              opacity: 0.55,
              maxWidth: 480,
              marginInline: "auto",
            }}
          >
            Real numbers from our growing healthcare community
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {STAT_CONFIG.map(({ key, label, icon: Icon, color, suffix }) => (
            <div
              key={key}
              style={{
                background: "var(--color-base-100)",
                border: "1px solid var(--color-base-300)",
                borderRadius: 20,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background glow */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: color,
                  opacity: 0.06,
                  pointerEvents: "none",
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon style={{ fontSize: 28, color }} />
              </div>

              {/* Number */}
              <p
                style={{
                  fontSize: "clamp(2rem, 5vw, 2.75rem)",
                  fontWeight: 800,
                  color: "var(--color-base-content)",
                  margin: 0,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {(stats[key] || 0).toLocaleString()}
                <span style={{ color, fontSize: "0.6em" }}>{suffix}</span>
              </p>

              {/* Label */}
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-base-content)",
                  opacity: 0.6,
                  margin: 0,
                }}
              >
                {label}
              </p>

              {/* Bottom accent line */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: color,
                  opacity: 0.5,
                  borderRadius: "0 0 20px 20px",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
