-- Ensure the purchase_orders table has a NOT NULL constraint on created_by
ALTER TABLE purchase_orders ALTER COLUMN created_by SET NOT NULL;

-- Add indexes to improve query performance for filtering by user
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_by ON purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_company_profile_user_id ON company_profile(user_id);
