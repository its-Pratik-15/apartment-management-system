# Apartment Management System

> A comprehensive web application for managing apartment complexes with role-based access control, billing management, visitor tracking, and issue resolution.

## 🎯 Problem & Solution

**Problem:** Traditional apartment management relies on manual processes, paper-based records, and disconnected systems, leading to inefficiencies, communication gaps, and poor resident experience.

**Solution:** A unified digital platform that automates billing, streamlines visitor management, enables issue tracking, and provides role-based dashboards for all stakeholders (owners, tenants, staff, guards, and administrators).

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Express API    │    │  MySQL/PostgreSQL│
│                 │    │                 │    │                 │
│ • Auth Context  │◄──►│ • JWT Auth      │◄──►│ • Prisma ORM    │
│ • Role Dashboards│    │ • RBAC Middleware│   │ • Relationships │
│ • Responsive UI │    │ • Input Validation│   │ • Migrations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks & Context API
- React Router DOM for navigation
- Axios for API communication
- Tailwind CSS for responsive design

**Backend:**
- Node.js with Express.js framework
- Prisma ORM with MySQL (dev) / PostgreSQL (prod)
- JWT Authentication with bcrypt hashing
- Express-validator for input validation
- CORS and security middleware

**Database:**
- Development: MySQL
- Production: PostgreSQL
- Automated migrations and seeding

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **OWNER** | View bills, tenant details, property information |
| **TENANT** | Pay bills, manage visitors, report issues |
| **SECRETARY** | Full admin access, user management, analytics |
| **STAFF** | Issue management, maintenance tracking |
| **GUARD** | Visitor entry/exit, security monitoring |

## ✨ Key Features

### 🏠 Smart Property Management
- **Flat Management**: Owner assignment, occupancy tracking
- **Lease Lifecycle**: Automated lease expiration and renewals
- **Occupancy Status**: Real-time OWNER_OCCUPIED/TENANT_OCCUPIED tracking

### 💰 Intelligent Billing System
- **Auto-Assignment**: Bills assigned based on occupancy rules
  - Tenant-occupied: RENT/UTILITIES → Tenant, MAINTENANCE → Owner
  - Owner-occupied: All bills → Owner
- **Payment Tracking**: DUE/PAID/OVERDUE status with late fees
- **Dashboard Analytics**: Financial summaries and trends

### 🚪 Visitor Management
- **Entry/Exit Tracking**: Complete audit trail with timestamps
- **Approval Workflow**: Resident approval for visitor access
- **Guard Interface**: Mobile-optimized entry forms
- **Real-time Status**: Live visitor count and pending approvals

### 🔧 Issue Resolution System
- **Multi-Category Support**: Maintenance, plumbing, electrical, security
- **Priority Management**: LOW/MEDIUM/HIGH/URGENT classification
- **Status Tracking**: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- **Staff Assignment**: Issue routing to appropriate personnel

### 📢 Communication Hub
- **Role-Based Notices**: Targeted announcements
- **Pinned Messages**: Important updates highlighted
- **Real-time Updates**: Instant notification system

## 📱 Screenshots

### Dashboard Views
![Secretary Dashboard](./docs/screenshots/secretary-dashboard.png)
*Secretary Dashboard - Complete system overview with analytics*

![Owner Dashboard](./docs/screenshots/owner-dashboard.png)
*Owner Dashboard - Property and financial management*

### Core Features
![Visitor Management](./docs/screenshots/visitor-management.png)
*Visitor Management - Entry/exit tracking with approval workflow*

![Bill Management](./docs/screenshots/bill-management.png)
*Smart Billing System - Automated assignment and payment tracking*

![Issue Tracking](./docs/screenshots/issue-tracking.png)
*Issue Management - Complete lifecycle from report to resolution*

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL (development) or PostgreSQL (production)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/its-Pratik-15/apartment-management-system.git
cd apartment-management-system

# Backend setup
cd backend && npm install
cp .env.example .env

# Frontend setup  
cd ../frontend && npm install
cp .env.example .env
```

### 2. Database Setup
```bash
# MySQL (Development)
mysql -u root -p
CREATE DATABASE apartment_management;

# Configure backend/.env
DATABASE_URL="mysql://root:password@localhost:3306/apartment_management"
```

### 3. Initialize Database
```bash
cd backend
npm run db:generate
npm run db:migrate  
npm run db:seed
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend (Port 5001)
cd backend && npm run dev

# Terminal 2 - Frontend (Port 3000)  
cd frontend && npm start
```

### 5. Login & Explore
Visit `http://localhost:3000` and use demo credentials:
- **Secretary**: secretary@apartment.com / password123
- **Owner**: owner1@apartment.com / password123
- **Tenant**: tenant1@apartment.com / password123

## 🌐 Deployment

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:pass@host:5432/apartment_management"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5001
NODE_ENV="production"
FRONTEND_URL="https://your-frontend-domain.com"
```

**Frontend (.env):**
```env
REACT_APP_API_URL="https://your-backend-domain.com/api"
```

### Production Deployment

#### Backend (Railway/Render/Vercel)
```bash
# 1. Prisma schema is already configured for PostgreSQL
# 2. Set up Supabase PostgreSQL database
# 3. Configure environment variables:

# Supabase PostgreSQL URLs
DATABASE_URL="postgresql://postgres.ulpjfiifqsbjlcqubawu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.ulpjfiifqsbjlcqubawu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# 4. Run migrations and seed
npm run db:generate
npm run db:migrate
npm run db:seed
```

#### Frontend (Vercel/Netlify)
```bash
# 1. Build for production
npm run build

# 2. Deploy to Vercel
npx vercel --prod

# 3. Set environment variables in dashboard
REACT_APP_API_URL="https://your-backend-domain.com/api"
```

## 📁 Project Structure

```
apartment-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers & business logic
│   │   ├── routes/          # API endpoint definitions  
│   │   ├── middlewares/     # Auth, RBAC, validation
│   │   ├── services/        # Background jobs & utilities
│   │   ├── utils/           # Helper functions
│   │   └── prisma/          # Database schema & migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── contexts/        # React Context providers
│   │   ├── services/        # API integration layer
│   │   └── utils/           # Frontend utilities
│   └── package.json
└── docs/                    # Documentation & screenshots
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Development server with hot reload
npm start           # Production server
npm run db:migrate  # Run database migrations
npm run db:seed     # Populate with sample data
npm run db:studio   # Open Prisma Studio GUI
```

### Frontend  
```bash
npm start           # Development server (Port 3000)
npm run build       # Production build
npm test           # Run test suite
```

## 🧪 API Documentation

### Authentication Endpoints
```
POST /api/auth/login     # User login
POST /api/auth/register  # User registration  
GET  /api/auth/profile   # Get user profile
PUT  /api/auth/profile   # Update profile
```

### Core Resource Endpoints
```
GET    /api/users        # List users (Admin only)
POST   /api/users        # Create user (Admin only)
GET    /api/flats        # List flats
POST   /api/bills        # Create bill (Secretary only)
GET    /api/visitors     # List visitors (Role-based)
POST   /api/issues       # Report issue
```

All endpoints return consistent JSON responses:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Role-Based Access Control** (RBAC) middleware
- **Input Validation** on all endpoints
- **Password Hashing** with bcrypt
- **CORS Protection** with origin validation
- **SQL Injection Prevention** via Prisma ORM
- **Environment Variable** security

## 🎯 Design Decisions & Trade-offs

### 1. **MySQL (Dev) → PostgreSQL (Prod)**
- **Decision**: Use MySQL locally, PostgreSQL in production
- **Rationale**: MySQL easier for local setup, PostgreSQL better for production scaling
- **Trade-off**: Requires schema provider switching, but Prisma handles differences

### 2. **Role-Based Bill Assignment**
- **Decision**: Automatic bill assignment based on occupancy status
- **Rationale**: Reduces manual work and prevents billing errors
- **Trade-off**: Less flexibility, but more consistency

### 3. **Context API vs Redux**
- **Decision**: React Context for state management
- **Rationale**: Simpler setup, sufficient for app complexity
- **Trade-off**: Less powerful than Redux, but adequate for current needs

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Core CRUD operations
- ✅ Role-based authentication
- ✅ Responsive UI design
- ✅ Basic reporting

### Phase 2 (Next)
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Email integration

### Phase 3 (Future)
- [ ] Multi-property support
- [ ] Payment gateway integration
- [ ] Document management
- [ ] Maintenance scheduling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pratik Kumar**
- GitHub: [@its-Pratik-15](https://github.com/its-Pratik-15)
- LinkedIn: [Pratik Kumar](https://linkedin.com/in/pratik-kumar)

---

⭐ **Star this repo if you find it helpful!**

Built with ❤️ for efficient apartment management