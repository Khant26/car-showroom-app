# Car Showroom

One React (Vite + Tailwind) app that contains both:

- the **customer showroom** at `/` (browse cars, car details, rentals, about, contact; multi-language), and
- the **admin dashboard** at `/admin` (manage banners, brands, cars, sold cars and rentals; requires admin login).

The admin dashboard used to live on the `admin` branch / the separate `car-showroom-admin` repository; it is now merged into `src/admin/` and code-split so customers never download it.

The Express + MongoDB API lives on the [`backend`](../../tree/backend) branch.

## Routes

| Path | Page |
|---|---|
| `/` | Home (banners, featured cars, brands) |
| `/cars` | Car list with filters (`?brand=` supported) |
| `/cars/:id` | Car detail |
| `/rental` | Rental cars / rental request |
| `/about` | About |
| `/contact` | Contact |
| `/admin/login` | Admin login (public) |
| `/admin` | Redirects to `/admin/banners` (protected) |
| `/admin/banners` | Manage banners (protected) |
| `/admin/brands` | Manage brands (protected) |
| `/admin/cars` | Manage cars (protected) |
| `/admin/sold-cars` | Manage sold cars (protected) |
| `/admin/rentals` | Manage rentals (protected) |
| anything else | 404 page (`/admin/<unknown>` redirects to `/admin/banners`) |

Admin auth: `POST /api/auth/admin/login` returns a JWT that is stored in `localStorage` (`adminToken`) and sent as `Authorization: Bearer …`. Any 401 from the API sends the admin back to `/admin/login`.

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored) and adjust:

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the API **including** `/api`. Used by both the customer site and the admin dashboard; image paths like `/uploads/...` are resolved against its origin. | `http://localhost:5001/api` |

`VITE_*` values are embedded into the public JS bundle at build time, so never put secrets in them.

## Run locally

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev                  # http://localhost:5173 and http://localhost:5173/admin
```

Start the API from the `backend` branch (defaults to port 5001) so the app has data.

## Build and checks

```bash
npm run lint
npm run build      # outputs dist/
npm run preview
```

## Deploy (Vercel)

`vercel.json` rewrites every non-file path to `index.html`, so deep links such as `/cars/123` or `/admin/cars` work after a refresh. Set `VITE_API_URL` in the Vercel project settings and add the deployed site's origin to the API's `FRONTEND_URL` / `ADMIN_URL` (CORS).

## Project layout

```
src/
  App.jsx            root router: /admin/* -> admin app, everything else -> customer layout
  config/api.js      single API base URL (VITE_API_URL) shared by both apps
  components/ pages/ context/ services/ translations/ utils/   customer site
  admin/
    AdminApp.jsx     admin routes + auth guards (mounted at /admin/*)
    admin.css        admin-only styles (scoped)
    components/ context/ pages/ services/
```
