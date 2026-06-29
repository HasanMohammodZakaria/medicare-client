// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { MdArrowForward } from "react-icons/md";
// import DoctorCard from "../doctor/DoctorCard";

// const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// // ── Skeleton Card ────────────────────────────────────────────────
// function DoctorCardSkeleton() {
//   return (
//     <div
//       style={{
//         background: "var(--surface)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius-md)",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           height: 80,
//           background:
//             "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
//           backgroundSize: "200% 100%",
//           animation: "skeleton-shimmer 1.5s infinite",
//         }}
//       />
//       <div style={{ padding: "0 20px", marginTop: -36, marginBottom: 12 }}>
//         <div
//           style={{
//             width: 72,
//             height: 72,
//             borderRadius: "50%",
//             border: "3px solid var(--surface)",
//             background:
//               "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
//             backgroundSize: "200% 100%",
//             animation: "skeleton-shimmer 1.5s infinite",
//           }}
//         />
//       </div>
//       <div
//         style={{
//           padding: "0 20px 20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//         }}
//       >
//         {[70, 50, 90, 75, 60].map((w, i) => (
//           <div
//             key={i}
//             style={{
//               height: i === 0 ? 16 : 12,
//               width: `${w}%`,
//               borderRadius: 8,
//               background:
//                 "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
//               backgroundSize: "200% 100%",
//               animation: "skeleton-shimmer 1.5s infinite",
//               animationDelay: `${i * 0.1}s`,
//             }}
//           />
//         ))}
//         <div
//           style={{
//             height: 38,
//             width: "100%",
//             marginTop: 4,
//             borderRadius: "var(--radius-sm)",
//             background:
//               "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
//             backgroundSize: "200% 100%",
//             animation: "skeleton-shimmer 1.5s infinite",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// // ── Main Component ───────────────────────────────────────────────
// export default function FeaturedDoctors() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/doctors/featured`, {
//           cache: "no-store",
//         });
//         if (!res.ok) return;
//         const data = await res.json();
//         setDoctors(data);
//       } catch (err) {
//         console.error("Failed to fetch featured doctors:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctors();
//   }, []);

//   return (
//     <section style={{ padding: "64px 20px", background: "var(--background)" }}>
//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>
//         {/* ── Section Header ── */}
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

//         {/* ── Cards Grid ── */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//             gap: 20,
//             marginBottom: 36,
//           }}
//         >
//           {loading ? (
//             [...Array(4)].map((_, i) => <DoctorCardSkeleton key={i} />)
//           ) : doctors.length > 0 ? (
//             // Real cards
//             doctors.map((doc, i) => (
//               <motion.div
//                 key={doc._id ?? i}
//                 initial={{ opacity: 0, y: 24 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1, duration: 0.45 }}
//               >
//                 <DoctorCard doctor={doc} />
//               </motion.div>
//             ))
//           ) : (
//             <p
//               style={{
//                 gridColumn: "1/-1",
//                 textAlign: "center",
//                 color: "var(--text-muted)",
//                 padding: "40px 0",
//               }}
//             >
//               No verified doctors available yet.
//             </p>
//           )}
//         </div>

//         {/* ── View All Button ── */}
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
//                 background: "var(--primary)", // ✅ CSS variable
//                 color: "var(--background)",
//                 border: "none",
//                 fontSize: 14,
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 8,
//                 transition: "all var(--transition-base)",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "var(--primary-hover)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "var(--primary)";
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdArrowForward } from "react-icons/md";
import DoctorCard from "../doctor/DoctorCard";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// ── Skeleton Card ────────────────────────────────────────────────
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
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "3px solid var(--surface)",
            background:
              "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.5s infinite",
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
        {[70, 50, 90, 75, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 16 : 12,
              width: `${w}%`,
              borderRadius: 8,
              background:
                "linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-hover) 50%, var(--surface-secondary) 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton-shimmer 1.5s infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <div
          style={{
            height: 38,
            width: "100%",
            marginTop: 4,
            borderRadius: "var(--radius-sm)",
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

// ── Main Component ───────────────────────────────────────────────
export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/doctors/featured`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch featured doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
                animate={{ opacity: 1, y: 0 }}
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
                background: "var(--primary)",
                color: "var(--background)",
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
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
