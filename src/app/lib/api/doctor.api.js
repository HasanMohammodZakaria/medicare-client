

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// PATCH /api/doctor/schedule

export const updateDoctorSchedule = async (doctorId, { availableDays, availableSlots }) => {
    const res = await fetch(`${BASE_URL}/api/doctor/schedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, availableDays, availableSlots }),
    });
    if (!res.ok) throw new Error("Failed to update schedule");
    return res.json();
};