const { validateCreateInventory, validateUpdateInventory } = require('../validators/inventory.validator');

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

const runCreate = (body) => {
  const req = { body };
  const res = mockResponse();
  let nextCalled = false;
  const next = () => { nextCalled = true; };
  validateCreateInventory(req, res, next);
  return { res, nextCalled };
};

const runUpdate = (body) => {
  const req = { body };
  const res = mockResponse();
  let nextCalled = false;
  const next = () => { nextCalled = true; };
  validateUpdateInventory(req, res, next);
  return { res, nextCalled };
};

const runTests = () => {
  console.log('=== Running Extended Inventory Validator Tests ===');

  // --- 1. Required Fields Validation (Create) ---
  let result = runCreate({ category: 'Meat' });
  logTest('Required name omitted (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Name is required'));

  result = runCreate({ name: 'Beef', category: 'Meat' });
  logTest('Required unit omitted (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Unit is required'));

  result = runCreate({ name: 'Beef', unit: 'piece', category: 'Meat' });
  logTest('Required quantity omitted (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Quantity is required'));

  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, category: 'Meat' });
  logTest('Required minimumStock omitted (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Minimum stock is required'));

  // --- 2. String Fields Bounds & Typings (Create & Update) ---
  // Invalid string types
  result = runCreate({ name: 123, unit: 'piece', quantity: 10, minimumStock: 5 });
  logTest('Invalid name type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Name must be a string'));

  result = runUpdate({ name: { nested: 'object' } });
  logTest('Invalid name type (Update)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Name must be a string'));

  result = runCreate({ name: 'Beef', unit: 999, quantity: 10, minimumStock: 5 });
  logTest('Invalid unit type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Unit must be a string'));

  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: 5, category: true });
  logTest('Invalid category type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Category must be a string'));

  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: 5, supplier: false });
  logTest('Invalid supplier type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Supplier must be a string'));

  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: 5, notes: ['array'] });
  logTest('Invalid notes type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Notes must be a string'));

  // Empty string handling
  result = runCreate({ name: '   ', unit: 'piece', quantity: 10, minimumStock: 5 });
  logTest('Empty trimmed name (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Name cannot be empty'));

  result = runCreate({ name: 'Beef', unit: ' \t ', quantity: 10, minimumStock: 5 });
  logTest('Empty trimmed unit (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Unit cannot be empty'));

  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: 5, category: '   ' });
  logTest('Empty trimmed category (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Category cannot be empty when supplied'));

  result = runUpdate({ supplier: '' });
  logTest('Empty trimmed supplier (Update)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Supplier cannot be empty when supplied'));

  // Maxlength validation
  result = runCreate({ name: 'a'.repeat(101), unit: 'piece', quantity: 10, minimumStock: 5 });
  logTest('Name exceeds max length (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Name cannot exceed 100 characters'));

  result = runUpdate({ supplier: 's'.repeat(101) });
  logTest('Supplier exceeds max length (Update)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Supplier cannot exceed 100 characters'));

  result = runUpdate({ notes: 'n'.repeat(501) });
  logTest('Notes exceeds max length (Update)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Notes cannot exceed 500 characters'));

  // --- 3. Numeric Fields Validation (Create & Update) ---
  // Invalid quantity types
  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 'ten', minimumStock: 5 });
  logTest('Quantity invalid type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Quantity must be a number'));

  result = runUpdate({ quantity: NaN });
  logTest('Quantity is NaN (Update)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Quantity must be a number'));

  // Minimum Stock validation
  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: -1 });
  logTest('Minimum stock is negative (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Minimum stock must be greater than or equal to 0'));

  // Decimal check
  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10.5, minimumStock: 5 });
  logTest('Quantity is decimal (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Quantity must be an integer'));

  result = runUpdate({ minimumStock: 5.7 });
  logTest('Minimum stock is decimal (Update)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Minimum stock must be an integer'));

  // --- 4. Enum validation (Unit) ---
  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: 5 });
  logTest('Valid enum unit (Create)', result.nextCalled);

  result = runCreate({ name: 'Beef', unit: 'ounces', quantity: 10, minimumStock: 5 });
  logTest('Invalid enum unit (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('Invalid unit'));

  // --- 5. isActive validation ---
  result = runCreate({ name: 'Beef', unit: 'piece', quantity: 10, minimumStock: 5, isActive: 'yes' });
  logTest('Invalid isActive type (Create)', !result.nextCalled && result.res.statusCode === 400 && result.res.responseData.message.includes('isActive must be a boolean'));

  result = runUpdate({ isActive: false });
  logTest('Valid isActive type (Update)', result.nextCalled);

  // --- 6. Unexpected Fields (Should pass validator) ---
  result = runCreate({
    name: 'Beef Patty Extra',
    unit: 'piece',
    quantity: 10,
    minimumStock: 5,
    unexpectedField: 'shouldBeIgnored'
  });
  logTest('Ignore unexpected fields (Create)', result.nextCalled);

  console.log('=== Validator Tests Concluded ===\n');
};

runTests();
