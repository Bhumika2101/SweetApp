import React from "react";
import { FaShoppingCart, FaBox } from "react-icons/fa";
import "./SweetCard.css";

const SweetCard = ({ sweet, onPurchase, isAdmin, onEdit, onDelete }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="sweet-card">
      <div className="sweet-image-container">
        <img src={sweet.image} alt={sweet.name} className="sweet-image" />
        {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
        <div className="category-badge">{sweet.category}</div>
      </div>

      <div className="sweet-content">
        <h3 className="sweet-name">{sweet.name}</h3>
        {sweet.description && (
          <p className="sweet-description">{sweet.description}</p>
        )}

        <div className="sweet-info">
          <div className="sweet-price">₹{sweet.price}</div>
          <div
            className={`sweet-quantity ${isOutOfStock ? "out-of-stock" : ""}`}
          >
            <FaBox /> {sweet.quantity} in stock
          </div>
        </div>

        <div className="sweet-actions">
          {!isAdmin ? (
            <button
              className="btn btn-success"
              onClick={() => onPurchase(sweet._id)}
              disabled={isOutOfStock}
            >
              <FaShoppingCart /> {isOutOfStock ? "Out of Stock" : "Purchase"}
            </button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => onEdit(sweet)}>
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(sweet._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;
