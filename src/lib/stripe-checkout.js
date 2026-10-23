export function redirectToCheckout(url) {
  if (typeof window === "undefined" || typeof url !== "string") {
    throw new Error("A valid checkout URL is required.");
  }

  let checkoutUrl;
  try {
    checkoutUrl = new URL(url, window.location.origin);
  } catch {
    throw new Error("A valid checkout URL is required.");
  }

  const isSameOrigin = checkoutUrl.origin === window.location.origin;
  const isStripeCheckout =
    checkoutUrl.protocol === "https:" &&
    checkoutUrl.hostname === "checkout.stripe.com";

  if (!isSameOrigin && !isStripeCheckout) {
    throw new Error("Checkout destination is not allowed.");
  }

  window.location.assign(checkoutUrl.toString());
}
