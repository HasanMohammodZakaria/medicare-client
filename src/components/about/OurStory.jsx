"use client";

import Image from "next/image";
import { FaBullseye, FaEye } from "react-icons/fa6";

export default function OurStory() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-semibold text-primary border border-base"
            style={{
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            }}
          >
            Our Story
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-bold">
            Making Healthcare
            <span className="text-primary"> Simple & Accessible</span>
          </h2>

          <p className="mt-6 text-sub text-lg leading-8">
            MediCare Connect was built to simplify healthcare by connecting
            patients with verified doctors through one secure platform. Our goal
            is to reduce waiting time, improve communication, and make quality
            healthcare available anytime, anywhere.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="space-y-6">
            {/* Mission */}
            <div
              className="bg-card rounded-3xl p-8 border border-base"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white"
                  style={{
                    background: "var(--primary)",
                  }}
                >
                  <FaBullseye />
                </div>

                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>

              <p className="text-sub leading-8">
                To make healthcare easier and more accessible by providing
                secure online appointments, verified doctors, digital
                prescriptions, and a smooth healthcare experience for everyone.
              </p>
            </div>

            {/* Vision */}
            <div
              className="bg-card rounded-3xl p-8 border border-base"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white"
                  style={{
                    background: "var(--secondary)",
                  }}
                >
                  <FaEye />
                </div>

                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>

              <p className="text-sub leading-8">
                We envision a future where every patient can access trusted
                healthcare professionals quickly, safely, and conveniently
                through a modern digital healthcare platform.
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <div
              className="relative h-137.5 overflow-hidden rounded-3xl border border-base"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Image
                src="/images/about/our-story.png"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
