
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// DELETE — user delete 
export async function deleteUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
}

// PATCH — user suspend 
export async function suspendUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to suspend user");
    return res.json();
}

// PATCH — suspended user 
export async function activateUser(id) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}/activate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to activate user");
    return res.json();
}