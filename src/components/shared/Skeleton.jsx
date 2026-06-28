export function SkeletonBox({
  width = "100%",
  height = 16,
  radius = 8,
  style = {},
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: "var(--surface-secondary)",
        backgroundImage:
          "linear-gradient(90deg, var(--surface-secondary) 0%, var(--surface-hover) 50%, var(--surface-secondary) 100%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.5s ease-in-out infinite",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ── Doctor Card Skeleton ─────────────────────────────
export function DoctorCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <SkeletonBox height={5} radius={0} />

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <SkeletonBox width={64} height={64} radius={999} />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <SkeletonBox width="70%" height={16} />
            <SkeletonBox width="50%" height={12} radius={20} />
          </div>
        </div>

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonBox width="80%" height={12} />
          <SkeletonBox width="90%" height={12} />
          <SkeletonBox width="60%" height={12} />
        </div>

        {/* Button */}
        <SkeletonBox height={38} radius={10} />
      </div>
    </div>
  );
}

// ── Stat Card Skeleton (dashboard overview) ──────────
export function StatCardSkeleton() {
  return (
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonBox width="60%" height={14} />
        <SkeletonBox width={36} height={36} radius={10} />
      </div>
      <SkeletonBox width="40%" height={32} />
      <SkeletonBox width="50%" height={12} />
    </div>
  );
}

// ── Table Row Skeleton ───────────────────────────────
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {[...Array(cols)].map((_, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <SkeletonBox
            height={14}
            width={i === 0 ? "80%" : i === cols - 1 ? "60%" : "70%"}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Profile Skeleton ─────────────────────────────────
export function ProfileSkeleton() {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "32px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <SkeletonBox width={96} height={96} radius={999} />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <SkeletonBox width="50%" height={20} />
          <SkeletonBox width="70%" height={14} />
          <SkeletonBox width="40%" height={12} />
        </div>
      </div>

      {/* Form fields */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <SkeletonBox width="30%" height={12} />
          <SkeletonBox height={42} radius={10} />
        </div>
      ))}
    </div>
  );
}

// ── Page Header Skeleton ─────────────────────────────
export function PageHeaderSkeleton() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 24px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <SkeletonBox width={120} height={14} radius={20} />
      <SkeletonBox width={280} height={36} radius={10} />
      <SkeletonBox width={200} height={14} />
    </div>
  );
}
