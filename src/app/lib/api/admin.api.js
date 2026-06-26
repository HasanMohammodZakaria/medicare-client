
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// ── client-side auth header ──
const getClientAuthHeaders = async () => {
    const { data } = await authClient.getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data?.token}`,
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