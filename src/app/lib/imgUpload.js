// src/app/lib/utils/imageUpload.js
// ImgBB Image Upload — সব জায়গায় এই function ব্যবহার করো

// ── Single Image Upload ────────────────────────────────────────────
// কাজ: একটা image file নিয়ে ImgBB তে upload করে URL return করে
// use: profile photo, doctor photo, যেকোনো single image
export const imageUpload = async (image) => {
    if (!image) throw new Error("No image provided");

    // File size check — 32MB limit (ImgBB max)
    if (image.size > 32 * 1024 * 1024) {
        throw new Error("Image size must be less than 32MB");
    }

    // File type check
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(image.type)) {
        throw new Error("Only JPG, PNG, WEBP, GIF images are allowed");
    }

    const formData = new FormData();
    formData.append("image", image); // ✅ fix: formData append করা হয়েছে

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        {
            method: "POST",
            body: formData, // ✅ fix: image না, formData পাঠাতে হয়
        }
    );

    if (!res.ok) {
        throw new Error(`ImgBB upload failed: ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error?.message || "Image upload failed");
    }

    // Return করছে full data object
    return {
        url: data.data.url,           // direct image URL
        displayUrl: data.data.display_url, // display URL
        deleteUrl: data.data.delete_url,   // delete করার URL
        thumb: data.data.thumb?.url,       // thumbnail URL
        size: data.data.size,
        name: data.data.image?.filename,
    };
};

// ── Multiple Images Upload ─────────────────────────────────────────
// কাজ: একসাথে অনেকগুলো image upload করে URLs array return করে
// use: prescription এ multiple attachments, gallery etc.
export const multipleImageUpload = async (images) => {
    if (!images || images.length === 0) throw new Error("No images provided");
    if (images.length > 10) throw new Error("Maximum 10 images at once");

    const uploadPromises = Array.from(images).map((img) => imageUpload(img));
    const results = await Promise.allSettled(uploadPromises);

    const successful = [];
    const failed = [];

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            successful.push(result.value);
        } else {
            failed.push({ index, error: result.reason?.message });
        }
    });

    if (failed.length > 0) {
        console.warn("Some images failed to upload:", failed);
    }

    return { successful, failed };
};

// ── Image Upload with Preview ──────────────────────────────────────
// কাজ: Upload করার আগে local preview URL দেয়, upload শেষে real URL দেয়
// use: form এ image select করলে preview দেখানো
export const getImagePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
};

// ── Cleanup Preview URL ────────────────────────────────────────────
// কাজ: Memory leak এড়াতে preview URL cleanup করো
// use: component unmount এ বা upload শেষে
export const revokeImagePreview = (previewUrl) => {
    if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
    }
};