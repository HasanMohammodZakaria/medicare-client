"use client";

import Link from "next/link";

import Envelope from "@gravity-ui/icons/Envelope";
import LocationArrow from "@gravity-ui/icons/LocationArrow";
import CircleInfo from "@gravity-ui/icons/CircleInfo";
import { Handset, LogoFacebook } from "@gravity-ui/icons";

import { FaInstagram } from "react-icons/fa";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.includes("dashboard")) {
    return null;
  }

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Appointments", href: "/appointments" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const socialLinks = [
    {
      href: "#",
      label: "Facebook",
      icon: LogoFacebook,
    },
    {
      href: "#",
      label: "LinkedIn",
      icon: FaLinkedin,
    },
    {
      href: "#",
      label: "Twitter",
      icon: FaXTwitter,
    },
    {
      href: "#",
      label: "Instagram",
      icon: FaInstagram,
    },
  ];

  return (
    <footer className="border-t border-base bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold leading-none">
                <span style={{ color: "var(--primary)" }}>Medi</span>
                <span className="text-main">Nexa</span>
              </h2>

              <p className="mt-1 text-sm text-muted">
                Health Management System
              </p>
            </Link>

            <p className="mt-5 max-w-sm text-sm text-sub">
              Smart healthcare platform for managing doctors, patients,
              appointments, prescriptions, medical records and healthcare
              services securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-main">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sub transition-colors duration-300 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-main">
              Contact Information
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Handset className="mt-1 h-4 w-4 text-primary" />
                <p className="text-sm text-main">+880 1700-000000</p>
              </div>

              <div className="flex items-start gap-3">
                <Envelope className="mt-1 h-4 w-4 text-primary" />
                <p className="text-sm text-main">support@medinexa.com</p>
              </div>

              <div className="flex items-start gap-3">
                <LocationArrow className="mt-1 h-4 w-4 text-primary" />
                <p className="text-sm text-main">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Emergency + Social */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-main">
              Emergency Hotline
            </h4>

            <div className="rounded-2xl border border-base bg-surface-secondary p-5 transition-all duration-300">
              <div className="flex items-center gap-2">
                <CircleInfo className="h-4 w-4 text-danger" />

                <span className="text-sm font-medium text-main">
                  24/7 Emergency Support
                </span>
              </div>

              <h3 className="mt-3 text-3xl font-bold text-danger">999</h3>

              <p className="mt-2 text-sm text-sub">
                For urgent medical assistance and emergency healthcare support.
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="
                      flex h-11 w-11 items-center justify-center
                      rounded-xl border border-base
                      bg-surface
                      text-sub
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-(--primary)
                      hover:text-primary
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-border" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Medinexa Health Management System. All
            rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
