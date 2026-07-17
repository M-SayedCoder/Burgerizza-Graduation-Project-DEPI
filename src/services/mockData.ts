import { Menu, Order, Reservation, User } from '../types';
import { InventoryItem } from '../types/inventory';

// ==================== USERS ====================
export const mockUsers: User[] = [
  { _id: 'u1', name: 'Ahmed Manager', email: 'manager@burgerizza.com', phone: '01012345678', role: 'manager' },
  { _id: 'u2', name: 'Sara Customer', email: 'sara@gmail.com', phone: '01198765432', role: 'customer' },
  { _id: 'u3', name: 'Omar Customer', email: 'omar@gmail.com', phone: '01234567890', role: 'customer' },
];

// ==================== MENU ====================
export const mockMenu: Menu[] = [
  { _id: 'm1', name: 'Classic Cheeseburger', description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and our secret sauce.', price: 120, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', isAvailable: true },
  { _id: 'm2', name: 'Double Smash Burger', description: 'Double smashed patties with caramelized onions and special burger sauce.', price: 160, category: 'Burger', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300', isAvailable: true },
  { _id: 'm3', name: 'Pepperoni Pizza', description: 'Classic pepperoni on tomato base with mozzarella cheese.', price: 180, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', isAvailable: true },
  { _id: 'm4', name: 'BBQ Chicken Pizza', description: 'Grilled chicken strips with BBQ sauce and red onions.', price: 190, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300', isAvailable: false },
  { _id: 'm5', name: 'Classic Hot Dog', description: 'Beef frankfurter in a soft bun with mustard and ketchup.', price: 70, category: 'Sides', image: 'https://images.unsplash.com/photo-1612392062631-94ae3a669b77?w=300', isAvailable: true },
  { _id: 'm6', name: 'Crispy Fries', description: 'Golden crispy fries seasoned with sea salt.', price: 45, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', isAvailable: true },
  { _id: 'm7', name: 'Mango Lemonade', description: 'Fresh mango blended with lemon juice and mint.', price: 55, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', isAvailable: true },
  { _id: 'm8', name: 'Chocolate Brownie', description: 'Warm chocolate brownie with vanilla ice cream.', price: 75, category: 'Desserts', image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=300', isAvailable: false },
  { _id: 'm9', name: 'Creamy Pasta', description: 'Creamy Alfredo pasta with grilled chicken strips.', price: 140, category: 'Sides', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300', isAvailable: true },
];

// ==================== ORDERS ====================
export const mockOrders: Order[] = [
  {
    _id: 'o1',
    customer: { _id: 'u2', name: 'Sara Ahmed', phone: '01198765432', address: '12 Tahrir St, Cairo' },
    items: [
      { menuItemId: 'm1', name: 'Classic Cheeseburger', quantity: 2, price: 120 },
      { menuItemId: 'm6', name: 'Crispy Fries', quantity: 1, price: 45 },
    ],
    total: 285,
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    _id: 'o2',
    customer: { _id: 'u3', name: 'Omar Hassan', phone: '01234567890', address: '5 Maadi Rd, Cairo' },
    items: [
      { menuItemId: 'm3', name: 'Pepperoni Pizza', quantity: 1, price: 180 },
      { menuItemId: 'm7', name: 'Mango Lemonade', quantity: 2, price: 55 },
    ],
    total: 290,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: 'o3',
    customer: { _id: 'u2', name: 'Sara Ahmed', phone: '01198765432', address: '12 Tahrir St, Cairo' },
    items: [
      { menuItemId: 'm2', name: 'Double Smash Burger', quantity: 1, price: 160 },
    ],
    total: 160,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: 'o4',
    customer: { _id: 'u3', name: 'Omar Hassan', phone: '01234567890' },
    items: [
      { menuItemId: 'm9', name: 'Creamy Pasta', quantity: 2, price: 140 },
      { menuItemId: 'm5', name: 'Classic Hot Dog', quantity: 1, price: 70 },
    ],
    total: 350,
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: 'o5',
    customer: { _id: 'u2', name: 'Laila Nabil', phone: '01555123456' },
    items: [
      { menuItemId: 'm8', name: 'Chocolate Brownie', quantity: 3, price: 75 },
    ],
    total: 225,
    status: 'Cancelled',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

// ==================== RESERVATIONS ====================
export const mockReservations: Reservation[] = [
  { _id: 'r1', customer: { _id: 'u2', name: 'Sara Ahmed', phone: '01198765432' }, date: '2026-07-06', time: '19:00', partySize: 4, status: 'Pending' },
  { _id: 'r2', customer: { _id: 'u3', name: 'Omar Hassan', phone: '01234567890' }, date: '2026-07-06', time: '20:30', partySize: 2, status: 'Confirmed' },
  { _id: 'r3', customer: { _id: 'u2', name: 'Laila Nabil', phone: '01555123456' }, date: '2026-07-07', time: '18:00', partySize: 6, status: 'Pending' },
  { _id: 'r4', customer: { _id: 'u3', name: 'Karim Saad', phone: '01677890123' }, date: '2026-07-05', time: '21:00', partySize: 3, status: 'Rejected' },
];

// ==================== INVENTORY ====================
export const mockInventory: InventoryItem[] = [
  { _id: 'inv1', name: 'Beef Patties',      category: 'Meat',       quantity: 150, unit: 'piece', minQuantity: 50,  supplier: 'Cairo Meat Co.',    costPerUnit: 25,  isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv2', name: 'Burger Buns',       category: 'Bakery',     quantity: 200, unit: 'piece', minQuantity: 100, supplier: 'Fresh Bakery',       costPerUnit: 5,   isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv3', name: 'Cheddar Cheese',    category: 'Dairy',      quantity: 10,  unit: 'kg',    minQuantity: 15,  supplier: 'Dairy World',         costPerUnit: 120, isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv4', name: 'Tomatoes',          category: 'Vegetables', quantity: 30,  unit: 'kg',    minQuantity: 10,  supplier: 'Green Farm',          costPerUnit: 15,  isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv5', name: 'Pizza Dough',       category: 'Bakery',     quantity: 25,  unit: 'kg',    minQuantity: 20,  supplier: 'Fresh Bakery',        costPerUnit: 40,  isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv6', name: 'Mozzarella',        category: 'Dairy',      quantity: 8,   unit: 'kg',    minQuantity: 12,  supplier: 'Dairy World',         costPerUnit: 150, isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv7', name: 'Pepperoni',         category: 'Meat',       quantity: 6,   unit: 'kg',    minQuantity: 10,  supplier: 'Cairo Meat Co.',      costPerUnit: 200, isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv8', name: 'Mango Juice',       category: 'Beverages',  quantity: 50,  unit: 'liter', minQuantity: 20,  supplier: 'Juicy Supplies',      costPerUnit: 20,  isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv9', name: 'Chocolate Syrup',   category: 'Desserts',   quantity: 4,   unit: 'liter', minQuantity: 5,   supplier: 'Sweet Supplies Co.',  costPerUnit: 80,  isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv10', name: 'Takeaway Boxes',   category: 'Packaging',  quantity: 500, unit: 'piece', minQuantity: 200, supplier: 'Pack & Go',           costPerUnit: 2,   isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv11', name: 'Cooking Oil',      category: 'Spices',     quantity: 20,  unit: 'liter', minQuantity: 10,  supplier: 'Oil Masters',         costPerUnit: 35,  isActive: true,  createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
  { _id: 'inv12', name: 'Lettuce',          category: 'Vegetables', quantity: 3,   unit: 'kg',    minQuantity: 8,   supplier: 'Green Farm',          costPerUnit: 20,  isActive: false, createdAt: '2026-07-01T00:00:00Z', updatedAt: '2026-07-14T00:00:00Z' },
];

