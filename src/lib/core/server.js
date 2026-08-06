'use server';

import { redirect } from "next/navigation";
import { getJwtToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const isNextRedirect = (error) => {
    return error && (
        error.message === 'NEXT_REDIRECT' ||
        (error.digest && error.digest.startsWith('NEXT_REDIRECT'))
    );
};

/**
 * Builds an Authorization header using the current session's JWT token.
 * Returns an empty object if no token is available (unauthenticated requests).
 */
export const authHeader = async () => {
    const token = await getJwtToken();
    return token ? { authorization: `Bearer ${token}` } : {};
};

export const serverFetch = async (path) => {
    try {
        const url = `${baseUrl}${path}`;
        const res = await fetch(url, {
            headers: await authHeader(),
            cache: 'no-store'
        });

        return await handleStatusCode(res);
    } catch (error) {
        if (isNextRedirect(error)) throw error;
        console.error(`serverFetch failed on [${path}]:`, error);
        return { success: false, data: [], error: error.message };
    }
};

export const serverMutation = async (path, data, method = 'POST') => {
    try {
        const url = `${baseUrl}${path}`;
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...await authHeader()
            },
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        return await handleStatusCode(res);
    } catch (error) {
        if (isNextRedirect(error)) throw error;
        console.error(`serverMutation failed on [${path}]:`, error);
        return { success: false, message: error.message };
    }
};

export const handleStatusCode = async (res) => {
    if (res.status === 401) {
        redirect('/unauthorized');
    }
    if (res.status === 403) {
        redirect('/forbidden');
    }

    if (!res.ok) {
        console.error(`HTTP error ${res.status} for ${res.url}`);
        return { success: false, message: `Server error: ${res.status}` };
    }

    return await res.json();
};
