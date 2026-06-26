"use client";

import {
  FaUserDoctor,
  FaUsers,
  FaCalendarCheck,
  FaStar,
} from "react-icons/fa6";

const statistics = [
  {
    id: 1,
    title: "Verified Doctors",
    value: "150+",
    icon: FaUserDoctor,
    color: "var(--doctor-card)",
  },
  {
    id: 2,
    title: "Happy Patients",
    value: "10K+",
    icon: FaUsers,
    color: "var(--patient-card)",
  },
  {
    id: 3,
    title: "Appointments",
    value: "25K+",
    icon: FaCalendarCheck,
    color: "var(--appointment-card)",
  },
  {
    id: 4,
    title: "Patient Reviews",
    value: "4.9★",
    icon: FaStar,
    color: "var(--review-card)",
  },
];

export default function AboutStatistics() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span
            className="inline-block px-5 py-2 rounded-full border border-base text-primary text-sm font-semibold"
            style={{
              background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            }}
          >
            Platform Statistics
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-bold">
            Trusted By Thousands of
            <span className="text-primary"> Patients</span>
          </h2>

          <p className="mt-5 text-sub text-lg leading-8">
            MediCare Connect continues to grow by helping patients connect with
            trusted doctors through a secure and modern healthcare platform.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="bg-card border border-base rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-card-hover"
                style={{
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  className="w-18 h-18 mx-auto rounded-2xl flex items-center justify-center text-4xl text-white mb-6"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  <Icon />
                </div>

                <h3 className="text-4xl font-bold text-primary mb-2">
                  {item.value}
                </h3>

                <p className="text-sub font-medium">{item.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
