const app = require('../app');
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');

try {
  require('dotenv').config();
} catch (e) {}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/burgeriza';

const logTest = (name, passed, details = '') => {
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} ${details ? '- ' + details : ''}`);
  if (!passed) {
    process.exitCode = 1;
  }
};

const runTests = async () => {
  let server;
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully. Wiping inventory collection...');
    await Inventory.deleteMany({});

    // Start Express server
    server = app.listen(0);
    const port = server.address().port;
    const BASE_URL = `http://localhost:${port}/api/inventory`;

    // Seed mock data
    const item = await Inventory.create({
      name: 'Burger Buns',
      category: 'Bakery',
      unit: 'piece',
      quantity: 10,
      minimumStock: 20,
      supplier: 'Daily Bread',
      isActive: true
    });

    console.log('=== Running Extended Inventory Routes Tests ===');

    // --- 1. JWT Authentication Checks ---
    // Change NODE_ENV temporarily to production to enforce strict JWT checks
    const oldNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.ALLOW_AUTH_BYPASS = 'false';

    let res = await fetch(BASE_URL, {
      method: 'GET'
      // No Authorization header provided
    });
    let data = await res.json();
    logTest('GET /api/inventory (Missing Authorization header - 401)', res.status === 401 && !data.success);

    res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid.jwt.token'
      }
    });
    data = await res.json();
    logTest('GET /api/inventory (Invalid JWT Token - 401)', res.status === 401 && !data.success);

    // Restore environment
    process.env.NODE_ENV = oldNodeEnv;
    process.env.ALLOW_AUTH_BYPASS = 'true';

    // --- 2. Role Authorization Checks ---
    // Customer access lists (should be forbidden on inventory endpoints)
    res = await fetch(BASE_URL, {
      headers: {
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d16',
        'x-user-role': 'customer'
      }
    });
    data = await res.json();
    logTest('GET /api/inventory (Customer role - 403 Forbidden)', res.status === 403 && !data.success);

    // Manager access low-stock (should be allowed)
    res = await fetch(`${BASE_URL}/low-stock`, {
      headers: {
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d15',
        'x-user-role': 'manager'
      }
    });
    data = await res.json();
    logTest('GET /api/inventory/low-stock (Manager role - 200 Success)', res.status === 200 && data.success);

    // Manager create item (should be blocked)
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d15',
        'x-user-role': 'manager'
      },
      body: JSON.stringify({
        name: 'Pickles',
        unit: 'pack',
        quantity: 10,
        minimumStock: 2
      })
    });
    data = await res.json();
    logTest('POST /api/inventory (Manager role - 403 Forbidden)', res.status === 403 && !data.success);

    // --- 3. Validator Execution Checks ---
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d14',
        'x-user-role': 'admin'
      },
      body: JSON.stringify({
        name: 'Pickles',
        unit: 'invalid-unit-type',
        quantity: 10,
        minimumStock: 2
      })
    });
    data = await res.json();
    logTest('POST /api/inventory (Validator checks invalid enum - 400)', res.status === 400 && data.message.includes('Invalid unit'));

    // --- 4. Invalid ObjectId format ---
    res = await fetch(`${BASE_URL}/invalid-object-id`, {
      headers: {
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d14',
        'x-user-role': 'admin'
      }
    });
    data = await res.json();
    logTest('GET /api/inventory/:id (Invalid ObjectId - 400)', res.status === 400 && !data.success);

    // --- 5. Unknown route catch-all ---
    res = await fetch(`${BASE_URL}/some/unexpected/subpath`, {
      headers: {
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d14',
        'x-user-role': 'admin'
      }
    });
    data = await res.json();
    logTest('Catch-all unknown subpath (404)', res.status === 404 && data.message === 'Resource not found');

    // --- 6. Security Checks ---
    // NoSQL query operator injection inside body
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d14',
        'x-user-role': 'admin'
      },
      body: JSON.stringify({
        name: { $ne: 'hacked' }, // object payload injection
        unit: 'piece',
        quantity: 10,
        minimumStock: 2
      })
    });
    data = await res.json();
    logTest('POST /api/inventory (NoSQL Injection in body - 400)', res.status === 400 && !data.success);

    // --- 7. Performance & Edge Case Checks ---
    // Sort performance check
    res = await fetch(`${BASE_URL}?sortBy=quantity&order=asc`, {
      headers: {
        'x-user-id': '60c72b2f9b1d8b2a3c8e4d14',
        'x-user-role': 'admin'
      }
    });
    data = await res.json();
    logTest('GET /api/inventory (Sort performance - 200)', res.status === 200 && data.success);

    console.log('=== Routes Tests Concluded ===\n');
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  }
};

runTests();
