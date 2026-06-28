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
        {[...Array(6)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <SkeletonBox width={150} height={18} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                {[...Array(5)].map((_, j) => (
                  <td key={j} style={{ padding: "14px 16px" }}>
                    <SkeletonBox height={14} width={j === 0 ? "80%" : "60%"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
