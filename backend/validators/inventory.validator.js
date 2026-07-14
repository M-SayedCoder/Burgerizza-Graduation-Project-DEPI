const { sendError } = require('../utils/responseHandler');

const ALLOWED_UNITS = Object.freeze(['kg', 'g', 'litre', 'ml', 'piece', 'pack']);
const MAX_LENGTH_NAME = 100;
const MAX_LENGTH_SUPPLIER = 100;
const MAX_LENGTH_NOTES = 500;
const HTTP_BAD_REQUEST = 400;

const checkStringField = (value, fieldName, options = {}) => {
  const { required = false, maxLength, allowEmpty = true } = options;
  if (value === undefined || value === null) {
    return required ? `${fieldName} is required.` : null;
  }
  if (typeof value !== 'string') {
    return `${fieldName} must be a string.`;
  }
  const trimmed = value.trim();
  if (!allowEmpty && trimmed.length === 0) {
    return fieldName === 'Name' ? 'Name cannot be empty.' : `${fieldName} cannot be empty when supplied.`;
  }
  if (maxLength && trimmed.length > maxLength) {
    return `${fieldName} cannot exceed ${maxLength} characters.`;
  }
  return null;
};

const checkPositiveInteger = (value, fieldName, required) => {
  if (value === undefined || value === null) {
    return required ? `${fieldName} is required.` : null;
  }
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return `${fieldName} must be a number.`;
  }
  if (value < 0) {
    return `${fieldName} must be greater than or equal to 0.`;
  }
  if (!Number.isInteger(value)) {
    return `${fieldName} must be an integer.`;
  }
  return null;
};

const checkName = (value, required) =>
  checkStringField(value, 'Name', {
    required,
    maxLength: MAX_LENGTH_NAME,
    allowEmpty: false
  });

const checkCategory = (value, required) =>
  checkStringField(value, 'Category', {
    required,
    allowEmpty: false
  });

const checkSupplier = (value, required) =>
  checkStringField(value, 'Supplier', {
    required,
    maxLength: MAX_LENGTH_SUPPLIER,
    allowEmpty: false
  });

const checkNotes = (value, required) =>
  checkStringField(value, 'Notes', {
    required,
    maxLength: MAX_LENGTH_NOTES,
    allowEmpty: false
  });

const checkQuantity = (value, required) =>
  checkPositiveInteger(value, 'Quantity', required);

const checkMinimumStock = (value, required) =>
  checkPositiveInteger(value, 'Minimum stock', required);

const checkUnit = (unit, isRequired) => {
  if (unit === undefined || unit === null) {
    return isRequired ? 'Unit is required.' : null;
  }
  if (typeof unit !== 'string') {
    return 'Unit must be a string.';
  }
  if (unit.trim().length === 0) {
    return 'Unit cannot be empty.';
  }
  if (!ALLOWED_UNITS.includes(unit)) {
    return `Invalid unit. Must be one of: ${ALLOWED_UNITS.join(', ')}`;
  }
  return null;
};

const checkIsActive = (isActive, isRequired) => {
  if (isActive === undefined || isActive === null) {
    return isRequired ? 'isActive is required.' : null;
  }
  if (typeof isActive !== 'boolean') {
    return 'isActive must be a boolean.';
  }
  return null;
};

const runValidations = (res, validations) => {
  for (let i = 0; i < validations.length; i++) {
    const error = validations[i]();
    if (error) {
      sendError(res, error, null, HTTP_BAD_REQUEST);
      return true;
    }
  }
  return false;
};

const validateCreateInventory = (req, res, next) => {
  const { name, category, unit, quantity, minimumStock, supplier, notes, isActive } = req.body || {};

  const validations = [
    () => checkName(name, true),
    () => checkCategory(category, false),
    () => checkUnit(unit, true),
    () => checkQuantity(quantity, true),
    () => checkMinimumStock(minimumStock, true),
    () => checkSupplier(supplier, false),
    () => checkNotes(notes, false),
    () => checkIsActive(isActive, false)
  ];

  if (runValidations(res, validations)) {
    return;
  }

  next();
};

const validateUpdateInventory = (req, res, next) => {
  const { name, category, unit, quantity, minimumStock, supplier, notes, isActive } = req.body || {};

  const validations = [
    () => checkName(name, false),
    () => checkCategory(category, false),
    () => checkUnit(unit, false),
    () => checkQuantity(quantity, false),
    () => checkMinimumStock(minimumStock, false),
    () => checkSupplier(supplier, false),
    () => checkNotes(notes, false),
    () => checkIsActive(isActive, false)
  ];

  if (runValidations(res, validations)) {
    return;
  }

  next();
};

module.exports = {
  validateCreateInventory,
  validateUpdateInventory
};
