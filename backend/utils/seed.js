const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');

try {
  require('dotenv').config();
} catch (e) {
  // Ignore dotenv loading if not installed
}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/burgerizza';

// Helper to hash passwords
let hashPassword = (password) => password;
try {
  const bcrypt = require('bcryptjs');
  hashPassword = (password) => bcrypt.hashSync(password, 10);
} catch (e) {
  console.log('Note: bcryptjs not detected. Seeding passwords in plain text.');
}

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    // Clear existing collections
    console.log('Wiping existing data (User, MenuItem, Order, Reservation, Inventory, Notification)...');
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});
    await Reservation.deleteMany({});
    await Inventory.deleteMany({});
    await Notification.deleteMany({});
    console.log('Collections cleared.');

    // Seed Menu Items
    console.log('Seeding sample menu items...');
    const items = await MenuItem.insertMany([
      {
        name: 'Classic Cheeseburger',
        price: 120.00,
        description: 'Juicy beef patty, melted cheddar cheese, lettuce, tomato, pickles, and our signature burger sauce.',
        category: 'Burger',
        imageUrl: 'http://localhost:5000/uploads/classic_cheeseburger.jpg',
        isAvailable: true
      },
      {
        name: 'BBQ Bacon Burger',
        price: 150.00,
        description: 'Smoky BBQ sauce, crispy bacon, onion rings, cheddar cheese, and a flame-grilled beef patty.',
        category: 'Burger',
        imageUrl: 'http://localhost:5000/uploads/bbq_bacon_burger.jpg',
        isAvailable: true
      },
      {
        name: 'Truffle Fries',
        price: 45.00,
        description: 'Golden fries tossed in white truffle oil, parmesan cheese, and fresh parsley.',
        category: 'Sides',
        imageUrl: 'http://localhost:5000/uploads/truffle_fries.jpg',
        isAvailable: true
      },
      {
        name: 'Vanilla Milkshake',
        price: 50.00,
        description: 'Creamy house-spun vanilla bean ice cream shake topped with whipped cream.',
        category: 'Drinks',
        imageUrl: 'http://localhost:5000/uploads/vanilla_milkshake.jpg',
        isAvailable: true
      }
    ]);
    console.log(`Seeded ${items.length} menu items.`);

    // Seed Users (using password and phone)
    console.log('Seeding sample users...');
    const adminUser = await User.create({
      name: 'Burgerizza Admin',
      email: 'admin@burgeriza.com',
      password: hashPassword('admin123'),
      role: 'admin',
      phone: '01012345678'
    });

    const managerUser = await User.create({
      name: 'Burgerizza Manager',
      email: 'manager@burgeriza.com',
      password: hashPassword('manager123'),
      role: 'manager',
      phone: '01112345678'
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: hashPassword('john123'),
      role: 'customer',
      phone: '01212345678'
    });

    const customer2 = await User.create({
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      password: hashPassword('alice123'),
      role: 'customer',
      phone: '01512345678'
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
      total: (items[0].price * 2) + items[2].price, // 285.00
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
      total: items[1].price + (items[3].price * 2), // 250.00
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

    // Seed Inventory Items
    console.log('Seeding sample inventory items...');
    await Inventory.create([
      {
        name: 'Beef Patty',
        category: 'Meat',
        unit: 'piece',
        quantity: 150,
        minimumStock: 50,
        supplier: 'Premium Meat Co.',
        costPerUnit: 25,
        isActive: true
      },
      {
        name: 'Cheddar Cheese',
        category: 'Dairy',
        unit: 'kg',
        quantity: 15,
        minimumStock: 5,
        supplier: 'Dairy Farms',
        costPerUnit: 180,
        isActive: true
      },
      {
        name: 'Burger Bun',
        category: 'Bakery',
        unit: 'piece',
        quantity: 180,
        minimumStock: 40,
        supplier: 'Golden Bakery',
        costPerUnit: 3,
        isActive: true
      },
      {
        name: 'Truffle Oil',
        category: 'Other',
        unit: 'litre',
        quantity: 2,
        minimumStock: 3, // Low stock on seed!
        supplier: 'Gourmet Imports',
        costPerUnit: 600,
        isActive: true
      }
    ]);
    console.log('Seeded 4 inventory items.');

    // Seed Notifications
    console.log('Seeding sample notifications...');
    await Notification.create([
      {
        title: 'New Order Received',
        message: `Customer John Doe placed a new order of ${order2.total} EGP`,
        type: 'order',
        isRead: false,
        link: `/orders/${order2._id}`
      },
      {
        title: 'Table Reservation Request',
        message: 'Alice Smith requested a table for 2 guests on tomorrow at 20:30',
        type: 'reservation',
        isRead: false,
        link: `/reservations`
      },
      {
        title: 'Low Stock Alert: Truffle Oil',
        message: 'Truffle Oil has fallen below its minimum stock of 3 litres.',
        type: 'alert',
        isRead: false,
        link: `/inventory`
      }
    ]);
    console.log('Seeded 3 notifications.');

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
};

seed();
