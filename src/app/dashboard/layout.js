
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { useTheme } from "next-themes";

import {
    MdDashboard, MdCalendarToday, MdPayment, MdStar, MdPerson,
    MdPeople, MdVerifiedUser, MdBarChart, MdSchedule, MdAssignment,
    MdDescription, MdLogout, MdLightMode, MdDarkMode, MdNotifications,
    MdKeyboardArrowDown,
} from "react-icons/md";

// ─── Nav config ────────────────────────────────────────────────────────────
const NAV_ITEMS = {
    patient: [
        { label: "Overview", href: "/dashboard/patient", icon: MdDashboard },
        { label: "Appointments", href: "/dashboard/patient/appointments", icon: MdCalendarToday },
        { label: "Payment History", href: "/dashboard/patient/payment-history", icon: MdPayment },
        { label: "My Reviews", href: "/dashboard/patient/reviews", icon: MdStar },
        { label: "Profile", href: "/dashboard/patient/profile", icon: MdPerson },
    ],
    doctor: [
        { label: "Overview", href: "/dashboard/doctor", icon: MdDashboard },
        { label: "Schedule", href: "/dashboard/doctor/schedule", icon: MdSchedule },
        { label: "Appointments", href: "/dashboard/doctor/appointments", icon: MdAssignment },
        { label: "Prescriptions", href: "/dashboard/doctor/prescriptions", icon: MdDescription },
        { label: "Profile", href: "/dashboard/doctor/profile", icon: MdPerson },
    ],
    admin: [
        { label: "Overview", href: "/dashboard/admin", icon: MdDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: MdPeople },
        { label: "Doctors", href: "/dashboard/admin/doctors", icon: MdVerifiedUser },
        { label: "Appointments", href: "/dashboard/admin/appointments", icon: MdCalendarToday },
        { label: "Payments", href: "/dashboard/admin/payments", icon: MdPayment },
        { label: "Analytics", href: "/dashboard/admin/analytics", icon: MdBarChart },
    ],
};

const ROLE_COLOR = {
    patient: "var(--patient-card)",
    doctor: "var(--doctor-card)",
    admin: "var(--appointment-card)",
};

// ─── Sidebar ───────────────────────────────────────────────────────────────
function Sidebar({ role }) {
    const pathname = usePathname();
    const router = useRouter();
    const navItems = NAV_ITEMS[role] ?? [];

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
    };

    return (
        <aside
            className="
                /* mobile: full-width horizontal strip */
                w-full flex flex-row items-center gap-1 overflow-x-auto px-3 py-2
                /* lg: fixed-width vertical column */
                lg:w-55 lg:flex-col lg:items-stretch lg:gap-0 lg:px-0 lg:py-0
                lg:h-full lg:overflow-x-visible lg:overflow-y-auto
            "
            style={{
                backgroundColor: "var(--surface)",
                borderRight: "1px solid var(--border)",
                flexShrink: 0,
            }}
        >
            {/* Logo — desktop only */}
            <Link
                href="/"
                className="hidden lg:flex items-center px-5 py-4.5 shrink-0"
                style={{ borderBottom: "1px solid var(--border)" }}
            >
                <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    <span style={{ color: "var(--primary)" }}>Medi</span>
                    <span style={{ color: "var(--text-primary)" }}>Nexa</span>
                </span>
            </Link>


            {/* Role badge — desktop only */}
            <div className="hidden lg:block px-5 pt-4 pb-2">
                <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${ROLE_COLOR[role]} 15%, transparent)`,
                        color: ROLE_COLOR[role],
                    }}
                >
                    {role?.charAt(0).toUpperCase() + role?.slice(1)} Panel
                </span>
            </div>

            {/* Nav items */}
            <nav className="
                flex flex-row gap-1 lg:flex-col lg:gap-0
                lg:flex-1 lg:px-3 lg:py-2
            ">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active =
                        href === `/dashboard/${role}`
                            ? pathname === href
                            : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className="
                                /* mobile: icon+label compact pill */
                                flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0
                                /* desktop: full row */
                                lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm lg:rounded-xl lg:mb-0.5
                                transition-all duration-150
                            "
                            style={{
                                backgroundColor: active
                                    ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                                    : "transparent",
                                color: active ? "var(--primary)" : "var(--text-secondary)",
                                borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                            }}
                        >
                            <Icon size={16} />
                            <span className="lg:inline">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Sign out — desktop only */}
            <button
                onClick={handleSignOut}
                className="hidden lg:flex items-center gap-3 px-6 py-4 text-sm transition-colors w-full"
                style={{
                    color: "var(--danger)",
                    borderTop: "1px solid var(--border)",
                }}
            >
                <MdLogout size={18} />
                Sign Out
            </button>
        </aside>
    );
}

// ─── Top Navbar ────────────────────────────────────────────────────────────
function DashboardNavbar({ user, role }) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth/login");
    };

    return (
        <header
            className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
            style={{
                backgroundColor: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
            }}
        >
            {/* Left: Logo (mobile) */}
            <Link href="/" className="flex lg:hidden items-center">
                <span className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    <span style={{ color: "var(--primary)" }}>Medi</span>
                    <span style={{ color: "var(--text-primary)" }}>Nexa</span>
                </span>
            </Link>


            {/* Desktop: page greeting */}
            <p className="hidden lg:block text-sm" style={{ color: "var(--text-muted)" }}>
                Welcome back,{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {user?.name}
                </span>
            </p>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
                {/* Theme */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-xl transition-colors"
                    style={{ color: "var(--text-secondary)", backgroundColor: "var(--surface-secondary)" }}
                >
                    {!mounted ? (
                        <MdDarkMode size={18} />
                    ) : theme === "dark" ? (
                        <MdLightMode size={18} />
                    ) : (
                        <MdDarkMode size={18} />
                    )}
                </button>

                {/* Notification */}
                <button
                    className="p-2 rounded-xl relative transition-colors"
                    style={{ color: "var(--text-secondary)", backgroundColor: "var(--surface-secondary)" }}
                >
                    <MdNotifications size={18} />
                    <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--danger)" }}
                    />
                </button>

                {/* User dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-colors"
                        style={{ backgroundColor: "var(--surface-secondary)", color: "var(--text-primary)" }}
                    >
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt={user.name ?? "User"}
                                width={28}
                                height={28}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: "var(--primary)" }}
                            >
                                {user?.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                        )}
                        <span className="hidden sm:block text-sm font-medium max-w-27.5 truncate">
                            {user?.name ?? "User"}
                        </span>
                        <MdKeyboardArrowDown
                            size={16}
                            style={{
                                color: "var(--text-muted)",
                                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                                transition: "transform 0.2s",
                            }}
                        />
                    </button>

                    {dropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-20"
                                style={{
                                    backgroundColor: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    boxShadow: "var(--shadow-md)",
                                }}
                            >
                                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                                        {user?.name}
                                    </p>
                                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors"
                                    style={{ color: "var(--danger)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--danger-bg)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                >
                                    <MdLogout size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

// ─── Root Layout ───────────────────────────────────────────────────────────
export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            const { data: session } = await authClient.getSession();
            if (!session?.user) return router.replace("/auth/login");

            const r = session.user.role;
            if (!["patient", "doctor", "admin"].includes(r)) return router.replace("/auth/login");

            setUser(session.user);
            setRole(r);
            setLoading(false);
        };
        check();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full border-4 animate-spin"
                        style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
                    />
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
                </div>
            </div>
        );
    }

    return (
        /*
         * DESKTOP  : [Sidebar | (Navbar / Content)]   — side by side, full height
         * MOBILE   : [Navbar]                          — top
         *            [Sidebar nav strip]               — horizontal scroll row
         *            [Content]                         — scrollable below
         */
        <div
            className="h-screen flex flex-col lg:flex-row overflow-hidden"
            style={{ backgroundColor: "var(--background)" }}
        >
            {/* ── Navbar: always on top (mobile), right-column top (desktop) ── */}
            {/* On desktop the navbar lives INSIDE the right column — rendered below.
                On mobile we pull it to the very top with order utilities.        */}

            {/* Mobile navbar (order-first) */}
            <div className="lg:hidden order-first">
                <DashboardNavbar user={user} role={role} />
            </div>

            {/* Sidebar — mobile: horizontal strip (order-2), desktop: left column */}
            <div className="lg:hidden order-2 overflow-x-auto" style={{ borderBottom: "1px solid var(--border)" }}>
                <Sidebar role={role} />
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:flex-col" style={{ width: "220px", flexShrink: 0 }}>
                <Sidebar role={role} />
            </div>

            {/* Right column: desktop navbar + content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden order-3 lg:order-0">
                {/* Desktop navbar */}
                <div className="hidden lg:block">
                    <DashboardNavbar user={user} role={role} />
                </div>

                {/* Page content */}
                <main
                    className="flex-1 overflow-y-auto p-4 sm:p-6"
                    style={{ backgroundColor: "var(--background)" }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
