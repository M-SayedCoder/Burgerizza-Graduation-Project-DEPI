const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');

try {
  require('dotenv').config();
} catch (e) {
  // Ignore dotenv loading if not installed
}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/burgeriza';

// Helper to hash passwords if bcryptjs or bcrypt is present, fallback to plain text if not.
let hashPassword = (password) => password;
try {
  const bcrypt = require('bcryptjs');
  hashPassword = (password) => bcrypt.hashSync(password, 10);
} catch (e) {
  try {
    const bcrypt = require('bcrypt');
    hashPassword = (password) => bcrypt.hashSync(password, 10);
  } catch (err) {
    console.log('Note: bcryptjs/bcrypt not detected. Seeding passwords in plain text.');
  }
}

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    // Clear existing collections
    console.log('Wiping existing data (User, MenuItem, Order, Reservation)...');
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Collections cleared.');

    // Seed Menu Items
    console.log('Seeding sample menu items...');
    const items = await MenuItem.insertMany([
      {
        name: 'Classic Cheeseburger',
        price: 9.99,
        description: 'Juicy beef patty, melted cheddar cheese, lettuce, tomato, pickles, and our signature burger sauce.',
        isAvailable: true
      },
      {
        name: 'BBQ Bacon Burger',
        price: 11.99,
        description: 'Smoky BBQ sauce, crispy bacon, onion rings, cheddar cheese, and a flame-grilled beef patty.',
        isAvailable: true
      },
      {
        name: 'Truffle Fries',
        price: 4.99,
        description: 'Golden fries tossed in white truffle oil, parmesan cheese, and fresh parsley.',
        isAvailable: true
      },
      {
        name: 'Vanilla Milkshake',
        price: 5.49,
        description: 'Creamy house-spun vanilla bean ice cream shake topped with whipped cream.',
        isAvailable: true
      }
    ]);
    console.log(`Seeded ${items.length} menu items.`);

    // Seed Users
    console.log('Seeding sample users...');
    const adminUser = await User.create({
      name: 'Burgerizza Admin',
      email: 'admin@burgeriza.com',
      password: hashPassword('admin123'),
      role: 'admin'
    });

    const managerUser = await User.create({
      name: 'Burgerizza Manager',
      email: 'manager@burgeriza.com',
      password: hashPassword('manager123'),
      role: 'manager'
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: hashPassword('john123'),
      role: 'customer'
    });

    const customer2 = await User.create({
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      password: hashPassword('alice123'),
      role: 'customer'
    });
    console.log('Seeded 4 users (1 Admin, 1 Manager, 2 Customers).');

    // Seed Orders
    console.log('Seeding sample orders...');
    const order1 = await Order.create({
      customer: customer1._id,
      items: [
        {
          menuItem: items[0]._id,
          quantity: 2,
          price: items[0].price
        },
        {
          menuItem: items[2]._id,
          quantity: 1,
          price: items[2].price
        }
      ],
      total: (items[0].price * 2) + items[2].price, // 24.97
      status: 'Confirmed'
    });

    const order2 = await Order.create({
      customer: customer2._id,
      items: [
        {
          menuItem: items[1]._id,
          quantity: 1,
          price: items[1].price
        },
        {
          menuItem: items[3]._id,
          quantity: 2,
          price: items[3].price
        }
      ],
      total: items[1].price + (items[3].price * 2), // 22.97
      status: 'Pending'
    });
    console.log('Seeded 2 orders.');

    // Seed Reservations
    console.log('Seeding sample reservations...');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const res1 = await Reservation.create({
      customer: customer1._id,
      date: today,
      time: '19:00',
      partySize: 4,
      notes: 'Window booth preferred.',
      status: 'Confirmed'
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const res2 = await Reservation.create({
      customer: customer2._id,
      date: tomorrow,
      time: '20:30',
      partySize: 2,
      notes: 'Anniversary dinner celebration.',
      status: 'Pending'
    });
    console.log('Seeded 2 reservations.');

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
};

seed();
