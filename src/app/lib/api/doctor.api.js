

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// ── client-side auth header ──
const getClientAuthHeaders = async () => {
    const { data } = await authClient.getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data?.token}`,
    };
}

// PATCH /api/doctor/schedule

export const updateDoctorSchedule = async (doctorId, { availableDays, availableSlots }) => {
    const res = await fetch(`${BASE_URL}/api/doctor/schedule`, {
        method: "PATCH",
        headers: await getClientAuthHeaders(),
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
            headers: await getClientAuthHeaders(),
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
            headers: await getClientAuthHeaders(),
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
            headers: await getClientAuthHeaders(),
            body: JSON.stringify({ doctorId }),
        }
    );
    if (!res.ok) throw new Error("Failed to complete appointment");
    return res.json();
};

export async function createPrescription({
    doctorId,
    patientId,
    appointmentId,
    diagnosis,
    medications,
    notes,
}) {
    const res = await fetch(`${BASE_URL}/api/doctor/prescriptions`, {
        method: "POST",
        headers: await getClientAuthHeaders(),
        body: JSON.stringify({
            doctorId,
            patientId,
            appointmentId,
            diagnosis,
            medications,
            notes,
        }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create prescription");
    }
    return res.json();
}

// PATCH /api/doctor/prescriptions/:id — prescription update
export async function updatePrescription(id, { diagnosis, medications, notes }) {
    const res = await fetch(`${BASE_URL}/api/doctor/prescriptions/${id}`, {
        method: "PATCH",
        headers: await getClientAuthHeaders(),
        body: JSON.stringify({ diagnosis, medications, notes }),
    });
    if (!res.ok) throw new Error("Failed to update prescription");
    return res.json();
}




// PATCH /api/doctor/profile
// export const updateDoctorProfile = async (doctorId, data) => {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor/profile`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ doctorId, ...data }),
//     });
//     if (!res.ok) throw new Error("Failed to update profile");
//     return res.json();
// };
