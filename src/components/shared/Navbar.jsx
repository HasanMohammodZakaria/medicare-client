"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button, Avatar } from "@heroui/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import Bars from "@gravity-ui/icons/Bars";
import Xmark from "@gravity-ui/icons/Xmark";
import Sun from "@gravity-ui/icons/Sun";
import Moon from "@gravity-ui/icons/Moon";
import { authClient } from "@/app/lib/auth-client";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const profileRef = useRef(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  // ======================
  // USER (IMPORTANT FIX)
  // null = logged out
  // object = logged in
  // ======================
  //const user = null; // 🔥 এখন Login button দেখাবে

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Find Doctors", href: "/doctors" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (href) => pathname === href;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base bg-surface/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link href="/" className="text-2xl font-bold">
            <span style={{ color: "var(--primary)" }}>Medi</span>
            <span className="text-main">Nexa</span>
          </Link>

          {/* ================= NAV ================= */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-medium transition ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-sub hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden lg:flex items-center gap-3">
            {/* 🔥 SINGLE TOGGLE BUTTON */}
            <Button
              isIconOnly
              variant="light"
              className="bg-surface-secondary border border-base"
              onPress={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun width={18} height={18} />
              ) : (
                <Moon width={18} height={18} />
              )}
            </Button>

            {/* ================= AUTH ================= */}
            {isPending ? (
              <div className="flex items-center gap-3 border border-gray-200 px-4 py-2 rounded-xl animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="w-24 h-4 rounded bg-gray-200" />
              </div>
            ) : !user ? (
              // 🔴 LOGIN BUTTON (NOW FIXED)
              <Link href="/auth/login">
                <Button
                  className="font-semibold px-5"
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                  }}
                >
                  Login / Register
                </Button>
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar>
                    <Avatar.Image
                      referrerPolicy="no-referrer"
                      alt={user?.name}
                      src={user?.image}
                    />
                    <Avatar.Fallback>
                      {user?.name.charAt(0)?.toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                  <span className="text-sub font-medium">{user.name}</span>
                </button>

                {profileMenu && (
                  <div className="absolute right-0 mt-3 w-52 bg-surface border border-base rounded-xl shadow-xl overflow-hidden">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 hover:bg-card-hover text-sub"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-card-hover cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= MOBILE ================= */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              isIconOnly
              variant="light"
              className="bg-surface-secondary border border-base"
              onPress={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun width={18} height={18} />
              ) : (
                <Moon width={18} height={18} />
              )}
            </Button>

            <Button
              isIconOnly
              variant="light"
              className="bg-surface-secondary border border-base"
              onPress={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? (
                <Xmark width={18} height={18} />
              ) : (
                <Bars width={18} height={18} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="lg:hidden border-t border-base bg-surface">
          <div className="px-5 py-5 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className={`block py-3 font-medium transition ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-sub hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-5 border-t border-base">
              {isPending ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                  <div className="w-24 h-4 rounded bg-gray-200" />
                </div>
              ) : !user ? (
                <Link href="/auth/login">
                  <Button
                    className="w-full font-semibold"
                    style={{
                      background: "var(--primary)",
                      color: "#fff",
                    }}
                  >
                    Login / Register
                  </Button>
                </Link>
              ) : (
                <div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <Avatar.Image
                        referrerPolicy="no-referrer"
                        alt={user?.name}
                        src={user?.image}
                      />
                      <Avatar.Fallback>
                        {user?.name.charAt(0)?.toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar>

                    <span className="font-medium">{user?.name || "User"}</span>
                  </div>
                  <Link href="/dashboard" className="block py-3 text-sub">
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block py-3 text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
