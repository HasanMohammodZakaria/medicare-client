"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteUser, suspendUser, activateUser } from "@/app/lib/api/admin.api";
import { toast } from "react-toastify";
import {
  MdPeople,
  MdPersonOff,
  MdVerified,
  MdSearch,
  MdDelete,
  MdBlock,
  MdCheckCircle,
  MdPerson,
  MdDateRange,
  MdAdminPanelSettings,
  MdMedicalServices,
} from "react-icons/md";
import Image from "next/image";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RoleBadge({ role }) {
  const map = {
    admin: { icon: MdAdminPanelSettings, color: "#6366f1", label: "Admin" },
    doctor: {
      icon: MdMedicalServices,
      color: "var(--primary)",
      label: "Doctor",
    },
    patient: { icon: MdPerson, color: "#10b981", label: "Patient" },
  };
  const cfg = map[role] || map.patient;
  const Icon = cfg.icon;
  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
      style={{ background: `${cfg.color}18`, color: cfg.color }}
    >
      <Icon className="text-sm" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const isSuspended = status === "suspended";
  return (
    <span
      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
      style={
        isSuspended
          ? { background: "#ef444418", color: "#ef4444" }
          : { background: "#10b98118", color: "#10b981" }
      }
    >
      {isSuspended ? (
        <MdBlock className="text-sm" />
      ) : (
        <MdCheckCircle className="text-sm" />
      )}
      {isSuspended ? "Suspended" : "Active"}
    </span>
  );
}

function Avatar({ name, image }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User"}
        width={40}
        height={40}
        className="rounded-xl object-cover flex-0 border"
        style={{ borderColor: "var(--border)" }}
      />
    );
  }
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-0"
      style={{ background: "var(--primary)", color: "#fff" }}
    >
      {initials}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
      <div>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({ type, user, onClose, onConfirm, loading }) {
  const config = {
    delete: {
      icon: MdDelete,
      color: "#ef4444",
      title: "Delete User?",
      desc: `"${user?.name}" will be permanently removed from the platform.`,
      btn: "Delete User",
    },
    suspend: {
      icon: MdBlock,
      color: "#f59e0b",
      title: "Suspend User?",
      desc: `"${user?.name}" will lose access to the platform until reactivated.`,
      btn: "Suspend",
    },
    activate: {
      icon: MdCheckCircle,
      color: "#10b981",
      title: "Activate User?",
      desc: `"${user?.name}" will regain full access to the platform.`,
      btn: "Activate",
    },
  };

  const cfg = config[type];
  const Icon = cfg.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="h-1 w-full" style={{ background: cfg.color }} />
        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${cfg.color}18` }}
            >
              <Icon className="text-3xl" style={{ color: cfg.color }} />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {cfg.title}
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {cfg.desc}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-75"
              style={{
                background: "var(--surface-secondary)",
                color: "var(--text-primary)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: cfg.color, color: "#fff" }}
            >
              {loading ? "Processing..." : cfg.btn}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── User Row (Table) ─────────────────────────────────────────────────────────

function UserRow({ user, onAction }) {
  return (
    <tr
      className="transition-colors group"
      style={{ borderBottom: `1px solid var(--border)` }}
    >
      {/* Avatar + Name */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={user.name} image={user.image} />
          <div className="min-w-0">
            <p
              className="font-semibold text-sm truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {user.name || "—"}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--text-muted)" }}
            >
              {user.email}
            </p>
          </div>
        </div>
      </td>
      {/* Role */}
      <td className="py-4 px-4">
        <RoleBadge role={user.role} />
      </td>
      {/* Status */}
      <td className="py-4 px-4">
        <StatusBadge status={user.status} />
      </td>
      {/* Joined */}
      <td
        className="py-4 px-4 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {formatDate(user.createdAt)}
      </td>
      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {user.status === "suspended" ? (
            <button
              onClick={() => onAction("activate", user)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "#10b98118", color: "#10b981" }}
            >
              <MdCheckCircle className="text-sm" />
              Activate
            </button>
          ) : (
            <button
              onClick={() => onAction("suspend", user)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "#f59e0b18", color: "#f59e0b" }}
            >
              <MdBlock className="text-sm" />
              Suspend
            </button>
          )}
          <button
            onClick={() => onAction("delete", user)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: "#ef444418", color: "#ef4444" }}
          >
            <MdDelete className="text-sm" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── User Card (Mobile) ───────────────────────────────────────────────────────

function UserCard({ user, onAction }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl border p-4 space-y-3"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={user.name} image={user.image} />
          <div className="min-w-0">
            <p
              className="font-bold text-sm truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {user.name || "—"}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--text-muted)" }}
            >
              {user.email}
            </p>
          </div>
        </div>
        <StatusBadge status={user.status} />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <RoleBadge role={user.role} />
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <MdDateRange className="text-sm" />
          {formatDate(user.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {user.status === "suspended" ? (
          <button
            onClick={() => onAction("activate", user)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: "#10b98118", color: "#10b981" }}
          >
            <MdCheckCircle className="text-sm" /> Activate
          </button>
        ) : (
          <button
            onClick={() => onAction("suspend", user)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: "#f59e0b18", color: "#f59e0b" }}
          >
            <MdBlock className="text-sm" /> Suspend
          </button>
        )}
        <button
          onClick={() => onAction("delete", user)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
          style={{ background: "#ef444418", color: "#ef4444" }}
        >
          <MdDelete className="text-sm" /> Delete
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ManageUsers({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Stats
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status !== "suspended").length,
      suspended: users.filter((u) => u.status === "suspended").length,
      doctors: users.filter((u) => u.role === "doctor").length,
    }),
    [users],
  );

  // Filtered list
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "suspended"
          ? u.status === "suspended"
          : u.status !== "suspended");
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openModal = (type, user) => setModal({ type, user });
  const closeModal = () => setModal(null);

  const handleConfirm = async () => {
    if (!modal) return;
    const { type, user } = modal;
    setLoading(true);
    try {
      if (type === "delete") {
        await deleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success("User deleted successfully");
      } else if (type === "suspend") {
        await suspendUser(user.id);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: "suspended" } : u,
          ),
        );
        toast.success("User suspended");
      } else if (type === "activate") {
        await activateUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: "active" } : u)),
        );
        toast.success("User activated");
      }
      closeModal();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Manage Users
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          {users.length} total users on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MdPeople}
          label="Total Users"
          value={stats.total}
          color="var(--primary)"
        />
        <StatCard
          icon={MdVerified}
          label="Active Users"
          value={stats.active}
          color="#10b981"
        />
        <StatCard
          icon={MdPersonOff}
          label="Suspended"
          value={stats.suspended}
          color="#ef4444"
        />
        <StatCard
          icon={MdMedicalServices}
          label="Doctors"
          value={stats.doctors}
          color="#6366f1"
        />
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MdSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none border transition-all"
            style={{
              background: "var(--surface)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-2xl px-4 py-3 text-sm outline-none border transition-all"
          style={{
            background: "var(--surface)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
            minWidth: "140px",
          }}
        >
          <option value="all">All Roles</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl px-4 py-3 text-sm outline-none border transition-all"
          style={{
            background: "var(--surface)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
            minWidth: "140px",
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Showing {filtered.length} of {users.length} users
      </p>

      {/* ── Desktop Table ── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--surface-secondary)" }}
          >
            <MdPeople
              className="text-4xl"
              style={{ color: "var(--primary)", opacity: 0.5 }}
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
              No Users Found
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Try adjusting your search or filters
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Desktop — Table */}
          <div
            className="hidden md:block rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            <div style={{ background: "var(--surface)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--border)` }}>
                    {["User", "Role", "Status", "Joined", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((user) => (
                      <UserRow
                        key={user.id || user._id}
                        user={user}
                        onAction={openModal}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile — Cards */}
          <div className="md:hidden space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((user) => (
                <UserCard
                  key={user.id || user._id}
                  user={user}
                  onAction={openModal}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Confirm Modal */}
      <AnimatePresence>
        {modal && (
          <ConfirmModal
            key="confirm-modal"
            type={modal.type}
            user={modal.user}
            onClose={closeModal}
            onConfirm={handleConfirm}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
