import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        const res = await fetch(`${serverUrl}/api/reviews/featured`, { cache: 'no-store' });

        if (!res.ok) {
            return NextResponse.json({ success: false, data: [] }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Featured reviews proxy error:', error);
        return NextResponse.json({ success: false, data: [] }, { status: 500 });
    }
}
