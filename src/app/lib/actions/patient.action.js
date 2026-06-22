"use server";
import { headers } from "next/headers";
import { auth } from "../auth";

async function getUserId() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user.id;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// ── Overview ───────────────────────────────────────────────

export const getPatientOverview = async () => {
    const userId = await getUserId();
    const res = await fetch(`${BASE_URL}/api/patient/overview?userId=${userId}`, {
        cache: "no-store"
    });
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

export const getPatientFavoriteDoctors = async () => {
    const userId = await getUserId();
    const res = await fetch(
        `${BASE_URL}/api/patient/favorite-doctors?userId=${userId}`,
        { cache: "no-store" }
    );
    return res.json();
}