import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './Footer.css';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5 px-3 px-md-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-warning mb-3">Burgerizza</h5>
            <p className="small text-white-50">
              Delicious food delivered to your doorstep. Experience the best
              taste in town with our curated menu.
            </p>
            <div className="d-flex gap-3 social-links">
              <a href="#" className="text-white-50">
                <i className="bi bi-facebook" />
              </a>
              <a href="#" className="text-white-50">
                <i className="bi bi-twitter-x" />
              </a>
              <a href="#" className="text-white-50">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="text-white-50">
                <i className="bi bi-whatsapp" />
              </a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to={ROUTES.HOME} className="text-white-50 text-decoration-none footer-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to={ROUTES.MENU} className="text-white-50 text-decoration-none footer-link">
                  Menu
                </Link>
              </li>
              <li className="mb-2">
                <Link to={ROUTES.CATEGORIES} className="text-white-50 text-decoration-none footer-link">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2 text-warning" /> 123 Food Street, City
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2 text-warning" /> +1 234 567 890
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2 text-warning" /> support@burgerizza.com
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p className="small text-white-50">
              Subscribe for latest updates.
            </p>
            {subscribed ? (
              <div className="alert alert-success py-1.5 px-3 fs-7" role="alert">
                Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-wrapper">
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="footer-newsletter-btn" type="submit">
                  <i className="bi bi-send-fill" />
                </button>
              </form>
            )}
          </div>
        </div>
        
        <hr className="border-secondary opacity-25" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small text-white-50 mb-0">
              © {new Date().getFullYear()} Burgerizza. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="small">
              <a href="#" className="text-white-50 text-decoration-none me-3 footer-link">
                Privacy Policy
              </a>
              <a href="#" className="text-white-50 text-decoration-none footer-link">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
