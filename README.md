# ArtHub – Online Art Marketplace (Client)

ArtHub is a modern, full-stack digital art marketplace connecting collectors, art enthusiasts, and buyers with independent visual artists. Collectors discover, purchase, and review museum-grade original pieces and digital editions, while artists publish, manage, and track acquisitions through role-tailored dashboards.

---

## 🌐 Live URLs & Deployment
- **Client Application**: [https://arthub-project-client.vercel.app](https://arthub-project-client.vercel.app)
- **Backend API**: [https://arthub-project-server.onrender.com](https://arthub-project-server.onrender.com)
- **Local Dev Server**: `http://localhost:3000`

### 🔑 Default Test Credentials
- **Admin Email**: `admin@arthub.com`
- **Admin Password**: `Admin@123`
- **Artist Demo**: `elena@arthub.com` / `Artist@123`
- **User Demo**: `fahimhasan0867@gmail.com`

---

## 🎯 Purpose & Problem Solved
Traditional fine art distribution is often restricted to physical galleries, opaque auction systems, or high-barrier private viewings. ArtHub democratizes access to curated art by:
1. Enabling emerging and established artists to showcase and monetize their catalogs globally.
2. Offering collectors transparent pricing, high-resolution visual previews, and a secure checkout flow.
3. Implementing collector purchase tiers (Free, Pro, Premium) to balance marketplace bandwidth and collector volume.
4. Fostering trust through a verified-collector review system, ensuring only actual purchasers can review works.

---

## ✨ Key Features

### 1. Collector & Buyer Experience
- **Interactive Hero Carousel**: Smooth Embla carousel featuring high-resolution artwork slides with autoplay, slide indicators, and pause controls.
- **Dynamic Browse Artworks**: Search by title, artist, medium, or style with instant real-time filtering, price bounds (Min/Max), and server-side pagination.
- **Curated Detail Views**: High-resolution zoom views, medium specifications, physical dimensions, artist background, and live availability status.
- **Personal Wishlist**: Save favorite pieces to a dedicated wishlist page with one-click acquisition links.
- **Collector Tier Subscriptions**:
  - **Free**: Up to 3 original acquisitions
  - **Pro ($9.99/mo)**: Up to 9 original acquisitions
  - **Premium ($19.99/mo)**: Unlimited original acquisitions

### 2. Artist Studio Dashboard (`/dashboard/artist`)
- **Artwork Lifecycle CRUD**: Upload with imgBB image hosting, set mediums, dimensions, category, and pricing.
- **Inline Catalog Editing**: Real-time modal to update titles, prices, descriptions, and catalog status.
- **Sales Analytics**: Live revenue calculation, completed acquisition orders, and buyer email records.
- **Artist Statement**: Public portfolio bio and avatar customization.

### 3. Administrator Governance (`/dashboard/admin`)
- **User Role Management**: Elevate or adjust roles between User (Buyer), Artist, and Administrator on the fly.
- **Catalog Moderation**: Comprehensive artwork inventory with administrative removal and status oversight.
- **Transaction Ledger**: Complete audit log of artwork acquisitions and subscription upgrades.
- **Platform Analytics**: Total revenue, category donut charts, and monthly transaction trend graphs.

### 4. Verified Purchase Comment System
- Artwork details pages conditionally display a review form **only** to collectors who have completed a verified purchase of that specific artwork.
- Collectors can edit or delete their own feedback.

### 5. Seamless Payment Flow (Stripe Simulated)
- Secure checkout session generation validating buyer remaining quota based on subscription tier.
- Automatic "Sold" badge application and unpublishing upon completed acquisition.

---

## 📦 NPM Packages Used

| Package | Purpose |
| :--- | :--- |
| `next` (v16.3.5) | React framework with Turbopack for SSR, SSG, and App Router |
| `react` & `react-dom` | Core React component rendering |
| `better-auth` | Modern authentication system for session, credentials, and OAuth |
| `tailwindcss` | Utility-first CSS framework with tailored ArtHub design tokens |
| `recharts` | Responsive charting library for admin and artist analytics |
| `lucide-react` | Elegant icon set for navigation and interactive badges |
| `embla-carousel-react` | Lightweight, performant hero slider carousel |
| `react-toastify` | Interactive UI toasts for transactions, errors, and actions |
| `canvas-confetti` | Visual celebratory delight upon successful checkout completion |
| `@heroui/button` | Accessible, animated interactive buttons |

---

## 🔒 Environment Variables

Copy `.env.example` to `.env.local` for local development. For production,
configure the variables in the Vercel project settings; do not commit secrets.
`NEXT_PUBLIC_*` values are embedded in the client bundle at build time, so
redeploy after changing them.

## 🚀 Deploying to Vercel

1. Import this repository into Vercel. Keep the project root at the repository
   root and use the detected Next.js framework settings. The build command is
   `npm run build`; no static-export setting or custom start command is needed.
2. Add the production environment variables in **Project Settings → Environment
   Variables**:
   - `MONGO_URI`: production MongoDB connection string. Configure MongoDB network
     access for the Vercel deployment.
   - `BETTER_AUTH_SECRET`: a unique, random secret of at least 32 characters.
   - `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`: the same HTTPS URL for this
     Vercel deployment or custom domain.
   - `NEXT_PUBLIC_API_URL`: the HTTPS base URL of the deployed backend API
     (no trailing slash). The frontend requires the separate backend service.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: required for Google sign-in.
     Register `https://<your-domain>/api/auth/callback/google` as an authorized
     redirect URI in the Google OAuth client.
   - `IMGBB_API_KEY`: required for artwork image uploads.
   - `FRONTEND_URL`: optional; defaults to `NEXT_PUBLIC_APP_URL`, then
     `BETTER_AUTH_URL`. Set it to the same frontend HTTPS URL if using a custom
     frontend origin.
3. Configure the backend's frontend/CORS origin to the exact deployed frontend
   URL, then redeploy the Vercel project after all environment variables are
   set.
4. Verify sign-up/sign-in, Google OAuth, artwork browsing against the backend,
   image uploads, and checkout redirects on the deployed domain.

The application uses server routes for authentication and image uploads and
requires runtime server functionality; do not enable static export. Local
development can use the localhost defaults in `.env.example`.

## 🔐 JWT and role checks

Better Auth issues a short-lived JWT for signed-in users. Private frontend API
requests get that token from Better Auth and send it as
`Authorization: Bearer <token>`. The backend verifies its signature using the
public Better Auth JWKS endpoint and checks the user's current role in MongoDB.
The dashboard role guard improves navigation, but the backend remains the
security boundary.

New accounts can choose the collector or artist role. Admin privileges are
assigned only by an existing administrator from user management. The backend
allows collectors to manage their own profile, wishlist, purchases, and
comments; artists can additionally manage their own artworks and sales data;
administrators can manage platform-wide data.

For local development, set `BETTER_AUTH_URL` to the frontend origin in both
repositories. The backend also needs `FRONTEND_URL` for browser CORS and
`NEXT_PUBLIC_API_URL` on the frontend to point to the backend.

---

## 🚀 Getting Started Locally

```bash
# Terminal 1: from the backend repository root
cd path/to/arthub-project-server
npm install
npm run dev

# Terminal 2: from this client repository root
cd path/to/arthub-project-client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
The backend must stay running at `http://localhost:5000` while using the local app.
