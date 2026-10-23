import { authClient } from "@/lib/auth-client";

if (
  process.env.NODE_ENV !== "development" &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  throw new Error("NEXT_PUBLIC_API_URL must be configured for production.");
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function requestJson(url, options, authenticated = false) {
  const headers = new Headers(options?.headers);

  if (authenticated) {
    if (typeof window === "undefined") {
      throw new Error("Authenticated API requests must run in the browser.");
    }

    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      throw new Error(error?.message || "Please sign in to continue.");
    }

    headers.set("Authorization", `Bearer ${data.token}`);
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (cause) {
    if (!(cause instanceof TypeError)) {
      throw cause;
    }

    const requestOrigin = new URL(
      url,
      typeof window === "undefined" ? API_BASE_URL : window.location.origin,
    ).origin;
    throw new Error(
      `Unable to reach the API at ${requestOrigin}. Make sure the backend is running and NEXT_PUBLIC_API_URL points to it.`,
      { cause },
    );
  }

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      (typeof data === "string" && data) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const serverFetch = (path, options = {}) =>
  requestJson(
    `${API_BASE_URL}${path}`,
    Object.fromEntries(
      Object.entries(options).filter(([key]) => key !== "authenticated"),
    ),
    options.authenticated,
  );

export const serverMutation = (path, data, method = "POST", authenticated = true) =>
  requestJson(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  }, authenticated);

export const getTopArtists = () => serverFetch("/users/top-artists");

export const getFeaturedArtworks = () =>
  serverFetch("/artworks/featured", { cache: "no-store" });

export const getArtwork = (id) =>
  serverFetch(`/artworks/${encodeURIComponent(id)}`);

export const getArtworks = (query) => serverFetch(`/artworks?${query}`);

export const createArtwork = (data) => serverMutation("/artworks", data);

export const updateArtwork = (id, data) =>
  serverMutation(`/artworks/${encodeURIComponent(id)}`, data, "PUT");

export const deleteArtwork = (id) =>
  serverMutation(`/artworks/${encodeURIComponent(id)}`, undefined, "DELETE");

export const getArtistArtworks = (email, limit = 50) => {
  const query = new URLSearchParams({
    artistEmail: email,
    limit: String(limit),
  });
  return serverFetch(`/artworks?${query}`, { authenticated: true });
};

export const createArtworkComment = (artworkId, data) =>
  serverMutation(`/artworks/${encodeURIComponent(artworkId)}/comments`, data);

export const updateArtworkComment = (commentId, data) =>
  serverMutation(
    `/artworks/comments/${encodeURIComponent(commentId)}`,
    data,
    "PUT",
  );

export const deleteArtworkComment = (commentId, userEmail) =>
  serverMutation(
    `/artworks/comments/${encodeURIComponent(commentId)}`,
    { userEmail },
    "DELETE",
  );

export const getUserProfile = (email) =>
  serverFetch(`/users/profile?email=${encodeURIComponent(email)}`, {
    authenticated: true,
  });

export const updateUserProfile = (data) =>
  serverMutation("/users/profile", data, "PATCH");

export const getUserWishlist = (email) =>
  serverFetch(`/users/wishlist?email=${encodeURIComponent(email)}`, {
    authenticated: true,
  });

export const toggleUserWishlist = (data) =>
  serverMutation("/users/wishlist", data);

export const getUserTransactions = (email) =>
  serverFetch(`/transactions/user/${encodeURIComponent(email)}`, {
    authenticated: true,
  });

export const getArtistTransactions = (email) =>
  serverFetch(`/transactions/artist/${encodeURIComponent(email)}`, {
    authenticated: true,
  });

export const getArtistAnalytics = (email) =>
  serverFetch(`/analytics/artist/${encodeURIComponent(email)}`, {
    authenticated: true,
  });

export const getAdminAnalytics = () =>
  serverFetch("/analytics/admin", { authenticated: true });

export const getAdminUsers = () =>
  serverFetch("/users", { authenticated: true });

export const getAdminArtworks = (limit = 50) =>
  serverFetch(
    `/artworks?limit=${encodeURIComponent(limit)}&includeDrafts=true`,
    { authenticated: true },
  );

export const getAdminTransactions = () =>
  serverFetch("/transactions", { authenticated: true });

export const updateUserRole = (userId, role) =>
  serverMutation(
    `/users/${encodeURIComponent(userId)}/role`,
    { role },
    "PATCH",
  );

export const verifyPayment = (data) =>
  serverMutation("/payments/verify-payment", data);

export const createCheckoutSession = (data) =>
  serverMutation("/payments/create-checkout-session", data);

export const uploadArtworkImage = (formData) =>
  requestJson("/api/upload-imgbb", { method: "POST", body: formData });
