import { headers } from "next/headers";
import { auth } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;


export const getFeaturedDoctors = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/doctors/featured`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
};

// export const getDoctors = async ({ search, specialization, sortBy } = {}) => {
//     try {
//         const params = new URLSearchParams();
//         if (search) params.set("search", search);
//         if (specialization && specialization !== "all") params.set("specialization", specialization);
//         if (sortBy) params.set("sortBy", sortBy);

//         const res = await fetch(`${BASE_URL}/api/doctors?${params}`, {
//             cache: "no-store",
//         });
//         if (!res.ok) return [];
//         return res.json();
//     } catch { return []; }
// };

export const getDoctors = async ({ search, specialization, sortBy, page = 1, limit = 10 } = {}) => {
    try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (specialization && specialization !== "all") params.set("specialization", specialization);
        if (sortBy && sortBy !== "newest") params.set("sortBy", sortBy);
        params.set("page", page);
        params.set("limit", limit);

        const res = await fetch(`${BASE_URL}/api/doctors?${params}`, {
            cache: "no-store",
        });
        if (!res.ok) return { doctors: [], total: 0, page: 1, totalPages: 1 };
        return res.json();
    } catch {
        return { doctors: [], total: 0, page: 1, totalPages: 1 };
    }
};


export const getSpecializations = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/doctors/specializations`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
};

export const getDoctorById = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/api/doctors/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return res.json();
    } catch { return null; }
};