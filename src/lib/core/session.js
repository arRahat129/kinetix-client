'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

/**
 * Returns the currently authenticated user from the session, or null.
 */
export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user || null;
};

/**
 * Retrieves the JWT token for the current session by calling the
 * better-auth /api/auth/token endpoint with the request cookies forwarded.
 * Returns null if unauthenticated or the endpoint fails.
 */
export const getJwtToken = async () => {
    const cookie = (await headers()).get("cookie");

    const res = await fetch(
        `${process.env.BETTER_AUTH_URL}/api/auth/token`,
        {
            headers: {
                cookie: cookie ?? "",
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data.token ?? null;
};

/**
 * Guards a server component or action by role.
 * Redirects to /auth/signin if not authenticated.
 * Redirects to /forbidden if the user's role doesn't match.
 * Returns the user object on success.
 *
 * @param {string} role - Required role (e.g. 'Admin', 'Creator', 'Supporter')
 */
export const requireRole = async (role) => {
    const user = await getUserSession();

    if (!user) {
        redirect('/auth/signin');
    }

    if (user.role !== role) {
        redirect('/forbidden');
    }

    return user;
};
