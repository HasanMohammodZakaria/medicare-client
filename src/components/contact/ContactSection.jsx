"use client";

import {
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa6";

export default function ContactSection() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* ================= Heading ================= */}

        <div className="max-w-3xl mb-14">
          <span
            className="inline-block px-5 py-2 rounded-full border border-base text-primary text-sm font-semibold"
            style={{
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            }}
          >
            Contact Information
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-bold leading-tight">
            Let's Start a Conversation
          </h2>

          <p className="mt-5 text-sub text-lg leading-8">
            Have questions about appointments, doctors, or healthcare services?
            Reach out to us and our support team will get back to you as soon as
            possible.
          </p>
        </div>

        {/* ================= Content ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 ">
          {/* ================= Left ================= */}

          <div className="space-y-5 lg:pt-12">
            {/* Address */}

            <div
              className="flex gap-5 rounded-2xl border border-base bg-card p-6"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
                style={{
                  background: "var(--primary)",
                }}
              >
                <FaLocationDot />
              </div>

              <div>
                <h3 className="text-xl font-bold">Our Address</h3>

                <p className="mt-2 text-sub">
                  House 25, Road 12
                  <br />
                  Dhanmondi, Dhaka 1209
                </p>
              </div>
            </div>

            {/* Phone */}

            <div
              className="flex gap-5 rounded-2xl border border-base bg-card p-6"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
                style={{
                  background: "var(--secondary)",
                }}
              >
                <FaPhone />
              </div>

              <div>
                <h3 className="text-xl font-bold">Phone Number</h3>

                <p className="mt-2 text-sub">+880 1711-000000</p>
              </div>
            </div>

            {/* Email */}

            <div
              className="flex gap-5 rounded-2xl border border-base bg-card p-6"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
                style={{
                  background: "var(--appointment-card)",
                }}
              >
                <FaEnvelope />
              </div>

              <div>
                <h3 className="text-xl font-bold">Email Address</h3>

                <p className="mt-2 text-sub">support@medicare.com</p>
              </div>
            </div>
            {/* Working Hours */}

            <div
              className="flex gap-5 rounded-2xl border border-base bg-card p-6"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
                style={{
                  background: "var(--review-card)",
                }}
              >
                <FaClock />
              </div>

              <div>
                <h3 className="text-xl font-bold">Working Hours</h3>

                <p className="mt-2 text-sub">
                  Saturday - Thursday
                  <br />
                  9:00 AM - 8:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* ================= Right ================= */}

          <div>
            <div
              className="bg-card border border-base rounded-3xl p-8 lg:p-10"
              style={{
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3 className="text-3xl font-bold">Send Us a Message</h3>

              <p className="mt-3 mb-8 text-sub">
                Fill out the form below and our support team will get back to
                you as soon as possible.
              </p>

              <form className="space-y-5">
                <input type="text" placeholder="Full Name" />

                <input type="email" placeholder="Email Address" />

                <input type="text" placeholder="Subject" />

                <textarea rows={6} placeholder="Write your message..." />

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                  style={{
                    background: "var(--primary)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--primary-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--primary)";
                  }}
                >
                  <FaPaperPlane />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
