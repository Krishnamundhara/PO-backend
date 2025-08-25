-- Add user_id column to company_profile table
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Initially set all existing company profiles to be associated with user id 1 (admin)
-- Only do this if there are existing records without user_id
UPDATE company_profile SET user_id = 1 WHERE user_id IS NULL;

-- Make user_id NOT NULL for future inserts
ALTER TABLE company_profile ALTER COLUMN user_id SET NOT NULL;
