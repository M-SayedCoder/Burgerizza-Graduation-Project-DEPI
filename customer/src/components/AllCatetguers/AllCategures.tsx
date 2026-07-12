import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import Spinner from '../ui/Spinner';
import './AllCatetgures.css';

export const AllCategures: React.FC = () => {
  const { items, categories, loading } = useMenu();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all'
    ? items
    : items.filter((item) => item.categoryId === activeTab);

  const handleAddToCart = (item: any) => {
    const defaultSize = item.sizes[0] || { size: 'medium', label: 'Medium', price: item.price };
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: defaultSize.price,
      size: defaultSize.size,
      sizeLabel: defaultSize.label,
      image: item.image,
    });
  };

  return (
    <div className="container py-5 animate-fade-in">
      {/* Back Button */}
      <div className="row mb-4">
        <div className="col-12">
          <Link to={ROUTES.HOME} className="btn btn-light rounded-circle p-2 shadow-sm d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-chevron-left" />
          </Link>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center fw-bold mb-4">Our Categories</h2>
          <ul className="nav nav-pills justify-content-center gap-2 mb-4">
            {categories.map((cat) => (
              <li key={cat.id} className="nav-item">
                <button
                  onClick={() => setActiveTab(cat.id)}
                  className={`nav-link rounded-pill px-4 py-2 fw-medium border-0 transition-all ${
                    activeTab === cat.id ? 'bg-orange text-white' : 'bg-white border text-dark'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" className="my-5" />
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }} />
          <p className="text-muted mt-3">No items in this category yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-translate-y">
                <div style={{ height: '220px' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/Pizza.jpg';
                    }}
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold text-dark">{item.name}</h5>
                    <p className="card-text text-muted small text-truncate-2 mb-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                    <span className="fs-5 fw-bold text-dark">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-orange px-4 py-2 rounded-pill fw-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCategures;
