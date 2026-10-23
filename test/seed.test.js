// Integration test against a real MongoDB. Skipped unless MONGODB_TEST_URI is
// set, e.g. MONGODB_TEST_URI=mongodb://localhost:27017/carshowroom_test npm test
// WARNING: the target database is dropped.
process.env.NODE_ENV = "test";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const uri = process.env.MONGODB_TEST_URI;
const opts = { skip: !uri && "MONGODB_TEST_URI not set" };

before(async () => {
  if (!uri) return;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await mongoose.connection.dropDatabase();
});

after(async () => {
  if (!uri) return;
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

test("seedDemo fills empty collections once and is idempotent", opts, async () => {
  const { seedDemo, ensureAdmin } = require("../seed");
  const Car = require("../models/Car");
  const Brand = require("../models/Brand");
  const User = require("../models/User");
  const quiet = () => {};

  process.env.ADMIN_EMAIL = "demo-admin@example.com";
  process.env.ADMIN_PASSWORD = "test-password-123";

  const first = await seedDemo({ log: quiet });
  assert.ok(first.cars > 0 && first.brands > 0 && first.banners > 0 && first.rentals > 0);
  assert.equal(await ensureAdmin({ log: quiet }), true);

  const carCount = await Car.countDocuments();
  const second = await seedDemo({ log: quiet });
  assert.deepEqual(Object.values(second), [0, 0, 0, 0, 0]);
  assert.equal(await Car.countDocuments(), carCount);
  assert.equal(await ensureAdmin({ log: quiet }), false);
  assert.equal(await User.countDocuments({ role: "admin" }), 1);

  const brand = await Brand.findOne({ name: "Kestrel" });
  assert.equal(brand.carCount, await Car.countDocuments({ brand: "Kestrel" }));
});
