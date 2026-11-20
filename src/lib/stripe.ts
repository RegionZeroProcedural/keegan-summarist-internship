import "server-only";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey?.startsWith("sk_test_")) {
    throw new Error(
        "A valid Stripe Sandbox secret key is required."
    );
}

export const stripe = new Stripe(stripeSecretKey);