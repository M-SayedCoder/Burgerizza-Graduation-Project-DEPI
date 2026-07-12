import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../ui/EmptyState';
import './Cart.css';

export const Cart: React.FC = () => {
  const {
    items,
    total,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow p-5 rounded-4 bg-white">
          <EmptyState
            title="Your Cart is Empty"
            message="Looks like you haven't added anything to your cart yet. Let's explore our delicious menu!"
            actionText="Go to Menu"
            actionPath={ROUTES.MENU}
          />
        </div>
      </div>
    );
  }

  const subtotal = total;
  const deliveryFee = 0.00; // Mock delivery fee
  const tax = subtotal * 0.05; // 5% mock tax
  const orderTotal = subtotal + deliveryFee + tax;

  return (
    <div className="container py-5 animate-fade-in">
      <div className="mode-toggle mb-4">
        <button
          className={`toggle-btn ${isEditMode ? 'active' : ''}`}
          onClick={() => setIsEditMode(true)}
        >
          <i className="bi bi-pencil" /> Edit Cart
        </button>
        <button
          className={`toggle-btn ${!isEditMode ? 'active' : ''}`}
          onClick={() => setIsEditMode(false)}
        >
          <i className="bi bi-check-circle" /> My Cart (Done)
        </button>
      </div>

      <div className="cart-card mx-auto shadow-lg" id="mainCartCard">
        <div className="cart-header d-flex justify-content-between align-items-center">
          <h2 className="m-0 fs-4 d-flex align-items-center gap-2">
            <i className="bi bi-cart3" /> Cart
          </h2>
          <button
            className="header-action-btn border-0 py-2 px-4 rounded-pill fw-bold"
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            {isEditMode ? 'Save Items' : 'Edit Items'}
          </button>
        </div>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="item-row py-3 d-flex justify-content-between align-items-center border-bottom position-relative">
              <div className="item-info">
                <span className="item-name fw-bold text-dark fs-5">{item.name}</span>
                <div className="price-size-group d-flex align-items-center gap-2 mt-1">
                  <span className="item-price text-orange fw-bold fs-6">{formatCurrency(item.price)}</span>
                  <span className="item-size badge bg-light border text-dark">{item.sizeLabel}</span>
                </div>
              </div>

              <div className="quantity-wrapper d-flex align-items-center gap-2">
                {isEditMode ? (
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '30px', height: '30px' }}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>
                    <span className="fw-bold px-2">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '30px', height: '30px' }}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2 rounded-circle p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '30px', height: '30px' }}
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                ) : (
                  <span className="badge bg-dark-navy text-white px-3 py-2 rounded-pill fw-semibold">
                    Qty: {item.quantity}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="delivery-section my-4 p-3 rounded bg-light border">
          <div className="address-box">
            <span className="address-title fw-bold text-muted small d-block mb-1">
              DELIVERY ADDRESS{' '}
              <Link to={ROUTES.ADDRESS} className="edit-orange text-decoration-none ms-2">
                EDIT
              </Link>
            </span>
            <span className="address-text fw-semibold text-dark">
              2118 Thornridge Cir. Syracuse
            </span>
          </div>
        </div>

        {/* Total & Summary Breakdown */}
        <div className="total-row pt-3 border-top">
          <span className="total-label fw-bold text-muted">TOTAL:</span>
          <div className="total-value d-flex flex-column align-items-end">
            <span className="total-amount fs-3 fw-extrabold text-dark">
              {formatCurrency(orderTotal)}
            </span>
            <button
              className="btn btn-link p-0 text-orange fw-bold text-decoration-none mt-1"
              onClick={() => setShowBreakdown((prev) => !prev)}
            >
              {showBreakdown ? 'Hide Breakdown ▲' : 'Breakdown ▼'}
            </button>
          </div>
        </div>

        {showBreakdown && (
          <div className="alert alert-light border mt-3 p-3 rounded-3 animate-fade-in">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Estimated Tax (5%)</span>
              <span className="fw-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Delivery Fee</span>
              <span className="fw-semibold text-success">
                {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4">
          <Link to={ROUTES.CHECKOUT} className="text-decoration-none">
            <button className="place-order-btn btn btn-orange w-100 py-3 rounded-pill fs-5 fw-bold">
              PLACE ORDER
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;