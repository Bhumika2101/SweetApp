import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStore,
  FaSignOutAlt,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <FaStore className="brand-icon" />
          <span>Sweet Shop</span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="nav-link admin-link">
                  <FaUserShield /> Admin Panel
                </Link>
              )}
              <div className="user-info">
                <FaUserCircle className="user-icon" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline logout-btn"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
