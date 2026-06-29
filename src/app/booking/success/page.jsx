import { stripe } from "@/app/lib/stripe";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MdCheckCircle,
  MdCalendarToday,
  MdAccessTime,
  MdAttachMoney,
} from "react-icons/md";

export const metadata = { title: "Booking Confirmed | MediNexa" };

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items"],
  });

  if (session.status !== "complete") redirect("/");

  const { appointmentDate, appointmentsTime, consultationFee } =
    session.metadata;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "var(--background)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            margin: "0 auto 20px",
            background: "color-mix(in srgb, var(--success) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdCheckCircle size={40} style={{ color: "var(--success)" }} />
        </div>

        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 24,
            fontWeight: 800,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Payment Successful!
        </h1>
        <p
          style={{
            margin: "0 0 28px",
            fontSize: 14,
            color: "var(--text-muted)",
          }}
        >
          Your appointment has been booked. A confirmation will be sent to{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {session.customer_details?.email}
          </strong>
        </p>

        {/* Appointment Details */}
        <div
          style={{
            background: "var(--surface-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: 20,
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Appointment Details
          </h3>
          {[
            {
              icon: <MdCalendarToday size={14} />,
              label: "Date",
              value: appointmentDate,
            },
            {
              icon: <MdAccessTime size={14} />,
              label: "Time",
              value: appointmentsTime,
            },
            {
              icon: <MdAttachMoney size={14} />,
              label: "Amount Paid",
              value: `$${(session.amount_total / 100).toFixed(2)}`,
              color: "var(--success)",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingBottom: i < 2 ? 10 : 0,
                marginBottom: i < 2 ? 10 : 0,
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ color: "var(--primary)" }}>{item.icon}</span>
              <span
                style={{ fontSize: 13, color: "var(--text-muted)", flex: 1 }}
              >
                {item.label}
              </span>
              <strong
                style={{
                  fontSize: 13,
                  color: item.color || "var(--text-primary)",
                }}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link
            href="/dashboard/patient/appointments"
            style={{
              flex: 1,
              padding: "11px 0",
              textAlign: "center",
              background: "var(--primary)",
              color: "var(--background)",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            My Appointments
          </Link>
          <Link
            href="/doctors"
            style={{
              flex: 1,
              padding: "11px 0",
              textAlign: "center",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Find More Doctors
          </Link>
        </div>
      </div>
    </div>
  );
}
