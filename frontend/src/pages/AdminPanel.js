import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaBox } from "react-icons/fa";
import { sweetAPI } from "../services/api";
import SweetCard from "../components/SweetCard";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    category: "Chocolate",
    price: "",
    quantity: "",
    description: "",
    image: "",
  });

  const categories = [
    "Chocolate",
    "Candy",
    "Gummy",
    "Lollipop",
    "Cake",
    "Cookie",
    "Other",
  ];

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await sweetAPI.getAll();
      if (response.data.success) {
        setSweets(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSweet) {
        const response = await sweetAPI.update(editingSweet._id, formData);
        if (response.data.success) {
          toast.success("Sweet updated successfully");
        }
      } else {
        const response = await sweetAPI.create(formData);
        if (response.data.success) {
          toast.success("Sweet created successfully");
        }
      }

      setShowModal(false);
      setEditingSweet(null);
      resetForm();
      fetchSweets();
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || "",
      image: sweet.image || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm("Are you sure you want to delete this sweet?")) {
      try {
        const response = await sweetAPI.delete(sweetId);
        if (response.data.success) {
          toast.success("Sweet deleted successfully");
          fetchSweets();
        }
      } catch (error) {
        toast.error("Failed to delete sweet");
      }
    }
  };

  const handleRestock = async () => {
    try {
      const response = await sweetAPI.restock(
        restockingSweet._id,
        restockQuantity
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setShowRestockModal(false);
        setRestockingSweet(null);
        setRestockQuantity(10);
        fetchSweets();
      }
    } catch (error) {
      toast.error("Failed to restock");
    }
  };

  const openRestockModal = (sweet) => {
    setRestockingSweet(sweet);
    setShowRestockModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Chocolate",
      price: "",
      quantity: "",
      description: "",
      image: "",
    });
  };

  const openAddModal = () => {
    setEditingSweet(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage your sweet inventory</p>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FaPlus /> Add New Sweet
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Sweets</h3>
            <p className="stat-value">{sweets.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Stock</h3>
            <p className="stat-value">
              {sweets.reduce((sum, sweet) => sum + sweet.quantity, 0)}
            </p>
          </div>
          <div className="stat-card">
            <h3>Out of Stock</h3>
            <p className="stat-value danger">
              {sweets.filter((sweet) => sweet.quantity === 0).length}
            </p>
          </div>
        </div>

        <div className="sweets-grid">
          {sweets.map((sweet) => (
            <div key={sweet._id} className="admin-sweet-card">
              <SweetCard
                sweet={sweet}
                isAdmin={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <button
                className="btn btn-success btn-restock"
                onClick={() => openRestockModal(sweet)}
              >
                <FaBox /> Restock
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingSweet ? "Edit Sweet" : "Add New Sweet"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSweet ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRestockModal(false)}
        >
          <div
            className="modal-content modal-small"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Restock {restockingSweet?.name}</h2>
            <p className="current-stock">
              Current Stock: <strong>{restockingSweet?.quantity}</strong>
            </p>
            <div className="form-group">
              <label>Quantity to Add</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value))}
              />
            </div>
            <p className="new-stock">
              New Stock:{" "}
              <strong>{restockingSweet?.quantity + restockQuantity}</strong>
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowRestockModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleRestock}>
                Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
