import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import ProductCard from './ProductCard';
import Spinner from '../ui/Spinner';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const { items, categories, loading, updateParams } = useMenu({
    categoryId: categoryParam,
    search: searchParam,
  });

  // Sync route query params to custom useMenu hook filters
  useEffect(() => {
    updateParams({
      categoryId: categoryParam,
      search: searchParam,
    });
  }, [categoryParam, searchParam]);

  const handleCategorySelect = (categoryId: string) => {
    setSearchParams((prev) => {
      if (categoryId === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', categoryId);
      }
      return prev;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      if (!val) {
        prev.delete('search');
      } else {
        prev.set('search', val);
      }
      return prev;
    });
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="fw-bold mb-2">Our Delicious Menu</h1>
          <p className="text-muted">Fresh, fast, and full of flavor</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="menu-search-wrapper">
            <i className="bi bi-search menu-search-icon" />
            <input
              type="text"
              className="menu-search-input"
              placeholder="Search food items..."
              value={searchParam}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="col-md-6 col-lg-8 d-flex justify-content-md-end">
          <ul className="nav nav-pills gap-2 flex-wrap">
            {categories.map((cat) => (
              <li key={cat.id} className="nav-item">
                <button
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`category-pill-tab ${categoryParam === cat.id ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <Spinner size="lg" className="my-5" />
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown text-muted" style={{ fontSize: '3rem' }} />
          <h4 className="fw-bold mt-3">No Items Found</h4>
          <p className="text-muted">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-lg-4">
              <ProductCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
