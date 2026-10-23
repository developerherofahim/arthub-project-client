"use server";

import { redirect } from "next/navigation";

const frontendOrigin = new URL(
  process.env.FRONTEND_URL || "http://localhost:3000",
).origin;

export async function redirectFromArtworkPage(destination) {
  if (typeof destination !== "string") {
    throw new Error("A valid redirect destination is required");
  }

  let url;
  try {
    url = new URL(destination, frontendOrigin);
  } catch {
    throw new Error("A valid redirect destination is required");
  }

  const isFrontendUrl = url.origin === frontendOrigin;
  const isStripeCheckoutUrl =
    url.protocol === "https:" && url.hostname === "checkout.stripe.com";

  if (!isFrontendUrl && !isStripeCheckoutUrl) {
    throw new Error("Redirect destination is not allowed");
  }

  redirect(url.toString());
}
