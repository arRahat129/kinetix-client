'use server';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const serverFetch = async (path) => {
    try {
        const url = `${baseUrl}${path}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`serverFetch error ${res.status} for ${url}`);
            return { success: false, data: [] };
        }
        return await res.json();
    } catch (error) {
        console.error('serverFetch failed:', error);
        return { success: false, data: [], error: error.message };
    }
};

export const serverMutation = async (path, data, method) => {
    try {
        const url = `${baseUrl}${path}`;
        const res = await fetch(url, {
            method: method || 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            cache: 'no-store'
        });
        if (!res.ok) {
            console.error(`serverMutation error ${res.status} for ${url}`);
            return { success: false, message: `Server error: ${res.status}` };
        }
        return await res.json();
    } catch (error) {
        console.error('serverMutation failed:', error);
        return { success: false, message: error.message };
    }
};
