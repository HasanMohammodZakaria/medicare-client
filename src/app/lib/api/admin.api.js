import { authClient } from "../auth-client";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// ── client-side auth header ──
const getClientAuthHeaders = async () => {
    const { data, error } = await authClient.token();

    if (error) {
        throw new Error(error.message);
    }

    if (!data?.token) {
        throw new Error("JWT Token not found");
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
    };
}

// DELETE — user delete 
export async function deleteUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: await getClientAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
}

// PATCH — user suspend 
export async function suspendUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}/suspend`, {
        method: "PATCH",
        headers: await getClientAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to suspend user");
    return res.json();
}

// PATCH — suspended user 
export async function activateUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}/activate`, {
        method: "PATCH",
        headers: await getClientAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to activate user");
    return res.json();
}