import {
  DoctorCardSkeleton,
  PageHeaderSkeleton,
} from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <PageHeaderSkeleton />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
        {/* Filter bar skeleton */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: 28,
            height: 74,
          }}
        />
        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(272px, 1fr))",
            gap: 20,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
