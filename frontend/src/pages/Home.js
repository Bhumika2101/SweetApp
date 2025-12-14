import React from "react";
import { Link } from "react-router-dom";
import {
  FaStore,
  FaCookie,
  FaShoppingCart,
  FaUserShield,
} from "react-icons/fa";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Sweet Shop
            <FaCookie className="title-icon" />
          </h1>
          <p className="hero-subtitle">
            Your one-stop destination for all things sweet and delicious!
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline btn-large">
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Sweet Shop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaStore />
              </div>
              <h3>Wide Selection</h3>
              <p>
                Browse through our extensive collection of sweets from various
                categories
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaShoppingCart />
              </div>
              <h3>Easy Shopping</h3>
              <p>
                Simple and intuitive interface to purchase your favorite sweets
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUserShield />
              </div>
              <h3>Admin Control</h3>
              <p>
                Comprehensive admin panel for managing inventory and products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to indulge?</h2>
          <p>Join our sweet community today and start exploring!</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
