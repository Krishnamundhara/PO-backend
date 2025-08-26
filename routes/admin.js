const express = require('express');
const db = require('../config/db');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Route to verify data isolation and fix any issues
router.get('/verify-isolation', [auth, adminAuth], async (req, res) => {
  try {
    // Check all purchase orders
    const orderResult = await db.query(
      'SELECT id, order_no, created_by FROM purchase_orders WHERE created_by IS NULL'
    );

    // Check all company profiles
    const profileResult = await db.query(
      'SELECT id, company_name, user_id FROM company_profile WHERE user_id IS NULL'
    );

    // Log issues found
    console.log('Orders with missing created_by:', orderResult.rows.length);
    console.log('Company profiles with missing user_id:', profileResult.rows.length);

    // Fix purchase orders with missing created_by
    if (orderResult.rows.length > 0) {
      await db.query(
        'UPDATE purchase_orders SET created_by = 1 WHERE created_by IS NULL'
      );
      console.log('Fixed purchase orders with missing created_by');
    }

    // Fix company profiles with missing user_id
    if (profileResult.rows.length > 0) {
      await db.query(
        'UPDATE company_profile SET user_id = 1 WHERE user_id IS NULL'
      );
      console.log('Fixed company profiles with missing user_id');
    }

    res.json({
      message: 'Data isolation verification completed',
      issues: {
        ordersWithMissingUser: orderResult.rows.length,
        profilesWithMissingUser: profileResult.rows.length,
        fixed: orderResult.rows.length > 0 || profileResult.rows.length > 0
      }
    });
  } catch (err) {
    console.error('Error verifying data isolation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
