"use client";

import {
  FaUserDoctor,
  FaClock,
  FaShieldAlt,
  FaCreditCard,
  FaNotesMedical,
  FaHeadset,
  FaShield,
} from "react-icons/fa6";

const features = [
  {
    id: 1,
    title: "Qualified Doctors",
    description:
      "Consult with experienced and verified healthcare professionals from multiple specialties.",
    icon: FaUserDoctor,
    color: "var(--doctor-card)",
  },
  {
    id: 2,
    title: "Easy Appointment Booking",
    description:
      "Book appointments online anytime without waiting in long hospital queues.",
    icon: FaClock,
    color: "var(--appointment-card)",
  },
  {
    id: 3,
    title: "Secure Medical Records",
    description:
      "Your personal health records are encrypted and stored with complete security.",
    icon: FaShield,
    color: "var(--success)",
  },
  {
    id: 4,
    title: "Safe Online Payments",
    description:
      "Pay consultation fees securely through our trusted payment gateway.",
    icon: FaCreditCard,
    color: "var(--payment-card)",
  },
  {
    id: 5,
    title: "Digital Prescriptions",
    description:
      "Receive prescriptions digitally after your consultation and access them anytime.",
    icon: FaNotesMedical,
    color: "var(--primary)",
  },
  {
    id: 6,
    title: "24/7 Patient Support",
    description:
      "Our dedicated support team is available around the clock to assist you.",
    icon: FaHeadset,
    color: "var(--secondary)",
  },
];

export default function WhyChooseUs() {
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
            💙 Why Choose Us
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold">
            Why Choose MediCare Connect
          </h2>

          <p className="mt-5 text-sub text-lg">
            Experience modern healthcare with trusted doctors, secure medical
            records, online appointments, and a patient-first approach.
          </p>
        </div>

        {/* Feature Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group bg-card border border-base rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-card-hover"
                style={{
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                  }}
                >
                  <Icon
                    className="text-3xl"
                    style={{
                      color: feature.color,
                    }}
                  />
                </div>

                <h3 className="text-2xl font-bold text-main mb-3">
                  {feature.title}
                </h3>

                <p className="text-sub leading-7">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
