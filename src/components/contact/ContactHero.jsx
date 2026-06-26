"use client";

import Link from "next/link";
import { FaChevronRight, FaPhoneVolume, FaLocationDot } from "react-icons/fa6";

export default function ContactHero() {
  return (
    <section className="bg-base py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link
            href="/"
            className="hover:text-primary transition-colors duration-300"
          >
            Home
          </Link>

          <FaChevronRight className="text-xs" />

          <span className="text-primary font-medium">Contact Us</span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            {/* Badge */}
            <span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-base text-primary text-sm font-semibold"
              style={{
                background:
                  "color-mix(in srgb, var(--primary) 12%, transparent)",
              }}
            >
              <FaPhoneVolume />
              Contact Our Team
            </span>

            {/* Heading */}
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              We are Here To
              <br />
              <span className="text-primary">Help You Anytime</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-sub text-lg leading-8 max-w-xl">
              Whether you need help booking an appointment, have questions about
              our healthcare services, or need assistance with your account, our
              team is ready to help.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/find-doctors"
                className="btn-primary px-7 py-3 rounded-xl font-semibold"
              >
                Find Doctors
              </Link>

              <Link
                href="tel:+8801711000000"
                className="btn-secondary px-7 py-3 rounded-xl font-semibold"
              >
                Emergency Call
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center">
            <div
              className="w-full max-w-md rounded-3xl border border-base bg-card p-8"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl text-white"
                style={{
                  backgroundColor: "var(--primary)",
                }}
              >
                <FaLocationDot />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-center">
                Visit Our Healthcare Center
              </h3>

              <p className="mt-4 text-center text-sub leading-7">
                House 25, Road 12,
                <br />
                Dhanmondi, Dhaka 1209
                <br />
                Bangladesh
              </p>

              <div
                className="mt-8 rounded-2xl p-5 text-center"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                }}
              >
                <p className="text-sm text-muted">Support Available</p>

                <h4 className="mt-2 text-xl font-bold text-primary">
                  Sat – Thu | 9:00 AM – 8:00 PM
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
