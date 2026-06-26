import { headers } from "next/headers";
import { auth } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Home page এ 4টা featured doctor আনবে
export const getFeaturedDoctors = async () => {
    const { token } = await auth.api.getToken({
        headers: await headers()

    })

    console.log(token.token);

    try {
        const res = await fetch(`${BASE_URL}/api/doctors/featured`, {
            cache: "no-store", headers: {
                authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return [];
        return res.json();
    } catch { return []; }
};