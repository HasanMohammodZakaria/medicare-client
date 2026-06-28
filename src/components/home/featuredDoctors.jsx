// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   MdStar,
//   MdWork,
//   MdLocalHospital,
//   MdAttachMoney,
//   MdArrowForward,
// } from "react-icons/md";

// const CARD_COLORS = [
//   "var(--doctor-card)",
//   "var(--appointment-card)",
//   "var(--patient-card)",
//   "var(--review-card)",
// ];

// function DoctorCard({ doctor, index }) {
//   const image = doctor.profileImage || doctor.userImage;
//   const accentColor = CARD_COLORS[index % CARD_COLORS.length];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 24 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: index * 0.1, duration: 0.45 }}
//       whileHover={{ y: -4 }}
//       style={{
//         background: "var(--surface)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius-md)",
//         overflow: "hidden",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         transition:
//           "box-shadow var(--transition-base), border-color var(--transition-base)",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.boxShadow = "var(--shadow-md)";
//         e.currentTarget.style.borderColor = accentColor;
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.boxShadow = "none";
//         e.currentTarget.style.borderColor = "var(--border)";
//       }}
//     >
//       {/* ✅ Top accent — card এর unique color */}
//       <div style={{ height: 5, background: accentColor }} />

//       <div
//         style={{
//           padding: "20px",
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Avatar + name */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 14,
//             marginBottom: 16,
//           }}
//         >
//           <div
//             style={{
//               width: 64,
//               height: 64,
//               borderRadius: "50%",
//               overflow: "hidden",
//               border: `2px solid ${accentColor}`,
//               flexShrink: 0,
//               background: "var(--surface-secondary)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {image ? (
//               <Image
//                 src={image}
//                 alt={doctor.doctorName || "Doctor"}
//                 width={64}
//                 height={64}
//                 style={{ objectFit: "cover", width: "100%", height: "100%" }}
//               />
//             ) : (
//               <span
//                 style={{ fontSize: 24, fontWeight: 700, color: accentColor }}
//               >
//                 {doctor.doctorName?.[0] ?? "D"}
//               </span>
//             )}
//           </div>

//           <div style={{ flex: 1, minWidth: 0 }}>
//             <h3
//               style={{
//                 margin: 0,
//                 fontSize: 15,
//                 fontWeight: 700,
//                 color: "var(--text-primary)",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               {doctor.doctorName}
//             </h3>
//             {/* ✅ Badge — card accent color */}
//             <span
//               style={{
//                 display: "inline-block",
//                 marginTop: 4,
//                 padding: "3px 10px",
//                 borderRadius: 20,
//                 fontSize: 11,
//                 fontWeight: 600,
//                 background: accentColor + "22",
//                 color: accentColor,
//                 border: `1px solid ${accentColor}44`,
//               }}
//             >
//               {doctor.specialization}
//             </span>
//           </div>
//         </div>

//         {/* ✅ Info rows — icon color muted, text secondary */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 7,
//             marginBottom: 16,
//             flex: 1,
//           }}
//         >
//           {[
//             {
//               icon: <MdWork size={13} />,
//               text: `${doctor.experience ?? 0} years experience`,
//             },
//             {
//               icon: <MdLocalHospital size={13} />,
//               text: doctor.hospitalName || "—",
//             },
//             {
//               icon: <MdAttachMoney size={13} />,
//               text: `$${doctor.consultationFee ?? 0} / consultation`,
//             },
//           ].map((item, i) => (
//             <div
//               key={i}
//               style={{ display: "flex", alignItems: "center", gap: 8 }}
//             >
//               {/* ✅ icon color — text-muted, card color না */}
//               <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
//                 {item.icon}
//               </span>
//               <span
//                 style={{
//                   fontSize: 12,
//                   color: "var(--text-secondary)",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {item.text}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Rating */}
//         {(doctor.avgRating > 0 || doctor.totalReviews > 0) && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 4,
//               marginBottom: 14,
//             }}
//           >
//             <MdStar size={14} style={{ color: "var(--warning)" }} />
//             <span
//               style={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: "var(--text-primary)",
//               }}
//             >
//               {doctor.avgRating ?? 0}
//             </span>
//             <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
//               ({doctor.totalReviews ?? 0} reviews)
//             </span>
//           </div>
//         )}

//         {/* ✅ View Profile button — primary color, card color না */}
//         <Link
//           href={`/doctors/${doctor._id}`}
//           style={{ textDecoration: "none" }}
//         >
//           <button
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "var(--radius-sm)",
//               background: "var(--primary)", // ← primary, card color না
//               color: "var(--background)",
//               border: "none",
//               fontSize: 13,
//               fontWeight: 700,
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 6,
//               transition: "background var(--transition-fast)",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.background = "var(--primary-hover)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.background = "var(--primary)")
//             }
//           >
//             View Profile <MdArrowForward size={15} />
//           </button>
//         </Link>
//       </div>
//     </motion.div>
//   );
// }

// export default function FeaturedDoctors({ doctors = [] }) {
//   return (
//     <section style={{ padding: "64px 20px", background: "var(--background)" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           style={{ textAlign: "center", marginBottom: 40 }}
//         >
//           <span
//             style={{
//               display: "inline-block",
//               padding: "6px 18px",
//               borderRadius: 20,
//               background: "color-mix(in srgb, var(--primary) 12%, transparent)",
//               color: "var(--primary)",
//               fontSize: 12,
//               fontWeight: 700,
//               textTransform: "uppercase",
//               letterSpacing: "0.08em",
//               marginBottom: 12,
//               border:
//                 "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
//             }}
//           >
//             Our Specialists
//           </span>
//           <h2
//             style={{
//               margin: "0 0 12px",
//               fontSize: "clamp(24px, 4vw, 36px)",
//               fontWeight: 800,
//               color: "var(--text-primary)",
//               fontFamily: "var(--font-heading)",
//             }}
//           >
//             Featured Doctors
//           </h2>
//           <p
//             style={{
//               margin: 0,
//               fontSize: 15,
//               color: "var(--text-muted)",
//               maxWidth: 480,
//               marginInline: "auto",
//             }}
//           >
//             Meet our verified healthcare professionals, ready to provide expert
//             care.
//           </p>
//         </motion.div>

//         {/* Cards Grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: 20,
//             marginBottom: 36,
//           }}
//         >
//           {doctors.length > 0 ? (
//             doctors.map((doc, i) => (
//               <DoctorCard key={doc._id ?? i} doctor={doc} index={i} />
//             ))
//           ) : (
//             <p
//               style={{
//                 gridColumn: "1/-1",
//                 textAlign: "center",
//                 color: "var(--text-muted)",
//               }}
//             >
//               No verified doctors available yet.
//             </p>
//           )}
//         </div>

//         {/* ✅ View All — secondary style, card color না, primary color না */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           style={{ textAlign: "center" }}
//         >
//           <Link href="/doctors" style={{ textDecoration: "none" }}>
//             <button
//               style={{
//                 padding: "12px 32px",
//                 borderRadius: "var(--radius-sm)",
//                 background: "transparent",
//                 color: "var(--secondary)",
//                 border: "2px solid var(--secondary)",
//                 fontSize: 14,
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 8,
//                 transition: "all var(--transition-base)",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "var(--secondary)";
//                 e.currentTarget.style.color = "var(--background)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "transparent";
//                 e.currentTarget.style.color = "var(--secondary)";
//               }}
//             >
//               View All Doctors <MdArrowForward size={16} />
//             </button>
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// components/home/FeaturedDoctors.jsx
// কাজ: Homepage এ Featured Doctors দেখাবে
// Find Doctors page এর same DoctorCard use করছি

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MdArrowForward } from "react-icons/md";
import DoctorCard from "../doctor/DoctorCard";
// import DoctorCard from "@/components/doctors/DoctorCard";
function DoctorCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      {/* Top accent shimmer */}
      <div
        style={{
          height: 80,
          background:
            "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-shimmer 1.5s infinite",
        }}
      />

      <div style={{ padding: "0 20px", marginTop: -36, marginBottom: 12 }}>
        {/* Avatar skeleton */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background:
              "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.5s infinite",
            border: "3px solid var(--surface)",
          }}
        />
      </div>

      <div
        style={{
          padding: "0 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Name skeleton */}
        <div
          style={{
            height: 16,
            width: "70%",
            borderRadius: 8,
            background:
              "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.5s infinite",
          }}
        />
        {/* Specialization skeleton */}
        <div
          style={{
            height: 12,
            width: "50%",
            borderRadius: 8,
            background:
              "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.5s infinite",
          }}
        />
        {/* Info rows skeleton */}
        {[90, 75, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: 12,
              width: `${w}%`,
              borderRadius: 8,
              background:
                "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
              backgroundSize: "200% 100%",
              animation: `skeleton-shimmer 1.5s infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        {/* Button skeleton */}
        <div
          style={{
            height: 38,
            width: "100%",
            borderRadius: "var(--radius-sm)",
            marginTop: 4,
            background:
              "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.5s infinite",
          }}
        />
      </div>
    </div>
  );
}

export default function FeaturedDoctors({ doctors = [], loading = false }) {
  return (
    <section style={{ padding: "64px 20px", background: "var(--background)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* ── Section Header ── */}
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
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
              color: "var(--primary)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
              border:
                "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
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

        {/* ── Cards Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {loading ? (
            [...Array(4)].map((_, i) => <DoctorCardSkeleton key={i} />)
          ) : doctors.length > 0 ? (
            doctors.map((doc, i) => (
              <motion.div
                key={doc._id ?? i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <DoctorCard doctor={doc} />
              </motion.div>
            ))
          ) : (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "40px 0",
              }}
            >
              No verified doctors available yet.
            </p>
          )}
        </div>

        {/* ── View All Button ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          <Link href="/doctors" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 32px",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--secondary)",
                border: "2px solid var(--secondary)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--secondary)";
                e.currentTarget.style.color = "var(--background)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--secondary)";
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
