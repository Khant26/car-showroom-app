# Car Showroom API (backend branch)

Express + MongoDB API for the Car Showroom app. The React customer site and
`/admin` dashboard live on the `main` branch of this repository and talk to
this API through `VITE_API_URL` (e.g. `http://localhost:5001/api`).

Imported from `car-showroom-api` (branch `master`, 7fdab083).

**Live demo:** API at https://api-carshowroom.khantmaung.com (health: `/health`),
used by the site at https://carshowroom.khantmaung.com (admin at `/admin`).

## Run locally

```bash
npm install
cp .env.example .env      # then set MONGODB_URI, JWT_SECRET, CORS_ORIGIN, ADMIN_PASSWORD
npm run create-admin      # creates/replaces the admin account from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev               # or: npm start
```

Demo data: set `SEED_DEMO=1` and the server fills any **empty** collection
(banners, brands, cars, rentals, sold cars) with fictional demo content on
start-up; non-empty collections are never touched, so it is safe to leave on.
Manual: `npm run seed` (same, idempotent) or `node seeder.js --reset` (wipes
those collections first; users are kept).

## Tests

```bash
npm test
```

Smoke tests (Node's built-in test runner) need no database: health check,
404 handling, auth protection on admin routes, disabled admin bootstrap, CORS,
PUBLIC_URL handling and demo-data validation. Set `MONGODB_TEST_URI` to also run
the seed idempotency test against a real MongoDB (that database is dropped).

## Docker

```bash
docker build -t car-showroom-api .
docker run --env-file .env -p 5001:5001 -v showroom-uploads:/app/uploads car-showroom-api
```

The container runs as the non-root `node` user (uid 1000), listens on
`0.0.0.0:$PORT` (default 5001) and has a `HEALTHCHECK` on `/health`. Uploads go
to `UPLOAD_DIR` (default `/app/uploads`); use a named volume, or `chown 1000:1000`
a bind-mounted host directory. With MongoDB 7 in a sibling container on the same
network: `MONGODB_URI=mongodb://carshowroom:<password>@mongo:27017/carshowroom?authSource=admin`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret used to sign admin JWTs (server refuses to start without it) |
| `JWT_EXPIRE` | no | Token lifetime, default `30d` |
| `PORT` / `HOST` | no | Default `5001` / `0.0.0.0` |
| `CORS_ORIGIN` | prod | Comma-separated allowed origins, e.g. `https://carshowroom.khantmaung.com`. `FRONTEND_URL` / `ADMIN_URL` are still honoured. `localhost:5173/5174` are allowed outside production. |
| `PUBLIC_URL` | prod | Public base URL of this API, e.g. `https://api-carshowroom.khantmaung.com`. Upload responses (and sold-car images) get absolute URLs built from it; unset = `/uploads/...` paths |
| `SEED_DEMO` | no | `1` = seed fictional demo data into empty collections on start-up |
| `UPLOAD_DIR` | no | Where uploaded images are stored (default `./uploads`, served at `/uploads`) |
| `MAX_FILE_SIZE` | no | Max upload size in bytes (default 5 MB) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | for setup | If both are set and no user with that email exists, an admin is created on start-up (an existing password is never changed). Also used by `npm run create-admin` (replaces the account) and `npm run seed`. No default password |
| `ADMIN_NAME` | no | Display name for that admin (default `Demo Admin`) |
| `ALLOW_ADMIN_SETUP` | no | `true` enables `POST /api/auth/admin/create` (first admin only). Keep `false`. |
| `NODE_ENV` | no | `production` in deployments |

## Endpoints

- `GET /health`, `GET /api/health` — liveness (200 JSON, includes DB state)
- `POST /api/auth/admin/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `PUT /api/auth/change-password`
- `/api/banners`, `/api/brands`, `/api/cars`, `/api/sold-cars`, `/api/rentals` — public `GET`, admin-only writes
- `/api/upload/single|multiple?type=cars|brands|banners|rentals` (admin), `DELETE /api/upload/:type/:filename` (admin), `GET /api/upload/info/...`

See `apiNoteDetal.note` for request/response details.
