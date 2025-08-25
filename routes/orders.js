const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all purchase orders for the current user
router.get('/', auth, async (req, res) => {
  try {
    // Only fetch orders created by the current user
    const result = await db.query(
      `SELECT po.*, u.username as created_by_username 
       FROM purchase_orders po
       JOIN users u ON po.created_by = u.id
       WHERE po.created_by = $1
       ORDER BY po.order_date DESC`,
       [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get purchase order by ID (only if created by current user)
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT po.*, u.username as created_by_username 
       FROM purchase_orders po
       JOIN users u ON po.created_by = u.id
       WHERE po.id = $1 AND po.created_by = $2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching purchase order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new purchase order
router.post('/', [
  auth,
  check('order_no', 'Order number is required').not().isEmpty(),
  check('order_date', 'Valid order date is required').isDate(),
  check('customer', 'Customer name is required').not().isEmpty()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    order_no, 
    order_date, 
    customer, 
    broker, 
    mill, 
    weight, 
    bags, 
    product, 
    rate, 
    terms_conditions 
  } = req.body;

  try {
    // Check if order number already exists
    let result = await db.query(
      'SELECT * FROM purchase_orders WHERE order_no = $1',
      [order_no]
    );

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Order number already exists' });
    }

    // Insert new purchase order
    result = await db.query(
      `INSERT INTO purchase_orders 
      (order_no, order_date, customer, broker, mill, weight, bags, product, rate, terms_conditions, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [order_no, order_date, customer, broker, mill, weight, bags, product, rate, terms_conditions, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating purchase order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a purchase order
router.put('/:id', [
  auth,
  check('order_no', 'Order number is required').not().isEmpty(),
  check('order_date', 'Valid order date is required').isDate(),
  check('customer', 'Customer name is required').not().isEmpty()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    order_no, 
    order_date, 
    customer, 
    broker, 
    mill, 
    weight, 
    bags, 
    product, 
    rate, 
    terms_conditions 
  } = req.body;

  try {
    // Check if order exists and belongs to current user
    let result = await db.query(
      'SELECT * FROM purchase_orders WHERE id = $1 AND created_by = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found or unauthorized' });
    }

    // Check if order number already exists for a different order
    result = await db.query(
      'SELECT * FROM purchase_orders WHERE order_no = $1 AND id != $2',
      [order_no, req.params.id]
    );

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Order number already exists' });
    }

    // Update the purchase order
    result = await db.query(
      `UPDATE purchase_orders SET 
      order_no = $1, 
      order_date = $2, 
      customer = $3, 
      broker = $4, 
      mill = $5, 
      weight = $6, 
      bags = $7, 
      product = $8, 
      rate = $9, 
      terms_conditions = $10,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 
      RETURNING *`,
      [order_no, order_date, customer, broker, mill, weight, bags, product, rate, terms_conditions, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating purchase order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a purchase order (only if created by current user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM purchase_orders WHERE id = $1 AND created_by = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found or unauthorized' });
    }

    res.json({ message: 'Purchase order deleted successfully' });
  } catch (err) {
    console.error('Error deleting purchase order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
