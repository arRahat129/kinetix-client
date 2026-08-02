'use server';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const serverMutation = async (path, data, method) => {
    const url = `${baseUrl}${path}`;
    const res = await fetch(url, {
        method: method || 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}