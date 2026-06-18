"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Person } from "@gravity-ui/icons";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <div
          className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "var(--secondary)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl text-center"
      >
        {/* Card */}
        <div
          className="p-8 md:p-10 border backdrop-blur-md"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.7, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div
              className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center border"
              style={{
                backgroundColor: "var(--surface-secondary)",
                borderColor: "var(--border)",
                borderRadius: "9999px",
              }}
            >
              <Person
                width={48}
                height={48}
                style={{ color: "var(--primary)" }}
              />
            </div>
          </motion.div>

          {/* 404 */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            404
          </motion.h1>

          {/* Title */}
          <h2 className="mt-5 text-2xl md:text-3xl font-bold text-main">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="mt-4 text-sub max-w-md mx-auto">
            The page you are looking for may have been removed, renamed, or is
            temporarily unavailable.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.04 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                }}
              >
                🏠 Back Home
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={() => window.history.back()}
              className="px-6 py-3 font-medium border"
              style={{
                backgroundColor: "var(--surface-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              ← Go Back
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
