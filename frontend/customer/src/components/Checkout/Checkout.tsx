import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { ROUTES } from '../../constants/routes';
import { checkoutSchema, type CheckoutFormValues } from '../../utils/validators';
import { formatCurrency } from '../../utils/formatters';
import { profileService } from '../../services/profileService';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import './Checkout.css';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const { placeNewOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: '',
      notes: '',
    },
  });

  useEffect(() => {
    const checkAddresses = async () => {
      try {
        const profile = await profileService.getProfile();
        const addresses = profile.addresses || [];
        setSavedAddresses(addresses);
        if (addresses.length === 0) {
          navigate(ROUTES.ADDRESS, { state: { fromCheckout: true } });
        } else {
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
          setSelectedAddressId(defaultAddr.id || '');
          setValue('deliveryAddress', defaultAddr.street);
        }
      } catch (err) {
        console.error('Failed to load profile addresses:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    checkAddresses();
  }, [navigate, setValue]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);
    setServerError(null);
    try {
      // Place order in backend mock
      await placeNewOrder({
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          size: i.size,
        })),
        deliveryAddress: data.deliveryAddress,
        notes: data.notes,
      });

      // Clear Redux Cart
      clear();
      
      // Navigate to orders history page
      navigate(ROUTES.ORDERS);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Checkout transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <Spinner size="lg" className="vh-100" />;
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }} />
        <h3 className="fw-bold mt-4">Checkout is Empty</h3>
        <p className="text-muted mb-4">You must add some meals to your cart before proceeding.</p>
        <Link to={ROUTES.MENU} className="btn btn-orange rounded-pill px-4">
          Browse Menu
        </Link>
      </div>
    );
  }

  const subtotal = total;
  const tax = subtotal * 0.05;
  const deliveryFee = 0.00;
  const grandTotal = subtotal + tax + deliveryFee;

  return (
    <section className="py-5 bg-light animate-fade-in">
      <div className="container">
        <div className="row g-5">
          {/* Checkout Details Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
              <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-credit-card text-primary-orange" /> Delivery & Payment
              </h4>

              {serverError && (
                <div className="alert alert-danger mb-4" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  {savedAddresses.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label fw-bold mb-2">Select Saved Address</label>
                      <div className="row g-2 mb-3">
                        {savedAddresses.map((addr) => (
                          <div key={addr.id} className="col-12 col-md-6">
                            <div
                              className={`card p-3 h-100 cursor-pointer border-2 ${
                                selectedAddressId === addr.id ? 'border-primary' : 'border-light'
                              }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setSelectedAddressId(addr.id);
                                setValue('deliveryAddress', addr.street);
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="badge bg-light text-dark">{addr.label.toUpperCase()}</span>
                                {selectedAddressId === addr.id && <span className="text-primary font-bold small">✓ Selected</span>}
                              </div>
                              <small className="text-dark d-block">{addr.street}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="form-label fw-bold">Delivery Address</label>
                  <input
                    type="text"
                    className={`form-control custom-input ${errors.deliveryAddress ? 'is-invalid' : ''}`}
                    placeholder="Enter full delivery address"
                    {...register('deliveryAddress')}
                  />
                  {errors.deliveryAddress && (
                    <div className="invalid-feedback">{errors.deliveryAddress.message}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Order Notes (Optional)</label>
                  <textarea
                    rows={3}
                    className="form-control custom-input"
                    placeholder="E.g., No cutlery, gate code, ring bell..."
                    {...register('notes')}
                  />
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">Card Details</h5>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="Name on Card"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder="Card Number"
                    maxLength={16}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="col-6 mb-4">
                    <input
                      type="password"
                      className="form-control custom-input"
                      placeholder="CVV"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="orange"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                >
                  Pay & Confirm Order ({formatCurrency(grandTotal)})
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary Side Panel */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white position-sticky" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="summary-items max-vh-50 overflow-y-auto mb-4 pe-2">
                {items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-3 border-bottom pb-2">
                    <div>
                      <span className="fw-semibold text-dark">{item.name}</span>
                      <div className="small text-muted">
                        Size: {item.sizeLabel} × {item.quantity}
                      </div>
                    </div>
                    <span className="fw-bold text-dark">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Tax (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-muted">
                <span>Delivery</span>
                <span className="text-success">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                <span>Total</span>
                <span className="text-orange">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;