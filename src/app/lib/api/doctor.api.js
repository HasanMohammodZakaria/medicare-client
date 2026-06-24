

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

// ── Accept Appointment ─────────────────────────────────────

export const acceptAppointment = async (doctorId, appointmentId) => {
    const res = await fetch(
        `${BASE_URL}/api/doctor/appointments/${appointmentId}/accept`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorId }),
        }
    );
    if (!res.ok) throw new Error("Failed to accept appointment");
    return res.json();
};

// ── Reject Appointment ─────────────────────────────────────

export const rejectAppointment = async (doctorId, appointmentId) => {
    const res = await fetch(
        `${BASE_URL}/api/doctor/appointments/${appointmentId}/reject`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorId }),
        }
    );
    if (!res.ok) throw new Error("Failed to reject appointment");
    return res.json();
};

// ── Complete Appointment ───────────────────────────────────

export const completeAppointment = async (doctorId, appointmentId) => {
    const res = await fetch(
        `${BASE_URL}/api/doctor/appointments/${appointmentId}/complete`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorId }),
        }
    );
    if (!res.ok) throw new Error("Failed to complete appointment");
    return res.json();
};
