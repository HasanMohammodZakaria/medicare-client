import { getDoctorById } from "@/app/lib/actions/public.actions";
import {
  BackLink,
  BookNowButton,
} from "@/components/doctor/DoctorDetailsClient";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MdStar,
  MdWork,
  MdLocalHospital,
  MdAttachMoney,
  MdEmail,
  MdVerified,
  MdPhone,
} from "react-icons/md";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  return {
    title: doctor ? `${doctor.doctorName} | MediNexa` : "Doctor | MediNexa",
  };
}

export default async function DoctorDetailsPage({ params }) {
  const { id } = await params;
  const doctor = await getDoctorById(id);
  if (!doctor) notFound();

  const image = doctor.profileImage || doctor.userImage;

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}
      >
        {/* ── Back ── */}
        <BackLink />

        {/* ── Profile Hero ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: 20,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Banner */}
          <div
            style={{
              height: 130,
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--primary) 35%, transparent), color-mix(in srgb, var(--secondary) 25%, transparent))",
            }}
          />

          <div style={{ padding: "0 28px 28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
                marginTop: -44,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "4px solid var(--surface)",
                  background: "var(--surface-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={doctor.doctorName || "Doctor"}
                    width={88}
                    height={88}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "var(--primary)",
                    }}
                  >
                    {doctor.doctorName?.[0]?.toUpperCase() ?? "D"}
                  </span>
                )}
              </div>

              {/* Book Now — Client Component */}
              <BookNowButton doctorId={String(doctor._id)} />
            </div>

            {/* Name + badge */}
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 4,
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {doctor.doctorName}
                </h1>
                {doctor.verificationStatus === "verified" && (
                  <MdVerified size={22} style={{ color: "var(--primary)" }} />
                )}
              </div>
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--primary)",
                }}
              >
                {doctor.specialization}
              </p>

              {/* Stats row */}
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px" }}
              >
                {[
                  {
                    icon: <MdWork size={14} />,
                    text: doctor.experience
                      ? `${doctor.experience} years experience`
                      : null,
                  },
                  {
                    icon: <MdLocalHospital size={14} />,
                    text: doctor.hospitalName || null,
                  },
                  {
                    icon: <MdAttachMoney size={14} />,
                    text: doctor.consultationFee
                      ? `$${doctor.consultationFee} per visit`
                      : null,
                  },
                  { icon: <MdPhone size={14} />, text: doctor.phone || null },
                  {
                    icon: <MdEmail size={14} />,
                    text: doctor.userEmail || null,
                  },
                  {
                    icon: (
                      <MdStar size={14} style={{ color: "var(--warning)" }} />
                    ),
                    text: `${doctor.avgRating ?? 0} rating (${doctor.totalReviews ?? 0} reviews)`,
                  },
                ]
                  .filter((i) => i.text)
                  .map((item, i) => (
                    <span
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.icon} {item.text}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Info Cards Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {doctor.bio && (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "22px 24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                About
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                }}
              >
                {doctor.bio}
              </p>
            </div>
          )}

          {doctor.qualifications && (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "22px 24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Qualifications
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {doctor.qualifications
                  .split(/[\n,]/)
                  .filter(Boolean)
                  .map((q, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          "color-mix(in srgb, var(--warning) 12%, transparent)",
                        color: "var(--warning)",
                        border:
                          "1px solid color-mix(in srgb, var(--warning) 30%, transparent)",
                      }}
                    >
                      {q.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Reviews ── */}
        {doctor.reviews?.length > 0 && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "22px 24px",
            }}
          >
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Patient Reviews
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                }}
              >
                ({doctor.totalReviews})
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {doctor.reviews.slice(0, 5).map((review, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 16px",
                    background: "var(--surface-secondary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 8,
                    }}
                  >
                    {[...Array(5)].map((_, s) => (
                      <MdStar
                        key={s}
                        size={14}
                        style={{
                          color:
                            s < review.rating
                              ? "var(--warning)"
                              : "var(--border)",
                        }}
                      />
                    ))}
                    <span
                      style={{
                        marginLeft: 4,
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )
                        : ""}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {review.reviewText || "No comment provided."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
