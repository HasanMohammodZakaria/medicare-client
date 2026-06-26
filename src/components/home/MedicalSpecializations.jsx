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
      <div className="max-w-7xl mx-auto px-5 lg:px-8 ">
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {specializations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group bg-card border border-base rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-card-hover"
                style={{
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {/* Small Badge */}
                <span
                  className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-5 text-primary"
                  style={{
                    background:
                      "color-mix(in srgb, var(--primary) 10%, transparent)",
                  }}
                >
                  Specialist
                </span>

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "color-mix(in srgb, var(--primary) 15%, transparent)",
                  }}
                >
                  <Icon className={`text-4xl ${item.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-main mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sub leading-7 mb-6">{item.description}</p>

                {/* Learn More */}
                <button className="inline-flex items-center gap-2 text-primary font-semibold transition-all duration-300 group-hover:gap-3">
                  Learn More
                  <FaArrowRight className="text-sm" />
                </button>
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
