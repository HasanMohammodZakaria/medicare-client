"use client";

import {
  FaUserDoctor,
  FaCalendarCheck,
  FaShieldHeart,
  FaFileMedical,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa6";

const features = [
  {
    id: 1,
    title: "Verified Doctors",
    description:
      "Consult experienced and verified healthcare professionals with confidence.",
    icon: FaUserDoctor,
    color: "var(--doctor-card)",
  },
  {
    id: 2,
    title: "Easy Appointment",
    description:
      "Book appointments online in just a few clicks without waiting in long queues.",
    icon: FaCalendarCheck,
    color: "var(--patient-card)",
  },
  {
    id: 3,
    title: "Secure Records",
    description:
      "Your personal information and medical records remain safe and protected.",
    icon: FaShieldHeart,
    color: "var(--success)",
  },
  {
    id: 4,
    title: "Digital Prescription",
    description:
      "Receive prescriptions digitally after every successful consultation.",
    icon: FaFileMedical,
    color: "var(--appointment-card)",
  },
  {
    id: 5,
    title: "Online Payment",
    description:
      "Pay consultation fees securely through our integrated payment system.",
    icon: FaCreditCard,
    color: "var(--payment-card)",
  },
  {
    id: 6,
    title: "24/7 Support",
    description:
      "Our support team is always ready to help whenever you need assistance.",
    icon: FaHeadset,
    color: "var(--review-card)",
  },
];

export default function WhyChooseAbout() {
  return (
    <section className="py-20 bg-base">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-semibold border border-base text-primary"
            style={{
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            }}
          >
            Why Choose Us
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-bold">
            Why Choose <span className="text-primary">MediCare Connect?</span>
          </h2>

          <p className="mt-5 text-sub text-lg leading-8">
            We combine trusted healthcare professionals, modern technology, and
            secure digital services to provide a seamless healthcare experience
            for every patient.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="bg-card border border-base rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-card-hover"
                style={{
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white mb-6"
                  style={{
                    backgroundColor: feature.color,
                  }}
                >
                  <Icon />
                </div>

                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>

                <p className="text-sub leading-7">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
