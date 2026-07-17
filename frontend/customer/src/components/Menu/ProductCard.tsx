import React from 'react';
import { Link } from 'react-router-dom';
import type { MenuItem } from '../../types/menu.types';
import { useCart } from '../../hooks/useCart';
import { handleImageError } from '../../utils/imageFallback';

interface ProductCardProps {
  item: MenuItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Choose small size by default or the first size available
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
    <div className="card h-100 border border-light shadow-sm rounded-4 overflow-hidden position-relative hover-translate-y bg-white">
      <Link to={`/menu/${item.id}`} className="text-decoration-none text-dark d-flex flex-column h-100">
        <div className="position-relative" style={{ height: '200px' }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={handleImageError}
          />
          {item.isPopular && (
            <span className="position-absolute top-3 start-3 badge bg-danger rounded-pill px-3 py-1.5 fs-8">
              POPULAR
            </span>
          )}
          <span className="position-absolute top-3 end-3 bg-white rounded-pill px-2.5 py-1 shadow-sm fs-8 fw-bold text-dark d-flex align-items-center gap-1">
            <i className="bi bi-star-fill text-warning" /> {item.rating}
          </span>
        </div>
        <div className="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">
          <div>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="card-title fw-bold mb-0 text-truncate-2 text-contrast-dark" title={item.name}>
                {item.name}
              </h5>
            </div>
            <p className="card-text text-contrast-soft small text-truncate-3 mb-3">
              {item.description}
            </p>
          </div>
          
          <div className="mt-auto">
            <div className="d-flex align-items-center gap-2 mb-3 text-contrast-muted small fw-medium">
              <span><i className="bi bi-clock me-1 text-contrast-muted" /> {item.deliveryTime}m</span>
              <span className="text-secondary opacity-50">•</span>
              <span><i className="bi bi-truck me-1 text-primary-orange" /> {item.deliveryFee === 0 ? 'Free Delivery' : `$${item.deliveryFee} Delivery`}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-2 border-top">
              <span className="fs-5 fw-extrabold text-contrast-dark">${item.price.toFixed(2)}</span>
              <button
                onClick={handleAddClick}
                className="btn btn-orange btn-sm px-3 py-2 rounded-pill d-flex align-items-center gap-1"
              >
                <i className="bi bi-cart-plus fs-6" /> Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
