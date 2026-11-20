import { stripe } from "@/lib/stripe";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { GUEST_EMAIL } from "@/lib/guestAccount";

export async function POST(request: Request) {
    // 1. Check authentication header
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return Response.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    const token = authorization.slice(7).trim();

    // 2. Verify Firebase user
    let uid: string;
    let email: string | undefined;

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        if (
            decodedToken.firebase.sign_in_provider === "anonymous" ||
            decodedToken.email?.trim().toLowerCase() === GUEST_EMAIL
        ) {
            return Response.json(
                { error: "Please register before subscribing" },
                { status: 403 }
            );
        }

        uid = decodedToken.uid;
        email = decodedToken.email;

    } catch {
        return Response.json(
            { error: "Invalid authentication token" },
            { status: 401 }
        );
    }

    // 3. Validate requested plan
    const body = await request.json().catch(() => null);
    const plan = body?.plan;

    if (plan !== "monthly" && plan !== "yearly") {
        return Response.json(
            { error: "Invalid subscription plan" },
            { status: 400 }
        );
    }

    // 4. Select configured Stripe price
    const priceId =
        plan === "yearly"
            ? process.env.STRIPE_PRICE_YEARLY
            : process.env.STRIPE_PRICE_MONTHLY;

    if (!priceId) {
        return Response.json(
            { error: "Stripe price is not configured" },
            { status: 500 }
        );
    }

    try {
        // 5. Prevent already-subscribed users from subscribing again
        const subscriptionDoc = await adminDb
            .collection("subscriptions")
            .doc(uid)
            .get();

        const status = subscriptionDoc.data()?.status;

        if (status === "active" || status === "trialing") {
            return Response.json(
                { error: "You already have an active subscription" },
                { status: 409 }
            );
        }

        // 6. Verify Stripe price
        const price = await stripe.prices.retrieve(priceId);

        const expectedInterval =
            plan === "yearly" ? "year" : "month";

        if (
            price.livemode ||
            !price.active ||
            price.type !== "recurring" ||
            price.recurring?.interval !== expectedInterval
        ) {
            throw new Error("Invalid Stripe subscription price");
        }

        // 7. Determine application URL
        const appUrl = process.env.APP_URL;

        if (!appUrl) {
            throw new Error("APP_URL is not configured");
        }

        // 8. Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",

            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],

            // Associate checkout with Firebase user
            client_reference_id: uid,

            ...(email ? { customer_email: email } : {}),

            // Attach information to Stripe subscription
            subscription_data: {
                metadata: {
                    firebaseUid: uid,
                    plan,
                },

                // Only yearly subscriptions get a free trial
                ...(plan === "yearly"
                    ? { trial_period_days: 7 }
                    : {}),
            },

            success_url: `${appUrl}/choose-plan?checkout=success`,

            cancel_url: `${appUrl}/choose-plan?checkout=cancelled`,
        });

        if (!session.url) {
            throw new Error("Stripe did not provide a Checkout URL");
        }

        return Response.json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.error("Stripe Checkout error:", error);

        return Response.json(
            { error: "Unable to create checkout session" },
            { status: 500 }
        );
    }
}