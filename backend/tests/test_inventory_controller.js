const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const {
  createInventory,
  getInventoryItems,
  getInventoryItemById,
  updateInventory,
  deleteInventory,
  restoreInventory,
  getLowStockItems
} = require('../controllers/inventoryController');

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

const mockResponse = () => {
  const res = {};
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.responseData = data;
    return this;
  };
  return res;
};

const runTests = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully. Wiping inventory collection...');
    await Inventory.deleteMany({});

    // Seed initial data
    const item1 = await Inventory.create({
      name: 'Beef Patty',
      category: 'Meat',
      unit: 'piece',
      quantity: 100,
      minimumStock: 20,
      supplier: 'Premium Meat Co',
      isActive: true
    });

    const item2 = await Inventory.create({
      name: 'Burger Buns',
      category: 'Bakery',
      unit: 'piece',
      quantity: 5, // low stock
      minimumStock: 20,
      supplier: 'Daily Bakery',
      isActive: true
    });

    const item3 = await Inventory.create({
      name: 'Tomato Sauce',
      category: 'Ingredients',
      unit: 'litre',
      quantity: 15,
      minimumStock: 10,
      supplier: 'Heinz Corp',
      isActive: false // inactive item
    });

    console.log('=== Running Extended Inventory Controller Tests ===');

    // --- 1. Create Success & Failures ---
    let req = { body: { name: 'Cheddar Cheese', unit: 'kg', quantity: 10, minimumStock: 2 } };
    let res = mockResponse();
    await createInventory(req, res);
    logTest('Create inventory success', res.statusCode === 201 && res.responseData.data.name === 'Cheddar Cheese');

    // Duplicate name create
    req = { body: { name: '  beef patty  ', unit: 'piece', quantity: 10, minimumStock: 2 } };
    res = mockResponse();
    await createInventory(req, res);
    logTest('Create duplicate name rejected', res.statusCode === 400 && res.responseData.success === false);

    // --- 2. Invalid ObjectIds ---
    req = { params: { id: 'invalid-object-id' } };
    res = mockResponse();
    await getInventoryItemById(req, res);
    logTest('GetById invalid ObjectId rejected', res.statusCode === 400);

    res = mockResponse();
    await updateInventory(req, res);
    logTest('Update invalid ObjectId rejected', res.statusCode === 400);

    res = mockResponse();
    await deleteInventory(req, res);
    logTest('Delete invalid ObjectId rejected', res.statusCode === 400);

    res = mockResponse();
    await restoreInventory(req, res);
    logTest('Restore invalid ObjectId rejected', res.statusCode === 400);

    // --- 3. GetItemById Success & Failure ---
    req = { params: { id: item1._id.toString() } };
    res = mockResponse();
    await getInventoryItemById(req, res);
    logTest('GetById success', res.statusCode === 200 && res.responseData.data.name === 'Beef Patty');

    req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    res = mockResponse();
    await getInventoryItemById(req, res);
    logTest('GetById not found', res.statusCode === 404);

    // --- 4. Update Success & Failures ---
    // Update valid
    req = { params: { id: item1._id.toString() }, body: { quantity: 150, supplier: 'New Supplier Inc' } };
    res = mockResponse();
    await updateInventory(req, res);
    logTest('Update success', res.statusCode === 200 && res.responseData.data.quantity === 150 && res.responseData.data.supplier === 'New Supplier Inc');

    // Update duplicate name
    req = { params: { id: item1._id.toString() }, body: { name: 'Burger Buns' } };
    res = mockResponse();
    await updateInventory(req, res);
    logTest('Update duplicate name rejected', res.statusCode === 400);

    // Update inactive item (is allowed as per business logic, but check if we can update it successfully)
    req = { params: { id: item3._id.toString() }, body: { notes: 'New notes' } };
    res = mockResponse();
    await updateInventory(req, res);
    logTest('Update inactive item allowed', res.statusCode === 200 && res.responseData.data.notes === 'New notes');

    // --- 5. Soft Delete Operations ---
    // Soft delete first time
    req = { params: { id: item2._id.toString() } };
    res = mockResponse();
    await deleteInventory(req, res);
    logTest('Soft delete first time success', res.statusCode === 200 && res.responseData.data.isActive === false);

    // Soft delete second time (should reject)
    res = mockResponse();
    await deleteInventory(req, res);
    logTest('Soft delete second time fails', res.statusCode === 400 && res.responseData.message.includes('already inactive'));

    // --- 6. Restore Operations ---
    // Restore first time
    res = mockResponse();
    await restoreInventory(req, res);
    logTest('Restore first time success', res.statusCode === 200 && res.responseData.data.isActive === true);

    // Restore second time (should reject)
    res = mockResponse();
    await restoreInventory(req, res);
    logTest('Restore second time fails', res.statusCode === 400 && res.responseData.message.includes('already active'));

    // Update, delete, restore with non-existent valid ObjectId
    const randomId = new mongoose.Types.ObjectId().toString();
    req = { params: { id: randomId }, body: { quantity: 10 } };
    res = mockResponse();
    await updateInventory(req, res);
    logTest('Update valid ID but not found (404)', res.statusCode === 404);

    req = { params: { id: randomId } };
    res = mockResponse();
    await deleteInventory(req, res);
    logTest('Delete valid ID but not found (404)', res.statusCode === 404);

    res = mockResponse();
    await restoreInventory(req, res);
    logTest('Restore valid ID but not found (404)', res.statusCode === 404);

    // --- 7. Search, Filtering, and Pagination Validation ---
    // Invalid filter: isActive value
    req = { query: { isActive: 'not-boolean' } };
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('Invalid isActive query rejected', res.statusCode === 400);

    // Invalid filter: lowStock value
    req = { query: { lowStock: 'invalid' } };
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('Invalid lowStock query rejected', res.statusCode === 400);

    // Invalid sort field
    req = { query: { sortBy: 'unsupported' } };
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('Invalid sortBy query rejected', res.statusCode === 400);

    // Invalid sort order
    req = { query: { sortBy: 'quantity', order: 'upward' } };
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('Invalid sort order query rejected', res.statusCode === 400);

    // Regex injection attempt in search (should be escaped and safely return empty list instead of crashing)
    req = { query: { search: '.*patty.*' } };
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('Regex injection search safe (no crash)', res.statusCode === 200 && res.responseData.data.inventory.length === 0);

    // Prototype pollution payload check
    req = { body: JSON.parse('{"__proto__": {"pollutes": true}}') };
    res = mockResponse();
    await createInventory(req, res);
    logTest('Prototype pollution payload ignored', res.statusCode !== 201 && !('pollutes' in {}));

    // Mongo Operator query injection check
    req = { query: { search: { $ne: 'random' } } };
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('NoSQL injection search operator safe (no crash)', res.statusCode === 200);

    // Pagination edge cases: page / limit checks
    req = { query: { page: '-5', limit: '1000' } }; // should bound page to 1, limit to 100
    res = mockResponse();
    await getInventoryItems(req, res);
    logTest('Pagination bounds checks applied', res.statusCode === 200 && res.responseData.data.pagination.page === 1 && res.responseData.data.pagination.limit === 100);

    console.log('=== Controller Tests Concluded ===\n');
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

runTests();
