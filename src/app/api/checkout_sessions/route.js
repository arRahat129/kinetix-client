import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req) {
    try {
        const { amount, credits, userEmail, userId, userName, userImage, priceId, redirectTo } = await req.json();

        if (!userEmail) {
            return NextResponse.json({ error: 'userEmail is required' }, { status: 400 });
        }

        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Check if custom Stripe catalog price ID is supplied
        const lineItem = priceId
            ? { price: priceId, quantity: 1 }
            : {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${credits} Platform Credits`,
                        description: `Purchase ${credits} platform credits for campaign support`,
                    },
                    unit_amount: Math.round(Number(amount) * 100), // convert dollars to cents
                },
                quantity: 1,
            };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: userEmail,
            line_items: [lineItem],
            metadata: {
                userEmail,
                userId: userId || '',
                userName: userName || '',
                userImage: userImage || '',
                creditsToAdd: String(credits),
                amount: String(amount),
                redirectTo: redirectTo || '/dashboard',
            },
            success_url: `${origin}/dashboard/supporter/credits/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/supporter/credits/payment-cancel?redirectTo=${encodeURIComponent(redirectTo || '/dashboard')}`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.error('Checkout Session API Error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to create checkout session' },
            { status: err.statusCode || 500 }
        );
    }
}