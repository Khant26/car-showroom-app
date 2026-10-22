# Car Showroom API (backend branch)

Express + MongoDB API for the Car Showroom app. The React customer site and
`/admin` dashboard live on the `main` branch of this repository and talk to
this API through `VITE_API_URL` (e.g. `http://localhost:5001/api`).

Imported from `car-showroom-api` (branch `master`, 7fdab083).

## Run locally

```bash
npm install
cp .env.example .env      # then set MONGODB_URI, JWT_SECRET, CORS_ORIGIN, ADMIN_PASSWORD
npm run create-admin      # creates/replaces the admin account from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev               # or: npm start
```

Optional sample data: `node seeder.js` (wipes and reseeds banners, brands, cars and the admin user).

## Tests

```bash
npm test
```

Smoke tests (Node's built-in test runner) need no database: health check,
404 handling, auth protection on admin routes, disabled admin bootstrap, CORS.

## Docker

```bash
docker build -t car-showroom-api .
docker run --env-file .env -p 5001:5001 -v showroom-uploads:/app/uploads car-showroom-api
```

The container listens on `0.0.0.0:$PORT` (default 5001) and has a `HEALTHCHECK` on `/health`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret used to sign admin JWTs (server refuses to start without it) |
| `JWT_EXPIRE` | no | Token lifetime, default `30d` |
| `PORT` / `HOST` | no | Default `5001` / `0.0.0.0` |
| `CORS_ORIGIN` | prod | Comma-separated allowed origins (e.g. your Vercel URL). `FRONTEND_URL` / `ADMIN_URL` are still honoured. `localhost:5173/5174` are allowed outside production. |
| `UPLOAD_DIR` | no | Where uploaded images are stored (default `./uploads`, served at `/uploads`) |
| `MAX_FILE_SIZE` | no | Max upload size in bytes (default 5 MB) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | for setup | Used by `create-admin.js` and `seeder.js` (no default password) |
| `ALLOW_ADMIN_SETUP` | no | `true` enables `POST /api/auth/admin/create` (first admin only). Keep `false`. |
| `NODE_ENV` | no | `production` in deployments |

## Endpoints

- `GET /health`, `GET /api/health` — liveness (200 JSON, includes DB state)
- `POST /api/auth/admin/login`, `GET /api/auth/me`, `PUT /api/auth/profile`, `PUT /api/auth/change-password`
- `/api/banners`, `/api/brands`, `/api/cars`, `/api/sold-cars`, `/api/rentals` — public `GET`, admin-only writes
- `/api/upload/single|multiple?type=cars|brands|banners|rentals` (admin), `DELETE /api/upload/:type/:filename` (admin), `GET /api/upload/info/...`

See `apiNoteDetal.note` for request/response details.
