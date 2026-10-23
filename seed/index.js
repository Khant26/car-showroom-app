// Demo seeding and admin bootstrap. Both are idempotent:
// - seedDemo() fills each collection only when it is empty, so restarts and
//   admin edits are never overwritten.
// - ensureAdmin() creates the ADMIN_EMAIL account only if no user with that
//   email exists; it never resets an existing password.
const User = require("../models/User");
const Banner = require("../models/Banner");
const Brand = require("../models/Brand");
const Car = require("../models/Car");
const Rental = require("../models/Rental");
const SoldCar = require("../models/SoldCar");
const data = require("./demoData");

const isTruthy = (v) => ["1", "true", "yes", "on"].includes(String(v || "").trim().toLowerCase());

const fillIfEmpty = async (Model, docs, log) => {
  const existing = await Model.estimatedDocumentCount();
  if (existing > 0) {
    log(`seed: ${Model.collection.name} has ${existing} document(s), skipped`);
    return 0;
  }
  await Model.insertMany(docs);
  log(`seed: inserted ${docs.length} ${Model.collection.name}`);
  return docs.length;
};

const seedDemo = async ({ log = console.log } = {}) => {
  const inserted = {
    banners: await fillIfEmpty(Banner, data.banners, log),
    brands: await fillIfEmpty(Brand, data.brands, log),
    cars: await fillIfEmpty(Car, data.cars, log),
    rentals: await fillIfEmpty(Rental, data.rentals, log),
    soldCars: await fillIfEmpty(SoldCar, data.soldCars, log),
  };

  // Keep Brand.carCount in sync with whatever cars exist now.
  if (inserted.brands || inserted.cars) {
    for (const brand of await Brand.find({}, "name")) {
      const carCount = await Car.countDocuments({ brand: brand.name });
      await Brand.updateOne({ _id: brand._id }, { carCount });
    }
  }
  return inserted;
};

const ensureAdmin = async ({ log = console.log } = {}) => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) {
    log("admin: ADMIN_EMAIL / ADMIN_PASSWORD not set, skipped");
    return false;
  }
  if (await User.exists({ email })) {
    log(`admin: ${email} already exists, left unchanged`);
    return false;
  }
  await User.create({
    name: process.env.ADMIN_NAME || "Demo Admin",
    email,
    password,
    role: "admin",
    isActive: true,
  });
  log(`admin: created ${email}`);
  return true;
};

// Called from server.js after MongoDB connects.
const runStartupTasks = async ({ log = console.log } = {}) => {
  await ensureAdmin({ log });
  if (isTruthy(process.env.SEED_DEMO)) {
    await seedDemo({ log });
  }
};

module.exports = { seedDemo, ensureAdmin, runStartupTasks, isTruthy };
