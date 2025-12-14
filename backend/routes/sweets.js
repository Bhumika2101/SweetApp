const express = require('express');
const { body } = require('express-validator');
const {
  getSweets,
  getSweet,
  createSweet,
  updateSweet,
  deleteSweet,
  searchSweets,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweetController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const sweetValidation = [
  body('name').trim().notEmpty().withMessage('Sweet name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
];

// Public routes
router.get('/', getSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweet);

// Protected routes
router.post('/', protect, authorize('admin'), sweetValidation, createSweet);
router.put('/:id', protect, authorize('admin'), updateSweet);
router.delete('/:id', protect, authorize('admin'), deleteSweet);

// Inventory routes
router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, authorize('admin'), restockSweet);

module.exports = router;
