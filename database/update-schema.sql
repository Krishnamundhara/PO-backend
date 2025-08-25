-- update-schema.sql
-- Safe database schema update script that preserves existing data

-- Check if tables exist before creating them
DO $$ 
BEGIN
    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add admin user
        INSERT INTO users (name, email, password, role) 
        VALUES ('Admin', 'admin@example.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1KgTXW', 'admin');
    END IF;

    -- Create company_profile table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'company_profile') THEN
        CREATE TABLE company_profile (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            address TEXT,
            phone VARCHAR(50),
            email VARCHAR(255),
            website VARCHAR(255),
            logo_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add default company profile
        INSERT INTO company_profile (company_name, address, phone, email, website)
        VALUES ('My Company', '123 Business Street, City, Country', '+1234567890', 'info@mycompany.com', 'https://www.mycompany.com');
    END IF;

    -- Create purchase_orders table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'purchase_orders') THEN
        CREATE TABLE purchase_orders (
            id SERIAL PRIMARY KEY,
            po_number VARCHAR(50) UNIQUE NOT NULL,
            vendor_name VARCHAR(255) NOT NULL,
            issue_date DATE NOT NULL,
            delivery_date DATE,
            items JSONB NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            total_amount DECIMAL(15, 2) NOT NULL,
            notes TEXT,
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Add new columns to existing tables if they don't exist
DO $$
BEGIN
    -- Add timestamps to users table if they don't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Add role to users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
    END IF;
    
    -- Add missing columns to purchase_orders table
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'notes') THEN
        ALTER TABLE purchase_orders ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'created_by') THEN
        ALTER TABLE purchase_orders ADD COLUMN created_by INTEGER REFERENCES users(id);
    END IF;
    
    -- Add missing columns to company_profile table
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'company_profile' AND column_name = 'logo_url') THEN
        ALTER TABLE company_profile ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- Update admin password if it exists and hasn't been updated
UPDATE users
SET password = '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1KgTXW'
WHERE email = 'admin@example.com'
AND role = 'admin';

-- Create indexes for performance (with safety checks)
DO $$
BEGIN
    -- Check if purchase_orders table and po_number column exist before creating index
    IF EXISTS (
        SELECT FROM information_schema.tables WHERE table_name = 'purchase_orders'
    ) AND EXISTS (
        SELECT FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'po_number'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_po_number'
    ) THEN
        CREATE INDEX idx_po_number ON purchase_orders (po_number);
    END IF;

    -- Check if purchase_orders table and vendor_name column exist before creating index
    IF EXISTS (
        SELECT FROM information_schema.tables WHERE table_name = 'purchase_orders'
    ) AND EXISTS (
        SELECT FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'vendor_name'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vendor_name'
    ) THEN
        CREATE INDEX idx_vendor_name ON purchase_orders (vendor_name);
    END IF;

    -- Check if users table and email column exist before creating index
    IF EXISTS (
        SELECT FROM information_schema.tables WHERE table_name = 'users'
    ) AND EXISTS (
        SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_email'
    ) THEN
        CREATE INDEX idx_user_email ON users (email);
    END IF;
END $$;
