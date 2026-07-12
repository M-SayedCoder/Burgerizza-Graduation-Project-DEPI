import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { useCart } from '../../hooks/useCart';
import { ROUTES } from '../../constants/routes';
import type { MenuItem, MenuItemSize } from '../../types/menu.types';
import Spinner from '../ui/Spinner';

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<MenuItemSize>('medium');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await menuService.getMenuItemById(id);
        setItem(data);
        // Set default size price or match with sizing configuration
        const defaultSize = data.sizes.find(s => s.size === 'medium') || data.sizes[0];
        if (defaultSize) {
          setSelectedSize(defaultSize.size);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Meal details not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <Spinner size="lg" className="vh-100" />;
  if (error || !item) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '3rem' }} />
        <h4 className="fw-bold mt-3">Product Not Found</h4>
        <p className="text-muted">{error || 'Unable to retrieve details.'}</p>
        <Link to={ROUTES.MENU} className="btn btn-orange rounded-pill px-4 mt-3">
          Back to Menu
        </Link>
      </div>
    );
  }

  const selectedSizeOption = item.sizes.find(s => s.size === selectedSize) || item.sizes[0];
  const unitPrice = selectedSizeOption ? selectedSizeOption.price : item.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addToCart({
        menuItemId: item.id,
        name: item.name,
        price: unitPrice,
        size: selectedSize,
        sizeLabel: selectedSizeOption.label,
        image: item.image,
      });
    }
    navigate(ROUTES.CART);
  };

  return (
    <section className="meal-details py-4">
      <div className="container shadow-lg rounded-4 p-4 p-md-5 bg-white animate-fade-in">
        {/* Back Link */}
        <div className="row mb-4">
          <div className="col-12 d-flex gap-3 align-items-center">
            <Link to={ROUTES.MENU} className="btn btn-light rounded-circle p-2 shadow-sm d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-chevron-left" />
            </Link>
            <p className="fw-bold fs-5 my-auto text-secondary">Details</p>
          </div>
        </div>

        {/* Main Info */}
        <div className="row g-5">
          <div className="col-12 col-lg-6 py-3 border-bottom border-2">
            <div className="img-container rounded-4 overflow-hidden mb-4" style={{ height: '350px' }}>
              <img
                src={item.image}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
                alt={item.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/Pizza.jpg';
                }}
              />
            </div>
            
            <div className="d-flex gap-3">
              <button
                className={`btn ${isWishlisted ? 'btn-danger' : 'btn-light border'} py-2.5 w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2`}
                onClick={() => setIsWishlisted((prev) => !prev)}
              >
                <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`} />
                {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
              </button>
              
              <button
                className="btn btn-orange py-2.5 w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart" />
                Add to cart
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6 py-3 py-lg-5">
            <h1 className="fw-bold py-2">{item.name}</h1>
            <p className="py-2 text-secondary fw-semibold">
              {item.description}
            </p>

            {/* Badges */}
            <div className="d-flex gap-3 justify-content-between fw-semibold py-3 border-bottom border-2 pb-4">
              <div className="shadow-sm py-2 px-3 rounded-4 bg-light d-flex align-items-center gap-2">
                <i className="bi bi-star-fill text-warning" />
                <span> {item.rating}</span>
              </div>
              <div className="shadow-sm py-2 px-3 rounded-4 bg-light d-flex align-items-center gap-2">
                <i className="bi bi-truck text-orange" />
                <span> {item.deliveryFee === 0 ? 'Free Delivery' : `$${item.deliveryFee} Delivery`}</span>
              </div>
              <div className="shadow-sm py-2 px-3 rounded-4 bg-light d-flex align-items-center gap-2">
                <i className="bi bi-clock text-orange" />
                <span> {item.deliveryTime} Min</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="py-4 border-bottom">
              <h5 className="fw-bold mb-3">Select Size:</h5>
              <div className="d-flex gap-3 flex-wrap">
                {item.sizes.map((sz) => (
                  <button
                    key={sz.size}
                    onClick={() => setSelectedSize(sz.size)}
                    className={`btn rounded-pill px-4 py-2 fw-semibold transition-all ${
                      selectedSize === sz.size ? 'btn-orange text-white' : 'btn-light border text-dark'
                    }`}
                  >
                    {sz.label} (${sz.price.toFixed(2)})
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="py-4 border-bottom">
              <h5 className="fw-bold mb-3">Ingredients:</h5>
              <div className="d-flex gap-2 flex-wrap">
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="badge bg-light border text-dark px-3 py-2 rounded-pill fw-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="d-flex flex-wrap align-items-center justify-content-between pt-4 gap-3">
              <div className="d-flex gap-3 align-items-center">
                <h5 className="fw-bold mb-0">Amount:</h5>
                <div className="input-group" style={{ width: '130px' }}>
                  <button
                    className="btn btn-outline-secondary rounded-start-pill px-3"
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="form-control text-center fw-bold border-secondary border-start-0 border-end-0 bg-white d-flex align-items-center justify-content-center">
                    {quantity}
                  </span>
                  <button
                    className="btn btn-outline-secondary rounded-end-pill px-3"
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="d-flex gap-3 align-items-center">
                <h5 className="fw-bold mb-0">Total Price:</h5>
                <div className="fs-3 fw-extrabold text-orange">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Details;
