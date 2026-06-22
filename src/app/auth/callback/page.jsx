"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const { data: session } = await authClient.getSession();
      if (!session?.user) return router.replace("/auth/login");
      router.replace(`/dashboard/${session.user.role}`);
    };
    redirect();
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--background)" }}
    >
      <p style={{ color: "var(--text-muted)" }}>Redirecting...</p>
    </div>
  );
}
