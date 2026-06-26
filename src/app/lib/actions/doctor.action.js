"use server";


import { auth } from "../auth";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function getDoctorId() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}

// GET /api/doctor/overview

export const getDoctorOverview = async () => {
    const doctorId = await getDoctorId();
    const res = await fetch(
        `${BASE_URL}/api/doctor/overview?doctorId=${doctorId}`,
        { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch overview");
    return res.json();
};

// GET /api/doctor/appointments

export const getDoctorAppointments = async (status = "all") => {
    const doctorId = await getDoctorId();
    const url = status === "all"
        ? `${BASE_URL}/api/doctor/appointments?doctorId=${doctorId}`
        : `${BASE_URL}/api/doctor/appointments?doctorId=${doctorId}&status=${status}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch appointments");
    return res.json();
};

// GET /api/doctor/schedule

export const getDoctorSchedule = async () => {
    const doctorId = await getDoctorId();
    const res = await fetch(
        `${BASE_URL}/api/doctor/schedule?doctorId=${doctorId}`,
        { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch schedule");
    return res.json();
};




// GET /api/doctor/prescriptions 
export async function getDoctorPrescriptions() {
    try {
        const doctorId = await getDoctorId();
        const res = await fetch(
            `${BASE_URL}/api/doctor/prescriptions?doctorId=${doctorId}`,
            { cache: "no-store" }
        );
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

// GET /api/doctor/prescriptions/:appointmentId
export async function getPrescriptionByAppointment(appointmentId) {
    try {
        const res = await fetch(
            `${BASE_URL}/api/doctor/prescriptions/${appointmentId}`,
            { cache: "no-store" }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

// GET /api/doctor/appointments — completed appointments
export async function getCompletedAppointmentsForPrescription() {
    try {
        const doctorId = await getDoctorId();
        const res = await fetch(
            `${BASE_URL}/api/doctor/appointments?doctorId=${doctorId}&status=completed`,
            { cache: "no-store" }
        );
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}


// GET /api/doctor/profile
// export const getDoctorProfile = async () => {
//     const doctorId = await getDoctorId();
//     const res = await fetch(
//         `${BASE_URL}/api/doctor/profile?doctorId=${doctorId}`,
//         { cache: "no-store" }
//     );
//     if (!res.ok) throw new Error("Failed to fetch doctor profile");
//     return res.json();
// };


export const getDoctorProfile = async () => {
    const doctorId = await getDoctorId();
    const res = await fetch(
        `${BASE_URL}/api/doctor/profile?doctorId=${doctorId}`,
        { next: { tags: ["doctor-profile"] } }
    );
    if (!res.ok) throw new Error("Failed to fetch doctor profile");
    return res.json();
};



// PATCH /api/doctor/profile
export const updateDoctorProfile = async (data) => {
    const doctorId = await getDoctorId();
    const res = await fetch(`${BASE_URL}/api/doctor/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, ...data }),
    });
    if (!res.ok) throw new Error("Failed to update doctor profile");
    revalidateTag("doctor-profile");
    revalidatePath("/dashboard/doctor/profile");
    revalidatePath("/dashboard/doctor", "layout");
    revalidatePath("/", "layout");
    return res.json();
};