import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getGreeting } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { useMenu } from '../../hooks/useMenu';
import Spinner from '../ui/Spinner';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { items, categories, loading } = useMenu();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.MENU}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      navigate(ROUTES.MENU);
    } else {
      navigate(`${ROUTES.MENU}?category=${categoryId}`);
    }
  };

  // We can filter popular/featured items for featured section
  const featuredMeals = items.filter((item) => item.isFeatured);
  const popularMeals = items.filter((item) => item.isPopular);

  return (
    <div className="animate-fade-in">
      {/* Greeting Header */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <h2 className="fw-bold mb-1">
                {getGreeting()}, {user ? user.name : 'Guest'}!
              </h2>
              <p className="text-muted mb-0">What are you craving today?</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-5 search-hero-section position-relative">
        {/* Decorative ambient blobs */}
        <div className="search-hero-blob search-hero-blob-1 d-none d-md-block" />
        <div className="search-hero-blob search-hero-blob-2 d-none d-md-block" />
        
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-5 fw-bold mb-3">
                Delicious Food, <span className="text-primary-orange">Delivered Fast</span>
              </h1>
              <p className="lead text-muted mb-4">
                Search from your favorite cuisines and dishes in your area.
              </p>
              
              <form onSubmit={handleSearchSubmit} className="premium-search-wrapper">
                <i className="bi bi-search premium-search-icon" />
                <input
                  type="text"
                  className="premium-search-input"
                  placeholder="Search dishes, burgers, pizzas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="premium-search-btn" type="submit">
                  <i className="bi bi-search d-none d-sm-inline" />
                  <span>Search</span>
                </button>
              </form>

              {/* Popular Searches */}
              <div className="popular-tags-container animate-fade-in-up">
                <span className="popular-tag-label">Popular:</span>
                {['Burger', 'Pizza', 'Sushi', 'Pasta', 'Desserts'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="popular-tag-btn"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`${ROUTES.MENU}?search=${encodeURIComponent(tag)}`);
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">All Categories</h4>
            <Link to={ROUTES.CATEGORIES} className="text-decoration-none fw-semibold text-primary-orange">
              See All <i className="bi bi-chevron-right" />
            </Link>
          </div>
          
          <div className="row g-3">
            {categories.slice(0, 6).map((category) => (
              <div key={category.id} className="col-6 col-sm-4 col-md-2.4 col-lg-2">
                <div
                  className="category-pill bg-white border d-flex align-items-center gap-3 p-3 rounded-pill cursor-pointer hover-translate-y"
                  onClick={() => handleCategoryClick(category.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="category-dot rounded-circle overflow-hidden bg-light" style={{ width: '40px', height: '40px', display: 'block' }}>
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/all.jpg';
                      }}
                    />
                  </span>
                  <span className="category-text fw-semibold text-dark">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Meals */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Featured Meals</h4>
            <Link to={ROUTES.MENU} className="text-decoration-none fw-semibold text-primary-orange">
              Explore Menu <i className="bi bi-chevron-right" />
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="row g-4">
              {featuredMeals.slice(0, 3).map((item) => (
                <div key={item.id} className="col-md-4">
                  <Link to={`/menu/${item.id}`} className="text-decoration-none">
                    <div className="restaurant-card bg-white rounded-4 overflow-hidden border shadow-sm h-100 d-flex flex-column justify-content-between">
                      <div className="restaurant-img position-relative" style={{ height: '200px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/Pizza.jpg';
                          }}
                        />
                        {item.isPopular && (
                          <span className="position-absolute top-3 start-3 badge bg-danger rounded-pill px-3 py-2">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="restaurant-body p-4 flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                          <h5 className="fw-bold text-dark mb-1">{item.name}</h5>
                          <p className="text-muted small mb-3">{item.description}</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-auto">
                          <span className="rating fw-semibold text-warning d-flex align-items-center gap-1">
                            <i className="bi bi-star-fill text-warning" /> {item.rating}
                          </span>
                          <span className="text-dark fw-bold">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Meals Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Open Restaurants & Popular Picks</h4>
            <Link to={ROUTES.MENU} className="text-decoration-none fw-semibold text-primary-orange">
              See All <i className="bi bi-chevron-right" />
            </Link>
          </div>

          <div className="row g-4">
            {popularMeals.slice(0, 3).map((item) => (
              <div key={item.id} className="col-md-4">
                <Link to={`/menu/${item.id}`} className="text-decoration-none">
                  <div className="restaurant-card bg-white rounded-4 overflow-hidden border shadow-sm h-100">
                    <div className="restaurant-img" style={{ height: '180px' }}>
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
                    <div className="restaurant-body p-4">
                      <h6 className="fw-bold mb-1 text-dark">{item.name}</h6>
                      <p className="text-muted small mb-3">{item.categoryName} · {item.ingredients.join(', ')}</p>
                      <div className="d-flex align-items-center gap-3 small">
                        <span className="rating fw-semibold text-warning">
                          <i className="bi bi-star-fill" /> {item.rating}
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-truck text-primary-orange" /> {item.deliveryFee === 0 ? 'Free' : `$${item.deliveryFee}`}
                        </span>
                        <span className="text-muted">
                          <i className="bi bi-clock" /> {item.deliveryTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
