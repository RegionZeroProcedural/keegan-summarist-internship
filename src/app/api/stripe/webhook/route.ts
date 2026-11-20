import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

import type Stripe from "stripe";

async function syncSubscription(
    subscriptionId: string,
    requireExistingLink = false
) {
    const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);

    const uid = subscription.metadata.firebaseUid;
    const plan = subscription.metadata.plan;

    if (
        !uid ||
        subscription.livemode ||
        (plan !== "yearly" && plan !== "monthly")
    ) {
        return;
    }

    const subscriptionRef = adminDb
        .collection("subscriptions")
        .doc(uid);

    // Avoid overwriting a different linked subscription.
    if (requireExistingLink) {
        const existing = await subscriptionRef.get();

        if (
            existing.data()?.stripeSubscriptionId !==
            subscription.id
        ) {
            return;
        }
    }

    const customerId =
        typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

    await subscriptionRef.set(
        {
            status: subscription.status,
            plan,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,

            trialEnd: subscription.trial_end
                ? new Date(
                    subscription.trial_end * 1000
                ).toISOString()
                : null,

            updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
    );
}

export async function POST(request: Request) {
    const signature = request.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !secret) {
        return Response.json(
            { error: "Missing webhook configuration" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        const body = await request.text();

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            secret
        );
    } catch (error) {
        console.error("Webhook verification failed:", error);

        return Response.json(
            { error: "Invalid webhook signature" },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;

                if (
                    session.mode === "subscription" &&
                    session.subscription
                ) {
                    const subscriptionId =
                        typeof session.subscription === "string"
                            ? session.subscription
                            : session.subscription.id;

                    await syncSubscription(subscriptionId);
                }

                break;
            }

            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                await syncSubscription(
                    event.data.object.id,
                    true
                );

                break;
            }
        }

        return Response.json({ received: true });

    } catch (error) {
        console.error("Webhook processing failed:", error);

        return Response.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}