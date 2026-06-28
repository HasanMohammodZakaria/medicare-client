import { StatCardSkeleton, SkeletonBox } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <SkeletonBox width={200} height={28} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <SkeletonBox key={i} height={48} radius={10} />
        ))}
      </div>
    </div>
  );
}
