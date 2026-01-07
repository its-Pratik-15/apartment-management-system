# Apartment Management System

A comprehensive web application for managing apartment complexes with role-based access control, billing management, visitor tracking, and more.

## 🏗️ Tech Stack

**Frontend:**
- React 18 (JavaScript)
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling

**Backend:**
- Node.js with Express.js
- Prisma ORM with PostgreSQL
- JWT Authentication with Bcrypt
- CORS and Security middleware

## 👥 User Roles

- **OWNER** - Flat owners who can view bills and tenant details
- **TENANT** - Renters who can pay bills and manage visitors
- **SECRETARY** - Admin role for managing users, flats, and bills
- **STAFF** - Maintenance staff for handling issues
- **GUARD** - Security personnel for visitor management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/its-Pratik-15/apartment-management-system.git
   cd apartment-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   Application runs on http://localhost:3000

## 📊 Database Schema

The system uses PostgreSQL with Prisma ORM and includes:

- **Users** - Authentication and role management
- **Flats** - Property information and occupancy status
- **Leases** - Rental agreements between owners and tenants
- **Bills** - Automated billing with role-based assignment
- **Visitor Logs** - Entry/exit tracking with approvals
- **Notices** - Announcements with role-based visibility
- **Issues** - Maintenance request tracking

## 🔐 Default Login Credentials

After running the seed script:

- **Secretary**: secretary@apartment.com / password123
- **Owner**: owner1@apartment.com / password123
- **Tenant**: tenant1@apartment.com / password123
- **Staff**: staff@apartment.com / password123
- **Guard**: guard@apartment.com / password123

## 🏠 Key Features

### Flat & Occupancy Management
- Each flat has one owner
- Automatic occupancy status (OWNER_OCCUPIED/TENANT_OCCUPIED)
- Lease lifecycle management with auto-expiration

### Smart Billing System
- Automatic bill assignment based on occupancy:
  - Tenant-occupied: RENT/UTILITIES → Tenant, MAINTENANCE → Owner
  - Owner-occupied: All bills → Owner
- Bill status tracking (DUE/PAID/OVERDUE)
- Late fee calculation
- Payment history

### Visitor Management
- Guard creates visitor entries
- Resident approval workflow
- IN/OUT time tracking
- Complete audit trail

### Role-Based Dashboards
- **Owner**: Maintenance bills, tenant details, rent received
- **Tenant**: Bills, visitor approvals, issue reporting
- **Secretary**: User management, analytics, reporting
- **Guard**: Mobile-first interface with entry forms
- **Staff**: Issue management and resolution

## 📁 Project Structure

```
apartment-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, RBAC, validation
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration files
│   │   ├── prisma/          # Database schema and seed
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Helper functions
│   │   ├── context/         # React context
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pratik Kumar**
- GitHub: [@its-Pratik-15](https://github.com/its-Pratik-15)

---

Built with ❤️ for efficient apartment management