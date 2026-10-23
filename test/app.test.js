// Smoke tests that run without a MongoDB server.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret";
process.env.CORS_ORIGIN = "https://carshowroom.khantmaung.com";

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const app = require("../app");

// Fail fast instead of buffering model queries while no DB is connected.
mongoose.set("bufferCommands", false);

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test("GET /health returns 200 JSON", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "OK");
});

test("GET /api/health returns 200", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
});

test("unknown routes return 404 JSON", async () => {
  const res = await fetch(`${base}/api/does-not-exist`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).success, false);
});

test("admin-only routes reject requests without a token", async () => {
  for (const [method, path] of [
    ["POST", "/api/cars"],
    ["POST", "/api/upload/single"],
    ["DELETE", "/api/upload/cars/x.png"],
    ["DELETE", "/api/sold-cars/123"],
  ]) {
    const res = await fetch(`${base}${path}`, { method });
    assert.equal(res.status, 401, `${method} ${path}`);
  }
});

test("admin bootstrap endpoint is disabled by default", async () => {
  const res = await fetch(`${base}/api/auth/admin/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "x", email: "a@b.co", password: "123456" }),
  });
  assert.equal(res.status, 403);
});

test("disallowed CORS origins are rejected", async () => {
  const res = await fetch(`${base}/health`, {
    headers: { Origin: "https://evil.example.com" },
  });
  assert.equal(res.status, 403);
});

test("configured CORS origin is allowed", async () => {
  const res = await fetch(`${base}/health`, {
    headers: { Origin: "https://carshowroom.khantmaung.com" },
  });
  assert.equal(res.status, 200);
  assert.equal(
    res.headers.get("access-control-allow-origin"),
    "https://carshowroom.khantmaung.com"
  );
});

test("toPublicUrl uses PUBLIC_URL when set", () => {
  const { toPublicUrl } = require("../utils/publicUrl");
  const prev = process.env.PUBLIC_URL;
  try {
    delete process.env.PUBLIC_URL;
    assert.equal(toPublicUrl("/uploads/cars/a.jpg"), "/uploads/cars/a.jpg");
    process.env.PUBLIC_URL = "https://api-carshowroom.khantmaung.com/";
    assert.equal(
      toPublicUrl("/uploads/cars/a.jpg"),
      "https://api-carshowroom.khantmaung.com/uploads/cars/a.jpg"
    );
  } finally {
    if (prev === undefined) delete process.env.PUBLIC_URL;
    else process.env.PUBLIC_URL = prev;
  }
});

test("regex helpers escape user input", () => {
  const { exactInsensitive } = require("../utils/regex");
  assert.ok(exactInsensitive("Mercedes-Benz").test("mercedes-benz"));
  assert.ok(!exactInsensitive(".*").test("anything"));
});

test("demo data passes model validation", async () => {
  const data = require("../seed/demoData");
  const models = {
    banners: require("../models/Banner"),
    brands: require("../models/Brand"),
    cars: require("../models/Car"),
    rentals: require("../models/Rental"),
    soldCars: require("../models/SoldCar"),
  };
  for (const [key, Model] of Object.entries(models)) {
    assert.ok(data[key].length > 0, key);
    for (const doc of data[key]) {
      await new Model(doc).validate();
    }
  }
  const brandNames = new Set(data.brands.map((b) => b.name));
  for (const car of data.cars) assert.ok(brandNames.has(car.brand), car.name);
});
