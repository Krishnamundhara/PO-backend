-- Add user_id column to company_profile table
ALTER TABLE company_profile ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Get first user from the users table
DO $$
DECLARE
  first_user_id INTEGER;
BEGIN
  SELECT id INTO first_user_id FROM users ORDER BY id LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    -- Initially set all existing company profiles to be associated with first user
    UPDATE company_profile SET user_id = first_user_id WHERE user_id IS NULL;
  END IF;
END $$;

-- Make user_id NOT NULL for future inserts only if we have assigned all existing records
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM company_profile WHERE user_id IS NULL;
  
  IF null_count = 0 THEN
    ALTER TABLE company_profile ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;
