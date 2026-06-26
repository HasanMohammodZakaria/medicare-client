"use client";

import Image from "next/image";
import Link from "next/link";
import { FaChevronRight, FaUserDoctor } from "react-icons/fa6";

export default function AboutHero() {
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

          <span className="text-primary font-medium">About Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Side */}
          <div>
            <span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-base text-primary text-sm font-semibold"
              style={{
                background:
                  "color-mix(in srgb, var(--primary) 12%, transparent)",
              }}
            >
              <FaUserDoctor />
              About MediCare Connect
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Trusted Partner
              <br />
              <span className="text-primary">In Modern Healthcare</span>
            </h1>

            <p className="mt-6 text-sub text-lg leading-8 max-w-xl">
              MediCare Connect is a trusted healthcare platform that connects
              patients with experienced doctors through online appointment
              booking, digital prescriptions, secure medical records and
              seamless healthcare management. Our goal is to make healthcare
              simple, accessible and reliable for everyone.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/find-doctors"
                className="btn-primary inline-flex items-center justify-center rounded-xl px-7 py-3 font-semibold hover:scale-105"
              >
                Find Doctors
              </Link>

              <Link
                href="/contact"
                className="btn-secondary inline-flex items-center justify-center rounded-xl px-7 py-3 font-semibold hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
          {/* Right Side */}
          <div className="relative">
            {/* Hero Image */}
            <div
              className="relative h-125 overflow-hidden rounded-3xl border border-base"
              style={{
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <Image
                src="/images/about/about-hero.webp"
                alt="Healthcare Team"
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>

            {/* Floating Card */}
            <div
              className="absolute bottom-6 left-6 rounded-2xl border border-base bg-card px-6 py-5 backdrop-blur-md"
              style={{
                boxShadow: "var(--shadow-md)",
              }}
            >
              <h3 className="text-3xl font-bold text-primary">10K+</h3>

              <p className="mt-1 text-sm text-sub">Happy Patients Served</p>
            </div>

            {/* Small Badge */}
            <div
              className="absolute top-6 right-6 rounded-xl border border-base bg-card px-4 py-3"
              style={{
                boxShadow: "var(--shadow-md)",
              }}
            >
              <p className="text-xs text-sub">Verified Doctors</p>

              <h4 className="text-xl font-bold text-primary">150+</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
