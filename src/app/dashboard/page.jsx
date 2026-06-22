// app/dashboard/page.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        router.replace("/auth/login");
        return;
      }

      router.replace(`/dashboard/${session.user.role}`);
    };

    redirect();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "4px solid var(--border)",
            borderTopColor: "var(--primary)",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Redirecting...
        </p>
      </div>
    </div>
  );
}
