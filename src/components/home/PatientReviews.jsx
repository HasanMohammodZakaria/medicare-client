import Image from "next/image";
import { getFeaturedReviews } from "@/app/lib/actions/public.actions";

const QuoteIcon = () => (
  <svg
    width="42"
    height="32"
    viewBox="0 0 42 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0 32V19.556C0 14.37 1.244 9.956 3.733 6.311 6.267 2.667 10.311 0.444 15.867 0L17.2 4.444C14.089 5.037 11.778 6.37 10.267 8.444 8.8 10.519 8.089 12.963 8.133 15.778H16V32H0ZM24 32V19.556C24 14.37 25.244 9.956 27.733 6.311 30.267 2.667 34.311 0.444 39.867 0L41.2 4.444C38.089 5.037 35.778 6.37 34.267 8.444 32.8 10.519 32.089 12.963 32.133 15.778H40V32H24Z"
      fill="currentColor"
    />
  </svg>
);

const StarRating = ({ rating = 5 }) => (
  <div className="rv-stars" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "rv-star filled" : "rv-star"}>
        ★
      </span>
    ))}
  </div>
);

const ReviewCard = ({ review }) => {
  const { reviewText, patientName, patientImage, specialization, rating } =
    review;

  return (
    <article className="rv-card">
      <div className="rv-quote-icon">
        <QuoteIcon />
      </div>

      <p className="rv-text">{reviewText}</p>

      <StarRating rating={rating || 5} />

      <div className="rv-author">
        <div className="rv-avatar">
          {patientImage ? (
            <Image
              src={patientImage}
              alt={patientName || "Patient"}
              width={44}
              height={44}
              className="rv-avatar-img"
            />
          ) : (
            <span className="rv-avatar-fallback">
              {patientName?.charAt(0)?.toUpperCase() || "A"}
            </span>
          )}
        </div>
        <div className="rv-author-info">
          <p className="rv-author-name">{patientName || "Anonymous"}</p>
          <p className="rv-author-role">{specialization || "Patient"}</p>
        </div>
      </div>
    </article>
  );
};

export default async function PatientReviews() {
  const data = await getFeaturedReviews();
  const reviews = (data || []).slice(0, 4);

  return (
    <>
      <style>{`
        /* ── Reviews Section ── */
        .rv-section {
          padding: 96px 24px;
          background: var(--surface-secondary);
        }

        .rv-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .rv-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .rv-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .rv-title {
          font-size: clamp(1.8rem, 4vw, 2.75rem);
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--text-primary);
          line-height: 1.2;
          margin: 0 0 16px;
        }

        .rv-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── Grid ── */
        .rv-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1100px) {
          .rv-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .rv-grid { grid-template-columns: 1fr; }
          .rv-section { padding: 64px 20px; }
        }

        /* ── Card ── */
        .rv-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
          transition:
            box-shadow var(--transition-base),
            transform var(--transition-base),
            border-color var(--transition-base);
        }

        .rv-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: var(--radius-md);
          background: linear-gradient(
            135deg,
            var(--primary) 0%,
            transparent 55%
          );
          opacity: 0;
          transition: opacity var(--transition-base);
          pointer-events: none;
        }

        .rv-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .rv-card:hover::before {
          opacity: 0.05;
        }

        /* ── Quote icon ── */
        .rv-quote-icon {
          color: var(--primary);
          opacity: 0.3;
          line-height: 1;
          flex-shrink: 0;
        }

        /* ── Review text ── */
        .rv-text {
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--text-secondary);
          flex: 1;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Stars ── */
        .rv-stars {
          display: flex;
          gap: 2px;
        }

        .rv-star {
          font-size: 0.95rem;
          color: var(--border);
        }

        .rv-star.filled {
          color: var(--warning);
        }

        /* ── Author ── */
        .rv-author {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
          margin-top: auto;
        }

        .rv-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: color-mix(in srgb, var(--primary) 15%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rv-avatar-img {
          width: 44px !important;
          height: 44px !important;
          object-fit: cover;
          border-radius: 50%;
        }

        .rv-avatar-fallback {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
        }

        .rv-author-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .rv-author-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rv-author-role {
          font-size: 0.76rem;
          color: var(--primary);
          margin: 0;
          font-weight: 500;
        }

        /* ── Empty state ── */
        .rv-empty {
          text-align: center;
          padding: 48px 24px;
          color: var(--text-muted);
          font-size: 0.95rem;
          grid-column: 1 / -1;
        }
      `}</style>

      <section className="rv-section">
        <div className="rv-container">
          <header className="rv-header">
            <span className="rv-eyebrow">Patient Experiences</span>
            <h2 className="rv-title">What Our Patients Say</h2>
            <p className="rv-subtitle">
              Real stories from people who found the care they needed — honest
              words from those who matter most.
            </p>
          </header>

          <div className="rv-grid">
            {reviews.length === 0 ? (
              <p className="rv-empty">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review._id || review.id} review={review} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
