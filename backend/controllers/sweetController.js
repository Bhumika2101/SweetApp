const { validationResult } = require('express-validator');
const Sweet = require('../models/Sweet');

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Public
exports.getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().populate('createdBy', 'name email');
    
    res.json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single sweet
// @route   GET /api/sweets/:id
// @access  Public
exports.getSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    res.json({
      success: true,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Public
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    // Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const sweets = await Sweet.find(query).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new sweet
// @route   POST /api/sweets
// @access  Private/Admin
exports.createSweet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, category, price, quantity, description, image } = req.body;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description,
      image,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: sweet
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A sweet with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
exports.updateSweet = async (req, res) => {
  try {
    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    const { name, category, price, quantity, description, image } = req.body;

    sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { name, category, price, quantity, description, image },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    await sweet.deleteOne();

    res.json({
      success: true,
      message: 'Sweet deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Purchase sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
exports.purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    const { quantity } = req.body;
    const purchaseQuantity = quantity || 1;

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    sweet.quantity -= purchaseQuantity;
    await sweet.save();

    res.json({
      success: true,
      message: `Successfully purchased ${purchaseQuantity} ${sweet.name}(s)`,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Restock sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
exports.restockSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    const { quantity } = req.body;
    const restockQuantity = quantity || 1;

    if (restockQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Restock quantity must be at least 1'
      });
    }

    sweet.quantity += restockQuantity;
    await sweet.save();

    res.json({
      success: true,
      message: `Successfully restocked ${restockQuantity} ${sweet.name}(s)`,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
