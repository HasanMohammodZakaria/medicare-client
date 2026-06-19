"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  FaHeart,
  FaUserDoctor,
  FaShieldHalved,
  FaCalendarCheck,
} from "react-icons/fa6";

export default function Banner() {
  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
      {/* Background Glow */}
      <div
        className="absolute left-0 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "color-mix(in srgb, var(--primary) 15%, transparent)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "color-mix(in srgb, var(--secondary) 15%, transparent)",
        }}
      />

      {/* FIXED CONTAINER WIDTH */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* FIXED GAP */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--primary)",
              }}
            >
              <FaHeart size={14} />
              Trusted Healthcare Platform
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl xl:text-6xl">
              Your Health,
              <span className="block" style={{ color: "var(--primary)" }}>
                Our Priority
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Book appointments with trusted doctors, manage records, and get
              support anytime.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="rounded-xl px-6 py-3 font-semibold transition hover:scale-105"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                }}
              >
                Find Doctors
              </button>

              <button
                className="rounded-xl border px-6 py-3 font-semibold transition hover:scale-105"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-md lg:max-w-lg"
          >
            {/* IMAGE */}
            <div
              className="relative overflow-hidden rounded-[36px] border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                minHeight: "420px",
              }}
            >
              <Image
                src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
                alt="Doctor"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-3 top-10 hidden sm:block"
            >
              <div
                className="flex items-center gap-3 rounded-xl border px-4 py-3"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <FaShieldHalved size={18} style={{ color: "var(--success)" }} />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Secure Records
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    100% Protected
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-3 top-28 hidden sm:block"
            >
              <div
                className="flex items-center gap-3 rounded-xl border px-4 py-3"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <FaUserDoctor size={18} style={{ color: "var(--primary)" }} />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Expert Doctors
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Verified Specialists
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 3 */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-10 left-4 hidden sm:block"
            >
              <div
                className="flex items-center gap-3 rounded-xl border px-4 py-3"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <FaCalendarCheck
                  size={18}
                  style={{ color: "var(--secondary)" }}
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Easy Booking
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Instant Appointments
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
