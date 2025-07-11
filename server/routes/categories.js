const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/categories - Create a new category (protected)
router.post(
  '/',
  auth,
  [body('name').notEmpty().withMessage('Name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
      let category = await Category.findOne({ name });
      if (category) {
        return res.status(400).json({ errors: [{ msg: 'Category already exists' }] });
      }
      category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router; 