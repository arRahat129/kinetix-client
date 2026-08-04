import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req) {
    try {
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { userEmail, userId, userName, userImage, creditsToAdd, amount, redirectTo } = session.metadata || {};

            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

            // Call backend server to atomically add credits and record payment history
            const backendRes = await fetch(`${serverUrl}/api/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stripeSessionId: sessionId,
                    userEmail,
                    userId,
                    userName,
                    userImage,
                    creditsToAdd: Number(creditsToAdd),
                    amount: Number(amount),
                }),
            });

            const backendData = await backendRes.json();

            return NextResponse.json({
                success: true,
                email: userEmail,
                credits: Number(creditsToAdd),
                amount: Number(amount),
                redirectTo: redirectTo || '/dashboard',
                backend: backendData
            });
        }

        return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 });
    } catch (err) {
        console.error('Payment Verification API Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}