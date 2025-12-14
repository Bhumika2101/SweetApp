import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { sweetAPI } from "../services/api";
import SweetCard from "../components/SweetCard";
import SearchBar from "../components/SearchBar";
import "./Dashboard.css";

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState(4000);

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [sweets, searchTerm, category, priceRange]);

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

  const filterSweets = () => {
    let filtered = sweets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((sweet) =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((sweet) => sweet.category === category);
    }

    // Filter by price
    filtered = filtered.filter((sweet) => sweet.price <= priceRange);

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweetId) => {
    try {
      const response = await sweetAPI.purchase(sweetId, 1);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSweets(); // Refresh the list
      }
    } catch (error) {
      const message = error.response?.data?.message || "Purchase failed";
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading sweets...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Sweet Collection</h1>
          <p>Explore our delicious selection of sweets</p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />

        {filteredSweets.length === 0 ? (
          <div className="no-results">
            <h3>No sweets found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>
                Showing {filteredSweets.length} of {sweets.length} sweets
              </p>
            </div>
            <div className="sweets-grid">
              {filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet._id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  isAdmin={false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
