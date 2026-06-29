
export const imageUpload = async (image) => {
    if (!image) throw new Error("No image provided");


    if (image.size > 2 * 1024 * 1024) {
        throw new Error("Image size must be less than 32MB");
    }

    // File type check
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(image.type.toLowerCase())) {
        throw new Error("Only JPG, PNG, WEBP, GIF images are allowed");
    }

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error(`ImgBB upload failed: ${res.status}`);
    }

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error?.message || "Image upload failed");
    }


    return {
        url: data.data.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
        thumb: data.data.thumb?.url,
        size: data.data.size,
        name: data.data.image?.filename,
    };
};

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

//
export const getImagePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
};


export const revokeImagePreview = (previewUrl) => {
    if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
    }
};