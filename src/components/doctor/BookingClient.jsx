"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  MdCalendarToday,
  MdAccessTime,
  MdAttachMoney,
  MdArrowBack,
} from "react-icons/md";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function BookingClient({ doctor }) {
  const { data: session } = authClient.useSession();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const image = doctor.profileImage || doctor.userImage;

  const handlePayment = async () => {
    if (!session?.user) {
      toast.error("Please login to book an appointment");
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    if (!date) return toast.error("Please select a date");
    if (!time) return toast.error("Please select a time slot");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor.userId,
          doctorName: doctor.doctorName,
          consultationFee: doctor.consultationFee,
          appointmentDate: date,
          appointmentsTime: time,
          patientId: session?.user?.id || "guest",
          patientEmail: session?.user?.email || undefined,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to create payment session");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>
      {/* Back */}
      <Link
        href={`/doctors/${doctor._id}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-muted)",
          textDecoration: "none",
          marginBottom: 24,
        }}
      >
        <MdArrowBack size={16} /> Back to Doctor
      </Link>

      <h1
        style={{
          margin: "0 0 24px",
          fontSize: 22,
          fontWeight: 800,
          color: "var(--text-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        Book Appointment
      </h1>

      {/* ── Doctor Info ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: 20,
          marginBottom: 20,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--surface-secondary)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--border)",
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={doctor.doctorName || "Doctor"}
              width={64}
              height={64}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
            <span
              style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}
            >
              {doctor.doctorName?.[0]?.toUpperCase() ?? "D"}
            </span>
          )}
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {doctor.doctorName}
          </h2>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 13,
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            {doctor.specialization}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <MdAttachMoney size={14} />
            <strong style={{ color: "var(--success)" }}>
              ${doctor.consultationFee}
            </strong>
            &nbsp;consultation fee
          </p>
        </div>
      </div>

      {/* ── Booking Form ── */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: 24,
        }}
      >
        <h3
          style={{
            margin: "0 0 20px",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Select Date & Time
        </h3>

        {/* Date */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-muted)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <MdCalendarToday size={13} /> Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              height: 42,
              padding: "0 12px",
              background: "var(--surface-secondary)",
              border: `1px solid ${date ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Time Slots */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-muted)",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <MdAccessTime size={13} /> Time Slot
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1px solid ${time === slot ? "var(--primary)" : "var(--border)"}`,
                  background:
                    time === slot
                      ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                      : "var(--surface-secondary)",
                  color: time === slot ? "var(--primary)" : "var(--text-muted)",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {date && time && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: 20,
              borderRadius: "var(--radius-sm)",
              background: "color-mix(in srgb, var(--primary) 8%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            📅 <strong>{date}</strong> &nbsp;at&nbsp; <strong>{time}</strong>
            &nbsp;—&nbsp; Fee:{" "}
            <strong style={{ color: "var(--success)" }}>
              ${doctor.consultationFee}
            </strong>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !date || !time}
          style={{
            width: "100%",
            height: 48,
            background:
              loading || !date || !time
                ? "var(--surface-hover)"
                : "var(--primary)",
            color:
              loading || !date || !time
                ? "var(--text-muted)"
                : "var(--background)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading || !date || !time ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          {loading
            ? "Redirecting to Stripe..."
            : `Pay $${doctor.consultationFee} & Confirm Booking`}
        </button>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          🔒 Secured by Stripe — your card info is never stored on our servers
        </p>
      </div>
    </div>
  );
}
