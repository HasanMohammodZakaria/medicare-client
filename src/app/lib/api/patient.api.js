const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const rescheduleAppointment = async (userId, id, data) => {
    const res = await fetch(
        `${BASE_URL}/api/patient/appointments/${id}/reschedule`,
        {
            method: "PATCH",
            headers:
            {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({ ...data, userId }),
        }
    );
    if (!res.ok) throw new Error('Failed to fetch cars');
    const data = await res.json();
    return data;
}

export const cancelAppointment = async (userId, id) => {
    const res = await fetch(
        `${BASE_URL}/api/patient/appointments/${id}/cancel`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        }
    );
    if (!res.ok) throw new Error('Failed to fetch cars');
    const data = await res.json();
    return data;
}