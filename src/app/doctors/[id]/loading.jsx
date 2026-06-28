import { SkeletonBox } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
      <SkeletonBox width={120} height={14} style={{ marginBottom: 24 }} />
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <SkeletonBox height={130} radius={0} />
        <div
          style={{
            padding: "0 28px 28px",
            marginTop: -44,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <SkeletonBox width={88} height={88} radius={999} />
            <SkeletonBox width={140} height={44} radius={10} />
          </div>
          <SkeletonBox width="40%" height={24} />
          <SkeletonBox width="30%" height={16} />
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} width={150} height={14} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
