const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');

try {
  require('dotenv').config();
} catch (e) {}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/burgeriza';
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const logTest = (name, passed, details = '') => {
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} ${details ? '- ' + details : ''}`);
  if (!passed) {
    process.exitCode = 1;
  }
};

const runTests = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Fetch seeded data
    const admin = await User.findOne({ role: 'admin' });
    const manager = await User.findOne({ role: 'manager' });
    const customer1 = await User.findOne({ email: 'john@gmail.com' });
    const customer2 = await User.findOne({ email: 'alice@gmail.com' });
    const menuItems = await MenuItem.find();
    
    if (!admin || !manager || !customer1 || !customer2 || menuItems.length === 0) {
      console.error('Seeded data missing. Please seed database first.');
      process.exit(1);
    }

    console.log('\n--- STARTING TESTS ---\n');

    // ==========================================
    // ORDERS MODULE TESTS
    // ==========================================
    console.log('--- Orders Module ---');

    // Test POST /api/orders - Valid Order
    let res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        items: [
          { menuItem: menuItems[0]._id.toString(), quantity: 2 },
          { menuItem: menuItems[2]._id.toString(), quantity: 1 }
        ]
      })
    });
    let data = await res.json();
    if (res.status !== 201 || !data.success) {
      console.log('DEBUG Valid Order POST Failed. Status:', res.status, 'Response:', data);
    }
    logTest('POST /api/orders (Valid)', res.status === 201 && data.success && data.data.total === (menuItems[0].price * 2 + menuItems[2].price), `Total: ${data.data?.total}`);
    const validOrderId = data.data?._id;

    // Test POST /api/orders - Reject empty items
    res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({ items: [] })
    });
    data = await res.json();
    logTest('POST /api/orders (Reject empty items)', res.status === 400 && !data.success, `Status: ${res.status}`);

    // Test POST /api/orders - Reject invalid ObjectIds
    res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        items: [
          { menuItem: 'invalid-id', quantity: 1 }
        ]
      })
    });
    data = await res.json();
    logTest('POST /api/orders (Reject invalid ObjectId)', res.status === 400 && !data.success, `Status: ${res.status}`);

    // Test POST /api/orders - Reject invalid quantities (negative)
    res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        items: [
          { menuItem: menuItems[0]._id.toString(), quantity: -1 }
        ]
      })
    });
    data = await res.json();
    logTest('POST /api/orders (Reject negative quantity)', res.status === 400 && !data.success, `Status: ${res.status}`);

    // Test POST /api/orders - Reject invalid quantities (decimal)
    res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        items: [
          { menuItem: menuItems[0]._id.toString(), quantity: 1.5 }
        ]
      })
    });
    data = await res.json();
    logTest('POST /api/orders (Reject decimal quantity)', res.status === 400 && !data.success, `Status: ${res.status}`);

    // Test POST /api/orders - Reject invalid quantities (not a number)
    res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        items: [
          { menuItem: menuItems[0]._id.toString(), quantity: 'two' }
        ]
      })
    });
    data = await res.json();
    logTest('POST /api/orders (Reject non-number quantity)', res.status === 400 && !data.success, `Status: ${res.status}`);

    // Test GET /api/orders - Pagination and Sorting (manager)
    res = await fetch(`${BASE_URL}/orders?page=1&limit=1&sort=-createdAt`, {
      headers: {
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      }
    });
    data = await res.json();
    logTest('GET /api/orders (Pagination & Metadata)', res.status === 200 && data.success && data.data.pagination && data.data.pagination.limit === 1, `Limit: ${data.data?.pagination?.limit}`);

    // Test GET /api/orders - Search by customer name
    res = await fetch(`${BASE_URL}/orders?search=john`, {
      headers: {
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      }
    });
    data = await res.json();
    let johnOrdersCount = data.data.orders.length;
    let allJohn = data.data.orders.every(o => o.customer.name.toLowerCase().includes('john'));
    logTest('GET /api/orders (Search by customer name)', res.status === 200 && allJohn && johnOrdersCount > 0, `Found: ${johnOrdersCount}`);

    // Test GET /api/orders - Search by order ID
    res = await fetch(`${BASE_URL}/orders?search=${validOrderId}`, {
      headers: {
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      }
    });
    data = await res.json();
    logTest('GET /api/orders (Search by order ID)', res.status === 200 && data.data.orders.length === 1 && data.data.orders[0]._id === validOrderId);

    // Test GET /api/orders/:id - Customer own order
    res = await fetch(`${BASE_URL}/orders/${validOrderId}`, {
      headers: {
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      }
    });
    data = await res.json();
    logTest('GET /api/orders/:id (Customer own)', res.status === 200 && data.success && data.data._id === validOrderId);

    // Test GET /api/orders/:id - Customer other order (access denied)
    res = await fetch(`${BASE_URL}/orders/${validOrderId}`, {
      headers: {
        'x-user-id': customer2._id.toString(),
        'x-user-role': 'customer'
      }
    });
    data = await res.json();
    logTest('GET /api/orders/:id (Customer other - 403)', res.status === 403 && !data.success);

    // Test GET /api/orders/:id - Invalid ID (400)
    res = await fetch(`${BASE_URL}/orders/invalid-id`, {
      headers: {
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      }
    });
    data = await res.json();
    logTest('GET /api/orders/:id (Invalid ID - 400)', res.status === 400 && !data.success);

    // Test PUT /api/orders/:id/status - Valid status (manager)
    res = await fetch(`${BASE_URL}/orders/${validOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      },
      body: JSON.stringify({ status: 'Preparing' })
    });
    data = await res.json();
    logTest('PUT /api/orders/:id/status (Valid - manager)', res.status === 200 && data.success && data.data.status === 'Preparing');

    // Test PUT /api/orders/:id/status - Invalid status value
    res = await fetch(`${BASE_URL}/orders/${validOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      },
      body: JSON.stringify({ status: 'InvalidStatus' })
    });
    data = await res.json();
    logTest('PUT /api/orders/:id/status (Invalid status - 400)', res.status === 400 && !data.success);

    // Test PUT /api/orders/:id/status - Customer forbidden
    res = await fetch(`${BASE_URL}/orders/${validOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({ status: 'Ready' })
    });
    data = await res.json();
    logTest('PUT /api/orders/:id/status (Customer - 403)', res.status === 403 && !data.success);


    // ==========================================
    // RESERVATIONS MODULE TESTS
    // ==========================================
    console.log('\n--- Reservations Module ---');

    // Test POST /api/reservations - Valid Reservation
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const dateStr = futureDate.toISOString().split('T')[0];

    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: dateStr,
        time: '19:30',
        partySize: 4,
        notes: 'Testing'
      })
    });
    data = await res.json();
    logTest('POST /api/reservations (Valid)', res.status === 201 && data.success && data.data.time === '19:30', `Status: ${res.status}`);
    const validResId = data.data?._id;

    // Test POST /api/reservations - Reject past date
    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: '2020-01-01',
        time: '19:30',
        partySize: 4
      })
    });
    data = await res.json();
    logTest('POST /api/reservations (Reject past date)', res.status === 400 && !data.success);

    // Test POST /api/reservations - Reject invalid time format
    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: dateStr,
        time: '9:30', // missing leading zero
        partySize: 4
      })
    });
    data = await res.json();
    logTest('POST /api/reservations (Reject invalid time)', res.status === 400 && !data.success);

    // Test POST /api/reservations - Reject invalid partySize (0)
    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: dateStr,
        time: '19:30',
        partySize: 0
      })
    });
    data = await res.json();
    logTest('POST /api/reservations (Reject partySize 0)', res.status === 400 && !data.success);

    // Test POST /api/reservations - Reject invalid partySize (decimal)
    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: dateStr,
        time: '19:30',
        partySize: 2.5
      })
    });
    data = await res.json();
    logTest('POST /api/reservations (Reject partySize decimal)', res.status === 400 && !data.success);

    // Test POST /api/reservations - Prevent duplicate active reservations
    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: dateStr,
        time: '19:30',
        partySize: 4
      })
    });
    data = await res.json();
    logTest('POST /api/reservations (Reject duplicate active)', res.status === 409 && !data.success);

    // Test GET /api/reservations - Pagination and Sorting (manager)
    res = await fetch(`${BASE_URL}/reservations?page=1&limit=2`, {
      headers: {
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      }
    });
    data = await res.json();
    let sortedAsc = true;
    for (let i = 0; i < data.data.reservations.length - 1; i++) {
      if (new Date(data.data.reservations[i].date) > new Date(data.data.reservations[i+1].date)) {
        sortedAsc = false;
      }
    }
    logTest('GET /api/reservations (Default Sorting date ascending)', res.status === 200 && data.success && sortedAsc);

    // Test PUT /api/reservations/:id - Customer cancel own reservation (Pending)
    res = await fetch(`${BASE_URL}/reservations/${validResId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    data = await res.json();
    logTest('PUT /api/reservations/:id (Customer cancels own pending)', res.status === 200 && data.success && data.data.status === 'Cancelled');

    // Create another reservation to test confirmed transitions
    res = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        date: dateStr,
        time: '21:00',
        partySize: 2
      })
    });
    data = await res.json();
    const pendingResId2 = data.data?._id;

    // Confirm it as manager via status endpoint
    res = await fetch(`${BASE_URL}/reservations/${pendingResId2}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    data = await res.json();
    logTest('PUT /api/reservations/:id/status (Manager confirms)', res.status === 200 && data.success && data.data.status === 'Confirmed');

    // Test PUT /api/reservations/:id - Customer edits details of Confirmed reservation (should fail)
    res = await fetch(`${BASE_URL}/reservations/${pendingResId2}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({ time: '22:00' })
    });
    data = await res.json();
    logTest('PUT /api/reservations/:id (Reject edit details if Confirmed)', res.status === 400 && !data.success);

    // Test PUT /api/reservations/:id - Customer cancels Confirmed reservation (should pass)
    res = await fetch(`${BASE_URL}/reservations/${pendingResId2}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    data = await res.json();
    logTest('PUT /api/reservations/:id (Customer cancels Confirmed)', res.status === 200 && data.success && data.data.status === 'Cancelled');

    // Test PUT /api/reservations/:id - Try to change status of Cancelled reservation (should fail)
    res = await fetch(`${BASE_URL}/reservations/${pendingResId2}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': customer1._id.toString(),
        'x-user-role': 'customer'
      },
      body: JSON.stringify({ status: 'Pending' })
    });
    data = await res.json();
    logTest('PUT /api/reservations/:id (Reject transition from Cancelled)', res.status === 400 && !data.success);


    // ==========================================
    // ADMIN DASHBOARD MODULE TESTS
    // ==========================================
    console.log('\n--- Admin Dashboard Module ---');

    // Test GET /api/admin/dashboard (admin)
    res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: {
        'x-user-id': admin._id.toString(),
        'x-user-role': 'admin'
      }
    });
    data = await res.json();
    logTest('GET /api/admin/dashboard (Admin authorized)', res.status === 200 && data.success && data.data.totalRevenue !== undefined, `Revenue: ${data.data?.totalRevenue}`);

    // Test GET /api/admin/dashboard (manager - forbidden)
    res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: {
        'x-user-id': manager._id.toString(),
        'x-user-role': 'manager'
      }
    });
    data = await res.json();
    logTest('GET /api/admin/dashboard (Manager forbidden - 403)', res.status === 403 && !data.success);

    console.log('\n--- ALL VERIFICATIONS COMPLETED ---');

  } catch (error) {
    console.error('Test run failed with error:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

runTests();
