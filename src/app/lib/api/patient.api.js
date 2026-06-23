
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const rescheduleAppointment = async (id, data) => {
    const res = await fetch(
        `${BASE_URL}/api/patient/appointments/${id}/reschedule`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    );
    if (!res.ok) throw new Error("Failed to reschedule appointment");
    return res.json();
};

export const cancelAppointment = async (id) => {
    const res = await fetch(
        `${BASE_URL}/api/patient/appointments/${id}/cancel`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        }
    );
    if (!res.ok) throw new Error("Failed to cancel appointment");
    return res.json();
};

// POST /api / patient / reviews

export const addReview = async ({ patientId, doctorId, rating, reviewText }) => {
    const res = await fetch(`${BASE_URL}/api/patient/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, doctorId, rating, reviewText }),
    });
    if (!res.ok) throw new Error("Failed to add review");
    return res.json();
};

// PATCH /api/patient/reviews/:id

export const updateReview = async (id, { rating, reviewText }) => {
    const res = await fetch(`${BASE_URL}/api/patient/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, reviewText }),
    });
    if (!res.ok) throw new Error("Failed to update review");
    return res.json();
};

// DELETE /api/patient/reviews/:id

export const deleteReview = async (id) => {
    const res = await fetch(`${BASE_URL}/api/patient/reviews/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete review");
    return res.json();
};





