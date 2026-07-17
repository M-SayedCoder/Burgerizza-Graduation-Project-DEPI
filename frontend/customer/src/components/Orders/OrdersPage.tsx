import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatDate, formatCurrency } from '../../utils/formatters';
import type { Order, OrderStatus } from '../../types/order.types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const OrdersPage: React.FC = () => {
  const { orders, loading, error, refetch } = useOrders();
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Status mapping to color variants
  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'preparing':
        return 'primary';
      case 'ready':
        return 'success';
      case 'delivered':
        return 'secondary';
      default:
        return 'dark';
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    const steps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const idx = steps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const pastOrders = orders.filter((o) => o.status === 'delivered');

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="fw-bold mb-2">My Orders</h1>
          <p className="text-muted">Track active deliveries and review order history</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4 d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={refetch}>Retry</button>
        </div>
      )}

      {loading && orders.length === 0 ? (
        <Spinner size="lg" className="my-5" />
      ) : (
        <div className="row g-4">
          {/* Tracking panel if active */}
          {trackingOrder && (
            <div className="col-12 mb-4">
              <Card hoverable={false} className="border border-orange">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Track Order: {trackingOrder.id}</h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setTrackingOrder(null)}
                    aria-label="Close"
                  />
                </div>
                
                {/* Visual Tracker Steps */}
                <div className="row position-relative my-5 justify-content-between text-center">
                  <div
                    className="position-absolute top-50 start-0 translate-middle-y bg-light"
                    style={{ height: '4px', width: '100%', zIndex: 0 }}
                  >
                    <div
                      className="bg-orange h-100 transition-all"
                      style={{ width: `${(getStepIndex(trackingOrder.status) / 4) * 100}%` }}
                    />
                  </div>

                  {['Placed', 'Confirmed', 'Preparing', 'Ready', 'Delivered'].map((step, idx) => {
                    const isCompleted = getStepIndex(trackingOrder.status) >= idx;
                    return (
                      <div key={idx} className="col position-relative" style={{ zIndex: 1 }}>
                        <div
                          className={`rounded-circle mx-auto d-flex align-items-center justify-content-center shadow-sm ${
                            isCompleted ? 'bg-orange text-white' : 'bg-white border text-muted'
                          }`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          {isCompleted ? '✔' : idx + 1}
                        </div>
                        <span className={`fw-bold small d-block mt-2 ${isCompleted ? 'text-dark' : 'text-muted'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-light p-3 rounded-3 mt-4">
                  <div className="row">
                    <div className="col-sm-6 mb-2 mb-sm-0">
                      <span className="small text-muted d-block">Delivery Location:</span>
                      <span className="fw-semibold">{trackingOrder.deliveryAddress}</span>
                    </div>
                    <div className="col-sm-6">
                      <span className="small text-muted d-block">Estimated Arrival:</span>
                      <span className="fw-semibold text-orange">{trackingOrder.estimatedDelivery || 'Calculating...'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Active Orders Section */}
          <div className="col-md-6">
            <h4 className="fw-bold mb-4">Active Deliveries</h4>
            {activeOrders.length === 0 ? (
              <Card hoverable={false} className="text-center py-5">
                <i className="bi bi-truck text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-3">No active deliveries at the moment.</p>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-3">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="p-4 border">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">{order.id}</h5>
                        <span className="small text-muted">{formatDate(order.createdAt)}</span>
                      </div>
                      <Badge variant={getStatusVariant(order.status)}>
                        {(order.status || '').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="small text-dark mb-1">
                          • {item.name} × {item.quantity} ({item.size})
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div>
                        <span className="small text-muted d-block">Total Cost:</span>
                        <span className="fw-extrabold text-orange fs-5">{formatCurrency(order.total || 25.00)}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-4"
                        onClick={() => setTrackingOrder(order)}
                      >
                        Track Status
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past Orders Section */}
          <div className="col-md-6">
            <h4 className="fw-bold mb-4">Past Orders</h4>
            {pastOrders.length === 0 ? (
              <Card hoverable={false} className="text-center py-5">
                <i className="bi bi-journal-text text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-3">You don't have any past orders yet.</p>
              </Card>
            ) : (
              <div className="d-flex flex-column gap-3">
                {pastOrders.map((order) => (
                  <Card key={order.id} className="p-4 border">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-dark">{order.id}</h5>
                        <span className="small text-muted">{formatDate(order.createdAt)}</span>
                      </div>
                      <Badge variant="secondary">DELIVERED</Badge>
                    </div>

                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="small text-muted mb-1">
                          • {item.name} × {item.quantity} ({item.size})
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                      <div>
                        <span className="small text-muted d-block">Total Cost:</span>
                        <span className="fw-bold text-dark">{formatCurrency(order.total || 25.00)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
