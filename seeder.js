// Manual seeding:  node seeder.js          -> fill empty collections + admin (idempotent)
//                  node seeder.js --reset  -> wipe banners/brands/cars/rentals/sold cars first
// On a server you normally just set SEED_DEMO=1 and let server.js do this on start-up.
require('dotenv').config();
const mongoose = require('mongoose');
const Banner = require('./models/Banner');
const Brand = require('./models/Brand');
const Car = require('./models/Car');
const Rental = require('./models/Rental');
const SoldCar = require('./models/SoldCar');
const { seedDemo, ensureAdmin } = require('./seed');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carshowroom_new';

const main = async () => {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected for seeding');

  if (process.argv.includes('--reset')) {
    for (const Model of [Banner, Brand, Car, Rental, SoldCar]) {
      await Model.deleteMany({});
    }
    console.log('Cleared banners, brands, cars, rentals and sold cars (users kept)');
  }

  await ensureAdmin();
  const inserted = await seedDemo();
  console.log('Done:', inserted);
};

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
