"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/app/lib/auth-client";
import {
  addReview,
  updateReview,
  deleteReview,
} from "@/app/lib/api/patient.api";
import { toast } from "react-toastify";
import {
  MdStar,
  MdStarBorder,
  MdEdit,
  MdDelete,
  MdClose,
  MdRateReview,
  MdLocalHospital,
  MdDateRange,
  MdThumbUp,
  MdTrendingUp,
  MdFormatQuote,
} from "react-icons/md";

// ─── Star Rating ────────────────────────────────────────────────────────────

function StarRating({ value, onChange, readonly = false, size = "md" }) {
  const [hovered, setHovered] = useState(0);
  const sz =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`${sz} transition-all duration-150 ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-125"
            }`}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange && onChange(star)}
          >
            {filled ? (
              <MdStar className="text-amber-400 drop-shadow-sm" />
            ) : (
              <MdStarBorder className="text-gray-300 dark:text-gray-600" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const RATING_LABEL = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
const RATING_COLOR = [
  "",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
];

function RatingBadge({ rating }) {
  const color = RATING_COLOR[rating] || "#6b7280";
  const label = RATING_LABEL[rating] || "—";
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 flex items-center gap-4 border"
      style={{
        background: "var(--color-base-100)",
        borderColor: "var(--color-base-300)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--color-base-content)" }}
        >
          {value}
        </p>
        <p
          className="text-xs font-medium mt-0.5"
          style={{ color: "var(--color-base-content)", opacity: 0.55 }}
        >
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color, opacity: 0.8 }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Review Card ────────────────────────────────────────────────────────────

function ReviewCard({ review, index, onEdit, onDelete }) {
  const color = RATING_COLOR[review.rating] || "#6b7280";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl border overflow-hidden group transition-shadow hover:shadow-lg"
      style={{
        background: "var(--color-base-100)",
        borderColor: "var(--color-base-300)",
      }}
    >
      {/* Color accent top bar */}
      <div className="h-1 w-full" style={{ background: color }} />

      <div className="p-5 space-y-4">
        {/* Doctor info row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-0 border-2"
              style={{
                background: `${color}15`,
                borderColor: `${color}30`,
              }}
            >
              <MdLocalHospital className="text-xl" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p
                className="font-bold text-sm truncate"
                style={{ color: "var(--color-base-content)" }}
              >
                {review.doctorName || `Dr. #${review.doctorId?.slice(-6)}`}
              </p>
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: "var(--color-base-content)", opacity: 0.5 }}
              >
                {review.specialization || "Healthcare Provider"}
              </p>
            </div>
          </div>
          <RatingBadge rating={review.rating} />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-2">
          <StarRating value={review.rating} readonly size="sm" />
          <span className="text-xs font-medium" style={{ color, opacity: 0.9 }}>
            {review.rating}/5
          </span>
        </div>

        {/* Review text */}
        {review.reviewText && (
          <div
            className="rounded-xl px-4 py-3 relative"
            style={{ background: "var(--color-base-200)" }}
          >
            <MdFormatQuote
              className="absolute top-2 left-2 text-lg opacity-20"
              style={{ color: "var(--color-base-content)" }}
            />
            <p
              className="text-sm leading-relaxed line-clamp-3 pl-4"
              style={{ color: "var(--color-base-content)", opacity: 0.8 }}
            >
              {review.reviewText}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--color-base-content)", opacity: 0.45 }}
          >
            <MdDateRange className="text-sm" />
            {formatDate(review.createdAt)}
          </div>

          {/* Action buttons — show on hover */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(review)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{
                background: "var(--color-base-200)",
                color: "var(--color-base-content)",
              }}
            >
              <MdEdit className="text-sm" />
              Edit
            </button>
            <button
              onClick={() => onDelete(review)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: "#fef2f2", color: "#ef4444" }}
            >
              <MdDelete className="text-sm" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Review Modal ───────────────────────────────────────────────────────────

function ReviewModal({
  mode,
  review,
  completedAppointments,
  onClose,
  onSubmit,
  loading,
}) {
  const isEdit = mode === "edit";
  const [selectedAppointment, setSelectedAppointment] = useState(
    isEdit ? null : "",
  );
  const [rating, setRating] = useState(isEdit ? (review?.rating ?? 0) : 0);
  const [reviewText, setReviewText] = useState(
    isEdit ? (review?.reviewText ?? "") : "",
  );

  const selectedAppt = completedAppointments.find(
    (a) => a._id === selectedAppointment,
  );

  const handleSubmit = () => {
    if (!isEdit && !selectedAppointment) {
      toast.error("Please select an appointment");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating (1–5 stars)");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write your review");
      return;
    }
    onSubmit({
      doctorId: isEdit ? review?.doctorId : selectedAppt?.doctorId,
      rating,
      reviewText: reviewText.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border"
        style={{
          background: "var(--color-base-100)",
          borderColor: "var(--color-base-300)",
        }}
      >
        {/* Modal accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: "var(--color-primary)" }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-base-300)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-primary)", opacity: 0.9 }}
            >
              <MdRateReview className="text-white text-lg" />
            </div>
            <div>
              <h2
                className="text-base font-bold"
                style={{ color: "var(--color-base-content)" }}
              >
                {isEdit ? "Edit Your Review" : "Write a Review"}
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--color-base-content)", opacity: 0.5 }}
              >
                {isEdit ? "Update your feedback" : "Share your experience"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
            style={{
              background: "var(--color-base-200)",
              color: "var(--color-base-content)",
            }}
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Doctor selector (Add mode) */}
          {!isEdit && (
            <div className="space-y-2">
              <label
                className="text-sm font-semibold"
                style={{ color: "var(--color-base-content)" }}
              >
                Select Doctor
              </label>
              {completedAppointments.length === 0 ? (
                <div
                  className="rounded-xl px-4 py-4 text-sm text-center border border-dashed"
                  style={{
                    borderColor: "var(--color-base-300)",
                    color: "var(--color-base-content)",
                    opacity: 0.6,
                  }}
                >
                  No completed appointments found
                </div>
              ) : (
                <select
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all"
                  style={{
                    background: "var(--color-base-200)",
                    color: "var(--color-base-content)",
                    borderColor: selectedAppointment
                      ? "var(--color-primary)"
                      : "var(--color-base-300)",
                  }}
                >
                  <option value="">— Choose a completed appointment —</option>
                  {completedAppointments.map((appt) => (
                    <option key={appt._id} value={appt._id}>
                      {appt.doctorName || appt.doctorId} •{" "}
                      {appt.specialization || "Doctor"} •{" "}
                      {formatDate(appt.appointmentDate)}
                    </option>
                  ))}
                </select>
              )}

              {selectedAppt && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                  style={{
                    background: "var(--color-base-200)",
                    borderColor: "var(--color-primary)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-0"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <MdLocalHospital className="text-white text-base" />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-base-content)" }}
                    >
                      {selectedAppt.doctorName || selectedAppt.doctorId}
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--color-base-content)",
                        opacity: 0.55,
                      }}
                    >
                      {selectedAppt.specialization} •{" "}
                      {formatDate(selectedAppt.appointmentDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit — show doctor */}
          {isEdit && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{
                background: "var(--color-base-200)",
                borderColor: "var(--color-base-300)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-0"
                style={{ background: "var(--color-primary)" }}
              >
                <MdLocalHospital className="text-white text-base" />
              </div>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-base-content)" }}
                >
                  {review?.doctorName || review?.doctorId}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-base-content)", opacity: 0.5 }}
                >
                  Editing your existing review
                </p>
              </div>
            </div>
          )}

          {/* Rating picker */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold"
              style={{ color: "var(--color-base-content)" }}
            >
              Your Rating
            </label>
            <div
              className="flex items-center gap-4 px-4 py-4 rounded-xl border"
              style={{
                background: "var(--color-base-200)",
                borderColor: "var(--color-base-300)",
              }}
            >
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating > 0 && (
                <div className="flex flex-col">
                  <span
                    className="text-sm font-bold"
                    style={{ color: RATING_COLOR[rating] }}
                  >
                    {RATING_LABEL[rating]}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-base-content)", opacity: 0.5 }}
                  >
                    {rating} out of 5
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review textarea */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold"
              style={{ color: "var(--color-base-content)" }}
            >
              Your Review
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Describe your experience with this doctor — what went well, what could be improved..."
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border resize-none transition-all"
                style={{
                  background: "var(--color-base-200)",
                  color: "var(--color-base-content)",
                  borderColor: "var(--color-base-300)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-base-300)")
                }
              />
              <span
                className="absolute bottom-3 right-3 text-xs"
                style={{ color: "var(--color-base-content)", opacity: 0.35 }}
              >
                {reviewText.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: "var(--color-base-300)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-75"
            style={{
              background: "var(--color-base-200)",
              color: "var(--color-base-content)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-content)",
            }}
          >
            {loading ? "Saving..." : isEdit ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Modal ───────────────────────────────────────────────────────────

function DeleteModal({ review, onClose, onConfirm, loading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border"
        style={{
          background: "var(--color-base-100)",
          borderColor: "var(--color-base-300)",
        }}
      >
        <div className="h-1 w-full bg-red-500" />
        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "#fef2f2" }}
            >
              <MdDelete className="text-3xl text-red-500" />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--color-base-content)" }}
              >
                Delete Review?
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-base-content)", opacity: 0.6 }}
              >
                Your review for{" "}
                <span className="font-semibold" style={{ opacity: 1 }}>
                  {review?.doctorName || review?.doctorId}
                </span>{" "}
                will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-75"
              style={{
                background: "var(--color-base-200)",
                color: "var(--color-base-content)",
              }}
            >
              Keep it
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#ef4444", color: "#fff" }}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-5"
    >
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed"
        style={{
          background: "var(--color-base-200)",
          borderColor: "var(--color-base-300)",
        }}
      >
        <MdRateReview
          className="text-5xl"
          style={{ color: "var(--color-primary)", opacity: 0.6 }}
        />
      </div>
      <div className="text-center space-y-1">
        <h3
          className="text-xl font-bold"
          style={{ color: "var(--color-base-content)" }}
        >
          No Reviews Yet
        </h3>
        <p
          className="text-sm max-w-xs"
          style={{ color: "var(--color-base-content)", opacity: 0.55 }}
        >
          Your feedback helps other patients find the right doctor. Share your
          experience!
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-primary-content)",
        }}
      >
        <MdRateReview />
        Write Your First Review
      </button>
    </motion.div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function MyReviews({ initialReviews, completedAppointments }) {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [modal, setModal] = useState(null);
  const [activeReview, setActiveReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
        : "0.0";
    const fiveStar = reviews.filter((r) => r.rating === 5).length;
    const positive = reviews.filter((r) => r.rating >= 4).length;
    return { total, avg, fiveStar, positive };
  }, [reviews]);

  const openAdd = () => {
    setActiveReview(null);
    setModal("add");
  };
  const openEdit = (r) => {
    setActiveReview(r);
    setModal("edit");
  };
  const openDelete = (r) => {
    setActiveReview(r);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setActiveReview(null);
  };

  const handleAdd = async ({ doctorId, rating, reviewText }) => {
    if (!session?.user?.id) {
      toast.error("Please login first");
      return;
    }
    setLoading(true);
    try {
      const result = await addReview({
        patientId: session.user.id,
        doctorId,
        rating,
        reviewText,
      });
      setReviews((prev) => [
        {
          _id: result.insertedId,
          patientId: session.user.id,
          doctorId,
          rating,
          reviewText,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      toast.success("Review submitted successfully!");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async ({ rating, reviewText }) => {
    if (!activeReview?._id) return;
    setLoading(true);
    try {
      await updateReview(activeReview._id, { rating, reviewText });
      setReviews((prev) =>
        prev.map((r) =>
          r._id === activeReview._id ? { ...r, rating, reviewText } : r,
        ),
      );
      toast.success("Review updated!");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!activeReview?._id) return;
    setLoading(true);
    try {
      await deleteReview(activeReview._id);
      setReviews((prev) => prev.filter((r) => r._id !== activeReview._id));
      toast.success("Review deleted!");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-base-content)" }}
          >
            My Reviews
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--color-base-content)", opacity: 0.55 }}
          >
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} shared
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95 self-start sm:self-auto"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-primary-content)",
          }}
        >
          <MdRateReview />
          Write a Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MdRateReview}
          label="Total Reviews"
          value={stats.total}
          color="var(--color-primary)"
        />
        <StatCard
          icon={MdStar}
          label="Average Rating"
          value={stats.avg}
          color="#f59e0b"
          sub="out of 5.0"
        />
        <StatCard
          icon={MdThumbUp}
          label="5-Star Reviews"
          value={stats.fiveStar}
          color="#10b981"
        />
        <StatCard
          icon={MdTrendingUp}
          label="Positive (4+★)"
          value={stats.positive}
          color="#6366f1"
        />
      </div>

      {/* Cards / Empty */}
      {reviews.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, i) => (
              <ReviewCard
                key={review._id}
                review={review}
                index={i}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {(modal === "add" || modal === "edit") && (
          <ReviewModal
            key="review-modal"
            mode={modal}
            review={activeReview}
            completedAppointments={completedAppointments}
            onClose={closeModal}
            onSubmit={modal === "add" ? handleAdd : handleUpdate}
            loading={loading}
          />
        )}
        {modal === "delete" && (
          <DeleteModal
            key="delete-modal"
            review={activeReview}
            onClose={closeModal}
            onConfirm={handleDelete}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
