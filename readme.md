# 📦 Purchase Order Management System

## 📖 Project Overview
This is a comprehensive **full-stack web application** for managing **purchase orders** with role-based access control and data isolation between users.

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Secure Login System** with JWT authentication
- **Role-based access control** (Admin/User)
- **Protected routes** for authenticated users
- **Password encryption** for enhanced security

### 👥 User Management
- **Multi-tenant architecture** with data isolation between users
- **Admin dashboard** for user management
  - Add/edit/delete users
  - Update user roles and permissions
  - Reset user passwords
  - View all user accounts

### 📝 Purchase Order Management
- **Create, read, update, and delete** purchase orders
- **Data fields include**:
  - Order Number (unique identifier)
  - Order Date
  - Customer Information
  - Broker Details
  - Mill Information
  - Weight and Quantity (Bags)
  - Product Specifications
  - Rate/Price
  - Terms & Conditions
- **Data validation** to ensure accuracy
- **Search and filter** capabilities
- **Data isolation** - users can only access their own purchase orders

### 🏢 Company Profile Management
- **Personalized company profiles** for each user
- **Company details** including:
  - Company Name
  - Address
  - Contact Information (Mobile/Email)
  - GST Number
  - Bank Details
- **Logo upload functionality**
- **Custom letterhead** for purchase order PDFs

## 🏗️ Technical Architecture

### 🌐 Frontend
- **React.js** - Component-based UI library
- **TailwindCSS** - Utility-first CSS framework for styling
- **React Router** - For navigation and routing
- **Axios** - HTTP client for API requests
- **Context API** - For state management (authentication, etc.)
- **React Query** - For efficient data fetching and caching
- **React Hook Form** - For form validation

### 🖥️ Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Prisma** - ORM for database access
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - For password hashing
- **Multer** - For file uploads

### 📡 API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (admin only)

#### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

#### Purchase Orders
- `GET /api/orders` - Get all orders for current user
- `GET /api/orders/:id` - Get specific order by ID
- `POST /api/orders` - Create new purchase order
- `PUT /api/orders/:id` - Update existing order
- `DELETE /api/orders/:id` - Delete order

#### Company Profile
- `GET /api/company` - Get company profile for current user
- `POST /api/company` - Create or update company profile

## 🔒 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Data Isolation** - Users can only access their own data
- **Password Hashing** - Secure storage of user credentials
- **Role-based Authorization** - Different permissions for admins and regular users
- **Protected API Endpoints** - Authentication middleware for secure routes
- **CORS Configuration** - Controlled access to the API

## 🚀 Deployment

The application is deployed with a decoupled architecture:

### Backend
- **Platform**: Render
- **URL**: https://po-backend-hfh9.onrender.com
- **Environment Variables**:
  - `PORT` - Server port
  - `DATABASE_URL` - PostgreSQL connection string
  - `JWT_SECRET` - Secret key for JWT signing
  - `NODE_ENV` - Environment (development/production)

### Frontend
- **Platform**: Netlify
- **URL**: https://po-sys.netlify.app
- **Environment Variables**:
  - `REACT_APP_API_URL` - Backend API URL

## 🧠 Application Logic & Workflow

### User Workflow
1. **Login** - User authenticates with username and password
2. **Dashboard** - View summary of purchase orders
3. **Purchase Orders** - Create, view, edit, and delete purchase orders
4. **Company Profile** - Set up or edit company information
5. **Logout** - Securely end the session

### Admin Workflow
1. **Login** - Admin authenticates with admin credentials
2. **Dashboard** - View system-wide summary
3. **Users Management** - Add, edit, delete users and reset passwords
4. **Purchase Orders** - Manage purchase orders
5. **Company Profile** - Manage company information
6. **Logout** - Securely end the session

### Multi-tenant Architecture
- Each user has their own isolated data environment
- Users cannot access data belonging to other users
- Admins have special privileges to manage user accounts

## 💻 Development Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Krishnamundhara/PO-backend.git

# Navigate to backend directory
cd PO-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Krishnamundhara/PO-frontend.git

# Navigate to frontend directory
cd PO-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start the development server
npm start
```

## 🌟 Future Enhancements
- **Email Notifications** for new purchase orders
- **PDF Generation** for purchase orders
- **Advanced Analytics** and reporting
- **Mobile App** for on-the-go access
- **Integration with Accounting Software**
  - Orders can be **edited anytime**.
  - Orders can be **exported as A4-size PDF bills**.
- **Company Profile Management**:
  - Upload company logo.
  - Add company name, address, mobile number, email, GST number, and bank details.
  - These details will appear at the **top of the generated PDF bill**.

The app will be **responsive** and accessible on any device (desktop, tablet, mobile).

## Implementation Status
🎉 **This project has been implemented!** The tech stack used is:
- **Frontend**: React.js + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (NeonDB)
- **Authentication**: JWT-based login system
- **PDF Generation**: jsPDF + jspdf-autotable

## 🚀 Production Deployment
For full production deployment instructions, see:
- [PRODUCTION.md](PRODUCTION.md) - Production build instructions
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment options including Docker

### Quick Deployment
Use the provided deployment scripts:
- On Linux/MacOS: `./deploy.sh`
- On Windows: `.\deploy.ps1`

### System Health Checks
- Environment Check: `node backend/check-environment.js`
- Backend Health Check: `node backend/backend-health-check.js`
- Database Backup: `node backend/backup-db.js`

### Default Login
- Admin User:
  - Email: admin@example.com
  - Password: Admin@123

---

## ⚙️ Features Breakdown

### 🔐 Authentication
- **User Login System**.
- **Admin Role**:
  - Add new users.
  - Delete existing users.
- **User Role**:
  - Create and manage purchase orders.

### 🧭 Navigation
- Fixed sidebar for:
  - Dashboard
  - Users (Admin only)
  - Purchase Orders
  - Reports / Downloads
  - Company Profile Settings

### 📝 Purchase Orders
- Input fields:
  - Date  
  - Order Number  
  - Customer  
  - Broker  
  - Mill  
  - Weight  
  - Bags  
  - Product  
  - Rate  
  - Terms & Conditions  
- Save purchase order in database.
- Edit existing purchase orders.
- Download purchase order as **PDF (A4 size)**.

### 🏢 Company Profile
- Upload and save:
  - Logo  
  - Company Name  
  - Address  
  - Mobile Number  
  - Email  
  - GST Number  
  - Bank Details  
- Auto-display these details as a **header on generated PDFs**.

---

## 🛠️ Tech Stack Suggestion
- **Frontend**: React.js (with TailwindCSS / Bootstrap for UI)
- **Backend**: Node.js + Express.js OR Django (Python)
- **Authentication**: Firebase Auth or JWT-based system
- **Database**: Firebase Firestore / PostgreSQL / MySQL
- **PDF Generation**: jsPDF / Puppeteer (Node) or ReportLab (Python)
- **Deployment**:  
  - Frontend → Vercel / Netlify  
  - Backend → Render / Railway / Firebase Functions  
  - Database → Firebase / Supabase / PostgreSQL Cloud  

---

## 📂 Project Structure (Example)

purchase-order-app/
│── frontend/ # React.js frontend with sidebar + forms
│ ├── src/components/
│ ├── src/pages/
│ ├── src/utils/
│ └── ...
│
│── backend/ # Node.js/Express.js or Django API
│ ├── routes/
│ ├── models/
│ ├── controllers/
│ └── ...
│
│── database/ # DB schema, migrations, config
│
│── README.md # Project instructions

---

## 🚀 Core Flow
1. **User logs in** → Auth system verifies credentials.
2. **Dashboard loads** with sidebar navigation.
3. **Admin** can add/delete users.
4. **User** opens Purchase Order form, enters details, and clicks **Save**.
5. Data is stored in **database**.
6. User can **edit existing purchase orders**.
7. User can **download purchase order as PDF** with **company details header**.
8. **Company profile page** allows uploading/updating logo & details → auto-updated on future PDFs.

---

## 📅 Development Roadmap (Suggested)
- **Week 1–2**: Setup project, implement login/authentication.
- **Week 3**: Create sidebar navigation + role-based access.
- **Week 4**: Build purchase order form + database integration.
- **Week 5**: Implement edit + PDF generation.
- **Week 6**: Add company profile module (logo/details).
- **Week 7**: Testing, bug fixes, responsive design.
- **Week 8**: Deployment to production.

---

## ✅ Future Enhancements
- Search & filter purchase orders.
- Email PDF bill directly to customer.
- Multi-language support.
- Analytics Dashboard (total orders, revenue, etc.).

---

## � Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure PostgreSQL:
   - Create a database named `po_system`
   - Update the `.env` file with your PostgreSQL credentials

4. Initialize the database:
   ```
   node init-db.js
   ```

5. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Default Login Credentials
- **Username**: admin
- **Password**: admin123

---

## �📌 Author
Project idea and requirements by **Krishna** 👨‍💻  
