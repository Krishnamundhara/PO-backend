-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create company profile table
CREATE TABLE IF NOT EXISTS company_profile (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    address TEXT,
    mobile VARCHAR(20),
    email VARCHAR(255),
    gst_number VARCHAR(100),
    bank_details TEXT,
    logo_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create purchase orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    order_no VARCHAR(100) UNIQUE NOT NULL,
    order_date DATE NOT NULL,
    customer VARCHAR(255) NOT NULL,
    broker VARCHAR(255),
    mill VARCHAR(255),
    weight DECIMAL(10, 2),
    bags INTEGER,
    product VARCHAR(255),
    rate DECIMAL(10, 2),
    terms_conditions TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, role)
VALUES ('admin', '$2b$10$2pXKV.zUDuJnNBrOlVRw2.OGDAy1Z6qJL71LXh47FRf/CfhMvUPm6', 'admin@example.com', 'admin')
ON CONFLICT (username) DO NOTHING;
