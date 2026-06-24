"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MdCloudUpload, MdClose, MdImage } from "react-icons/md";

import { toast } from "react-toastify";
import {
  getImagePreview,
  imageUpload,
  revokeImagePreview,
} from "@/app/lib/imgUpload";

// Props:
// onUpload(url)  — upload শেষে image URL দেবে
// defaultImage   — existing image URL (edit mode এ)
// label          — field label
// size           — "sm" | "md" | "lg" (default: "md")
// shape          — "circle" | "square" (default: "square")

export default function ImageUploader({
  onUpload,
  defaultImage = "",
  label = "Upload Image",
  size = "md",
  shape = "square",
}) {
  const [preview, setPreview] = useState(defaultImage || "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) revokeImagePreview(preview);
    };
  }, [preview]);

  const dimensions = { sm: 80, md: 120, lg: 160 }[size];
  const borderRadius = shape === "circle" ? "50%" : "14px";

  const handleFile = async (file) => {
    if (!file) return;

    // Show preview immediately
    const localPreview = getImagePreview(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const result = await imageUpload(file);
      revokeImagePreview(localPreview);
      setPreview(result.url);
      onUpload?.(result.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      revokeImagePreview(localPreview);
      setPreview(defaultImage || "");
      toast.error(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (preview?.startsWith("blob:")) revokeImagePreview(preview);
    setPreview("");
    onUpload?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "var(--text-muted)",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Preview Box */}
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            width: dimensions,
            height: dimensions,
            borderRadius,
            border: `2px dashed ${dragOver ? "var(--primary)" : preview ? "var(--border)" : "var(--border)"}`,
            background: dragOver ? "var(--primary-subtle)" : "var(--bg-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: uploading ? "wait" : "pointer",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                style={{ objectFit: "cover" }}
                sizes={`${dimensions}px`}
              />
              {/* Overlay on hover */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <MdCloudUpload size={28} style={{ color: "#fff" }} />
              </div>
            </>
          ) : uploading ? (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "3px solid var(--border)",
                borderTopColor: "var(--primary)",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 8 }}>
              <MdImage
                size={28}
                style={{ color: "var(--text-muted)", marginBottom: 4 }}
              />
              <p
                style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}
              >
                Click or drag
              </p>
            </div>
          )}
        </div>

        {/* Info + Actions */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 13,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {uploading
              ? "Uploading..."
              : preview
                ? "Image uploaded"
                : "No image selected"}
          </p>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            JPG, PNG, WEBP, GIF · Max 32MB
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: "7px 14px",
                borderRadius: "9px",
                border: "1px solid var(--border)",
                background: "var(--bg-muted)",
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                opacity: uploading ? 0.5 : 1,
              }}
            >
              <MdCloudUpload size={14} />
              {preview ? "Change" : "Choose File"}
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                style={{
                  padding: "7px 14px",
                  borderRadius: "9px",
                  border: "1px solid var(--danger)",
                  background: "var(--danger-subtle)",
                  color: "var(--danger)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <MdClose size={14} /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
