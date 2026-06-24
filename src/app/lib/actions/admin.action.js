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

// Chart data

export const getAdminAnalytics = async () => {
    const res = await fetch(
        `${BASE_URL}/api/admin/analytics`,
        { cache: "no-store" }
    );
    if (!res.ok) return {};
    return res.json();
};