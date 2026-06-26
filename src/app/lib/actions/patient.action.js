"use server";
import { headers } from "next/headers";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getUserId() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}

const getAuthHeaders = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    const tokenRes = await auth.api.getToken({ headers: await headers() });
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenRes?.token}`,
    };
};



// ── Overview ───────────────────────────────────────────────

export const getPatientOverview = async () => {
    const userId = await getUserId();
    const res = await fetch(`${BASE_URL}/api/patient/overview?userId=${userId}`, {
        cache: "no-store",
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json()
}

export const getPatientAppointments = async () => {
    const userId = await getUserId();
    const res = await fetch(
        `${BASE_URL}/api/patient/appointments?userId=${userId}`,
        { cache: "no-store" }
    );
    return res.json();
}

export const rescheduleAppointment = async (id, data) => {
    const res = await fetch(`${BASE_URL}/api/patient/appointments/${id}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to reschedule");
    return res.json();
};

export const cancelAppointment = async (id) => {
    const res = await fetch(`${BASE_URL}/api/patient/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to cancel");
    return res.json();
};

export const getPatientFavoriteDoctors = async () => {
    const userId = await getUserId();
    const res = await fetch(
        `${BASE_URL}/api/patient/favorite-doctors?userId=${userId}`,
        { cache: "no-store" }
    );
    return res.json();
};

// GET /api/patient/payments

export const getPatientPayments = async () => {
    const userId = await getUserId();
    const res = await fetch(
        `${BASE_URL}/api/patient/payments?userId=${userId}`,
        { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch payment history");
    return res.json();
};


// GET /api/patient/reviews?userId=xxx

export const getMyReviews = async () => {
    const userId = await getUserId();
    const res = await fetch(
        `${BASE_URL}/api/patient/reviews?userId=${userId}`,
        { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
};

export async function getCompletedAppointments() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user?.id) return [];

        const res = await fetch(
            `${BASE_URL}/api/patient/appointments/completed?userId=${session.user.id}`,
            { cache: "no-store" }
        );

        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("getCompletedAppointments error:", error);
        return [];
    }
}

export const getPatientProfile = async () => {
    const userId = await getUserId();
    const res = await fetch(
        `${BASE_URL}/api/patient/profile?userId=${userId}`,
        { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
};

// export const getPatientProfile = async () => {
//     const session = await auth.api.getSession({ headers: await headers() });
//     if (!session?.user) throw new Error("Unauthorized");
//     return session.user; 
// };

export const updateProfile = async (data) => {
    const userId = await getUserId();
    const res = await fetch(`${BASE_URL}/api/patient/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    revalidatePath("/dashboard/patient/profile");
    revalidatePath("/dashboard/patient", "layout");
    revalidatePath("/", "layout");
    return res.json();
};



