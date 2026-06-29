"use client";

import Link from "next/link";
import { FaHeartbeat, FaBrain, FaBone, FaArrowRight } from "react-icons/fa";
import { MdArrowForward, MdChildCare } from "react-icons/md";
import { motion } from "framer-motion";

const specializations = [
  {
    id: 1,
    title: "Cardiology",
    description:
      "Expert diagnosis and treatment for heart diseases and cardiovascular conditions.",
    icon: FaHeartbeat,
    color: "text-red-400",
  },
  {
    id: 2,
    title: "Neurology",
    description:
      "Advanced care for brain, spinal cord and nervous system disorders.",
    icon: FaBrain,
    color: "text-violet-400",
  },
  {
    id: 3,
    title: "Orthopedics",
    description:
      "Professional treatment for bones, joints, muscles and sports injuries.",
    icon: FaBone,
    color: "text-sky-400",
  },
  {
    id: 4,
    title: "Pediatrics",
    description:
      "Compassionate healthcare services for infants, children and teenagers.",
    icon: MdChildCare,
    color: "text-emerald-400",
  },
];

export default function MedicalSpecializations() {
  return (
    <section className="py-20 bg-base">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-base px-5 py-2 text-sm font-semibold text-primary"
            style={{
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            }}
          >
            🩺 Medical Departments
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold">
            Medical Specializations
          </h2>

          <p className="mt-5 text-sub text-base md:text-lg leading-8">
            Connect with experienced healthcare professionals across different
            specialties and receive world-class medical care.
          </p>
        </div>

        {/* Cards — 2 column grid, each card is horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {specializations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group bg-card border border-base rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:bg-card-hover"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                {/* Icon — left side */}
                <div
                  className="w-16 h-16 rounded-2xl flex-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "color-mix(in srgb, var(--primary) 15%, transparent)",
                  }}
                >
                  <Icon className={`text-3xl ${item.color}`} />
                </div>

                {/* Content — right side */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full w-fit text-primary"
                    style={{
                      background:
                        "color-mix(in srgb, var(--primary) 10%, transparent)",
                    }}
                  >
                    Specialist
                  </span>

                  <h3 className="text-lg font-bold text-main">{item.title}</h3>

                  <p className="text-sub text-sm leading-6">
                    {item.description}
                  </p>

                  <button className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mt-1 transition-all duration-300 group-hover:gap-2.5 w-fit">
                    Learn More
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
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
