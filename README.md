# Luxe Reserve

A full-stack hotel booking application. Browse a curated collection of stays,
search by location and guest count, reserve dates, manage your itinerary on a
calendar, and rate the places you've actually stayed.

Built with React 19, TypeScript, Tailwind CSS v4, Express 5 and MongoDB.

---

## Features

**Guest-facing**

- 12-property collection with search by location, plus sort (price, rating) and
  filters for price range, guest capacity, style tags and deals-only — all synced
  to the URL, so any filtered view is shareable and survives a refresh
- Image gallery per property with thumbnail strip, keyboard-navigable lightbox
  and arrow-key paging
- Deals page with dynamic category filtering and discount-ranked layout
- Booking flow with date-range validation, live nightly-total calculation,
  capacity checks and duplicate-overlap detection
- Trip management in two views: an itinerary list and a real month calendar with
  multi-trip spans and month navigation
- Written reviews from verified guests only — one per guest per property,
  editable and deletable, with the average recomputed server-side
- Saved stays (favourites) with optimistic updates
- Native share sheet / clipboard fallback per property
- Contact form persisted server-side
- Toast notifications for booking, cancellation and save actions

**Accounts**

- Email + password registration with a verification step before first sign-in
- Password reset over a single-use, hashed, 1-hour token that revokes all other
  sessions on completion
- Google OAuth sign-in, which links to an existing local account rather than
  replacing it. Fully optional — omit the client ID and the rest of the app is
  unaffected
- Short-lived access tokens held in memory, paired with a rotating HTTP-only
  refresh cookie
- Single-flight token refresh on `401`, with a server-side rotation grace window
  so concurrent tabs can't invalidate each other's session

**Engineering**

- One design-token system driving every colour, type step, radius and shadow
- Reusable component library (`src/components/ui`) — no page hardcodes a hex value
- Route-level code splitting plus vendor chunk splitting; the app chunk is ~129 kB
  (44 kB gzipped) with React, Framer Motion and TanStack Query cached separately
- Full keyboard navigation, associated form labels, visible focus rings, and
  `prefers-reduced-motion` support throughout
- Zod validation on both sides of the wire, with password rules declared once
- Strict TypeScript, clean ESLint, zero `any` in application code
- 105 unit tests (Vitest) over calendar maths, formatters, filter/sort behaviour,
  request schemas and refresh-token rotation
- GitHub Actions CI running lint, typecheck, test and build for both packages,
  plus CodeQL and a dependency audit

---

## Tech stack

| Layer     | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7                |
| State     | TanStack Query (server state), React Context (session)                     |
| Forms     | React Hook Form + Zod                                                      |
| Animation | Framer Motion                                                              |
| Backend   | Node.js, Express 5, TypeScript                                             |
| Database  | MongoDB via Mongoose 9                                                     |
| Auth      | JWT access tokens, rotating refresh cookies, bcrypt, Google OAuth          |
| Security  | Helmet with an explicit CSP, CORS allow-list, tiered rate limiting          |

---

## Getting started

### Prerequisites

- Node.js 20 or newer
- A running MongoDB instance (local, or a MongoDB Atlas connection string)

### 1. Install dependencies

```bash
cd backend && npm install && cd ../frontend && npm install
```

### 2. Configure the environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Then generate the two JWT secrets and paste them into `backend/.env`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be different values. The server
validates its environment at boot and **refuses to start in production** if
either is missing or shorter than 32 characters.

Google sign-in is optional — leave `GOOGLE_CLIENT_ID` / `VITE_GOOGLE_CLIENT_ID`
blank and the rest of the app works normally.

### 3. Run both servers

On Windows:

```bash
./start.bat
```

Or in two terminals:

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` to the backend on
port `5000`.

On first boot the backend seeds a handful of sample destinations. Seeding is
skipped whenever the collection already holds data, so restarts never clobber
your bookings or ratings.

---

## Scripts

Run from `frontend/` or `backend/`.

| Script              | Effect                                     |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start in watch mode                        |
| `npm run build`     | Typecheck and build for production         |
| `npm run typecheck` | Typecheck only                             |
| `npm run lint`      | ESLint (frontend)                          |
| `npm start`         | Run the compiled backend from `dist/`      |

### Production build

```bash
cd frontend && npm run build && cd ../backend && npm run build && npm start
```

Express serves the built SPA from `frontend/dist`, so a single process covers
both the API and the client.

---

## Project layout

```
backend/src
├── config/          # Environment schema, database connection
├── controllers/     # HTTP request/response handling
├── services/        # Business logic and data access
├── models/          # Mongoose schemas
├── middlewares/     # Auth, error handling, rate limiting
├── routes/          # Route definitions
└── utils/           # Tokens, validation schemas, HttpError, seed data

frontend/src
├── components
│   ├── auth/        # Session provider, route guard, auth UI
│   ├── destinations/# Search bar
│   ├── home/        # Landing page sections
│   ├── layout/      # Navbar, footer, error boundary
│   ├── trips/       # Trip calendar
│   └── ui/          # Reusable primitives — Button, Card, Field, …
├── config/          # Brand and navigation constants
├── lib/             # API hooks, axios client, formatters, calendar maths
├── pages/           # Route components (lazy-loaded)
└── types/           # Shared API types
```

---

## API

All routes are prefixed with `/api`. 🔒 marks routes requiring a bearer token.

| Method   | Route                  | Purpose                                     |
| -------- | ---------------------- | ------------------------------------------- |
| `GET`    | `/health`              | Liveness probe                              |
| `GET`    | `/explore`             | List all destinations                       |
| `GET`    | `/explore/:id`         | Single destination                          |
| `POST`   | `/explore/:id/rate`    | 🔒 Rate a destination you've booked         |
| `GET`    | `/deals`               | List discounted destinations                |
| `GET`    | `/trips`               | 🔒 List your trips                          |
| `POST`   | `/trips`               | 🔒 Create a booking                         |
| `DELETE` | `/trips/:id`           | 🔒 Cancel a booking                         |
| `GET`    | `/favorites`           | 🔒 Saved stays, as full records             |
| `GET`    | `/favorites/ids`       | 🔒 Saved stay ids only                      |
| `PUT`    | `/favorites/:id`       | 🔒 Save a stay (idempotent)                 |
| `DELETE` | `/favorites/:id`       | 🔒 Unsave a stay                            |
| `POST`   | `/contact`             | Submit a contact enquiry                    |
| `POST`   | `/auth/register`       | Create an account                           |
| `POST`   | `/auth/login`          | Sign in                                     |
| `POST`   | `/auth/google`         | Sign in with a Google access token          |
| `POST`   | `/auth/verify-email`   | Confirm an email address                    |
| `POST`   | `/auth/forgot-password`| Request a password reset link                |
| `POST`   | `/auth/reset-password` | Set a new password from a reset token        |
| `POST`   | `/auth/refresh`        | Rotate the session and issue an access token|
| `POST`   | `/auth/logout`         | Revoke the current session                  |
| `GET`    | `/auth/me`             | 🔒 Current user                             |

Reviews replace the old `POST /explore/:id/rate`; ratings and prose are submitted
together.

### Email in development

There is no mail provider wired up. Registration logs the verification link to
the backend console — copy it into your browser to activate an account.

---

## Design system

Tokens live in `frontend/src/index.css` under `@theme`, and Tailwind generates
utilities from them. Two rules matter:

- **`gold` (`#8B6B10`)** is the text-safe brand accent at 4.9:1 on white. Use it
  for links, eyebrow labels, icons and active states.
- **`amber` (`#FFB800`)** is **decorative only** — 1.8:1 on the canvas, so it
  must never carry text. It's for the hero bars, dot grids and star fills.

Everything else (`ink`, `canvas`, `surface`, `line`, and their variants) follows
the same semantic naming. Add a token rather than reaching for a raw hex value.

---

## Notes and known limitations

- **No availability calendar.** `Destination` has no per-date inventory, so the
  search form's dates are carried into the booking form rather than used as a
  filter. Real availability would need an inventory model.
- **No payment processing.** Bookings are created with status `Processing`; the
  UI is explicit that no card is charged.
- **Tests are unit-level.** 105 tests cover the pure logic and request schemas.
  There is no integration suite hitting a live database, and no browser/E2E layer;
  those would be the next additions. The CI workflow already provisions a MongoDB
  service so integration tests can be dropped in without touching the pipeline.
- **No mail provider.** `services/mailer.service.ts` is a single seam — swap the
  body of `deliver` for Resend/SendGrid/SES. In development, verification and
  reset links are printed to the backend console; in production the service logs
  loudly rather than silently dropping account-critical mail.
- **Hero image is ~800 kB.** Converting `src/images/hero_pool.png` to WebP/AVIF
  would cut the largest contentful paint substantially.
- **Sample imagery is remote** (Unsplash and Google-hosted URLs). Those links can
  expire; `SmartImage` degrades to a labelled placeholder rather than a broken
  layout when they do.
