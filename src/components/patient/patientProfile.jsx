"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdEdit,
  MdSave,
  MdClose,
  MdCameraAlt,
  MdVerified,
} from "react-icons/md";
import { updateProfile } from "@/app/lib/actions/patient.action";
import ImageUploader from "@/components/shared/ImageUploader";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 10%, transparent)",
          color: "var(--primary)",
        }}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p
          className="text-sm font-medium truncate mt-0.5"
          style={{ color: "var(--text-primary)" }}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function MyProfile({ initialProfile, userId }) {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialProfile.name ?? "",
    phone: initialProfile.phone ?? "",
    gender: initialProfile.gender ?? "",
    image: initialProfile.image ?? "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setProfile((prev) => ({ ...prev, ...formData }));
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      gender: profile.gender ?? "",
      image: profile.image ?? "",
    });
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="text-xl font-bold"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          My Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Manage your personal information
        </p>
      </motion.div>

      {/* ── Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div
          className="h-28 w-full"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--primary) 40%, transparent), color-mix(in srgb, var(--secondary) 30%, transparent))",
          }}
        />

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            {/* Avatar */}
            <div className="relative w-24 h-24 shrink-0">
              {profile.image ? (
                <Image
                  src={profile.image}
                  alt={profile.name ?? "User"}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-2xl object-cover"
                  style={{
                    border: "4px solid var(--surface)",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
                  style={{
                    backgroundColor: "var(--primary)",
                    border: "4px solid var(--surface)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  {profile.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </div>

            {/* Name + buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 gap-3 pb-1">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="text-xl font-bold"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {profile.name ?? "—"}
                  </h2>
                  {profile.emailVerified && (
                    <MdVerified size={18} style={{ color: "var(--primary)" }} />
                  )}
                </div>
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--patient-card) 15%, transparent)",
                    color: "var(--patient-card)",
                  }}
                >
                  Patient
                </span>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "var(--primary)", color: "#fff" }}
                >
                  <MdEdit size={16} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--surface-secondary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <MdClose size={15} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <MdSave size={15} /> {loading ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Info + Edit Form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Personal Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h3
            className="text-sm font-bold mb-2"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Personal Information
          </h3>
          <InfoRow icon={MdPerson} label="Full Name" value={profile.name} />
          <InfoRow icon={MdEmail} label="Email" value={profile.email} />
          <InfoRow icon={MdPhone} label="Phone" value={profile.phone} />
          <InfoRow icon={MdPerson} label="Gender" value={profile.gender} />

          {/* Profile image status */}
          <div className="flex items-center gap-3 pt-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--primary) 10%, transparent)",
                color: "var(--primary)",
              }}
            >
              <MdCameraAlt size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Profile Photo
              </p>
              <p
                className="text-sm font-medium truncate mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.image ? "Photo uploaded" : "No photo"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            opacity: editing ? 1 : 0.5,
          }}
        >
          <h3
            className="text-sm font-bold mb-4"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {editing ? "Edit Information" : "Click Edit Profile to update"}
          </h3>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your full name"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none disabled:opacity-50"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  border: `1px solid ${editing ? "var(--primary)" : "var(--border)"}`,
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="+1 234 567 8900"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none disabled:opacity-50"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  border: `1px solid ${editing ? "var(--primary)" : "var(--border)"}`,
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Gender */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none disabled:opacity-50"
                style={{
                  backgroundColor: "var(--surface-secondary)",
                  border: `1px solid ${editing ? "var(--primary)" : "var(--border)"}`,
                  color: "var(--text-primary)",
                }}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ pointerEvents: editing ? "auto" : "none" }}>
              <ImageUploader
                onUpload={(url) =>
                  setFormData((prev) => ({ ...prev, image: url }))
                }
                shape="circle"
                defaultImage={formData.image}
                label="Profile Photo"
                size="md"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Account Info ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <h3
          className="text-sm font-bold mb-3"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Account Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Account Status",
              value: profile.status ?? "Active",
              color: "var(--success)",
              bg: "var(--success-bg)",
            },
            {
              label: "Email Verified",
              value: profile.emailVerified ? "Verified" : "Not Verified",
              color: profile.emailVerified
                ? "var(--success)"
                : "var(--warning)",
              bg: profile.emailVerified
                ? "var(--success-bg)"
                : "var(--warning-bg)",
            },
            {
              label: "Member Since",
              value: profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "—",
              color: "var(--info)",
              bg: "var(--info-bg)",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 p-3 rounded-xl"
              style={{ backgroundColor: "var(--surface-secondary)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </p>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full self-start"
                style={{ color: item.color, backgroundColor: item.bg }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
