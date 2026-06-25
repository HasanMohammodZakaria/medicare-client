"use server";


import { auth } from "../auth";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function getAdminId() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}


// Overview stats

export const getAdminOverview = async () => {
    const res = await fetch(
        `${BASE_URL}/api/admin/overview`,
        { cache: "no-store" }
    );
    if (!res.ok) return {};
    return res.json();
};


export async function getAdminUsers() {
    try {
        const res = await fetch(`${BASE_URL}/api/admin/users`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}


// GET /api/admin/doctors

export async function getDoctors() {
    const res = await fetch(`${BASE_URL}/api/admin/doctors`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch doctors");
    return res.json();
}

export async function verifyDoctor(id) {
    const res = await fetch(`${BASE_URL}/api/admin/doctors/${id}/verify`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to verify doctor");
    return res.json();
}

export async function rejectDoctor(id) {
    const res = await fetch(`${BASE_URL}/api/admin/doctors/${id}/reject`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to reject doctor");
    return res.json();
}

export async function revokeDoctor(id) {
    const res = await fetch(`${BASE_URL}/api/admin/doctors/${id}/revoke`, {
        method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to revoke doctor");
    return res.json();
}


// GET /api/admin/appointments

export const getAdminAppointments = async (status = "all") => {
    const url = status === "all"
        ? `${BASE_URL}/api/admin/appointments`
        : `${BASE_URL}/api/admin/appointments?status=${status}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch appointments");
    return res.json();
};


// Chart data

export const getAdminAnalytics = async () => {
    const res = await fetch(
        `${BASE_URL}/api/admin/analytics`,
        { cache: "no-store" }
    );
    if (!res.ok) return {};
    return res.json();
};