"use server";

import { redirect } from "next/navigation";

const frontendUrl =
  process.env.FRONTEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL;

if (!frontendUrl && process.env.NODE_ENV !== "development") {
  throw new Error(
    "FRONTEND_URL, NEXT_PUBLIC_APP_URL, or BETTER_AUTH_URL must be configured for production.",
  );
}

const frontendOrigin = new URL(frontendUrl || "http://localhost:3000").origin;

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
