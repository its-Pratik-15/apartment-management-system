# Deployment Guide

This guide covers deploying the Apartment Management System to production environments.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended for Backend)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Option 2: Vercel (Recommended for Frontend)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Option 3: Render (Full-Stack)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database provider switched to PostgreSQL
- [ ] Console.log statements removed/conditional
- [ ] Build process tested locally
- [ ] Security headers configured
- [ ] CORS origins updated for production

## 🗄️ Database Migration (MySQL → PostgreSQL)

### 1. Update Prisma Schema
```bash
# In backend/prisma/schema.prisma
datasource db {
  provider = "postgresql"  # Changed from "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Install PostgreSQL Dependencies
```bash
cd backend
npm install pg @types/pg
npm uninstall mysql2  # Remove MySQL driver
```

### 3. Update Environment Variables
```env
# Production PostgreSQL URL
DATABASE_URL="postgresql://username:password@host:5432/apartment_management"
DIRECT_URL="postgresql://username:password@host:5432/apartment_management"
```

## 🌐 Backend Deployment

### Railway Deployment

1. **Create Railway Project**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Add PostgreSQL Database**
   ```bash
   railway add postgresql
   ```

3. **Configure Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-super-secret-jwt-key
   railway variables set JWT_EXPIRES_IN=7d
   railway variables set FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy**
   ```bash
   cd backend
   railway up
   ```

5. **Run Migrations**
   ```bash
   railway run npm run db:migrate
   railway run npm run db:seed
   ```

### Render Deployment

1. **Create Web Service**
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install && npm run db:generate`
   - Start Command: `npm start`

2. **Add PostgreSQL Database**
   - Create PostgreSQL service in Render
   - Copy connection string

3. **Environment Variables**
   ```env
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

## 🎨 Frontend Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

### Netlify Deployment

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: `frontend`

2. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

3. **Redirects Configuration**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

## 🔧 Production Configuration

### Backend Production Settings

**package.json scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "npm run db:generate",
    "db:deploy": "prisma migrate deploy && prisma db seed"
  }
}
```

**Environment Variables:**
```env
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Production Settings

**Environment Variables:**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
GENERATE_SOURCEMAP=false
```

## 🔒 Security Configuration

### Backend Security Headers
```javascript
// In app.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### CORS Configuration
```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```javascript
// Already implemented in app.js
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Apartment Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
```

### Monitoring Setup
1. **Uptime Monitoring**: Use UptimeRobot or similar
2. **Error Tracking**: Implement Sentry or LogRocket
3. **Performance**: Use New Relic or DataDog
4. **Database**: Monitor connection pool and query performance

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check connection string format
   # Ensure database exists
   # Verify network access
   ```

2. **CORS Errors**
   ```javascript
   // Update CORS origins in production
   origin: ['https://your-actual-domain.com']
   ```

3. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Migration Issues**
   ```bash
   # Reset database (CAUTION: Data loss)
   npx prisma migrate reset
   npx prisma db push
   ```

## 📈 Performance Optimization

### Backend Optimizations
- Enable gzip compression
- Implement Redis caching
- Database connection pooling
- API response caching

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization
- Bundle analysis
- Service worker for caching

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflow for:
- Automated testing
- Security scanning
- Build verification
- Deployment automation

See `.github/workflows/ci.yml` for configuration.

## 📞 Support

For deployment issues:
1. Check the logs in your hosting platform
2. Verify environment variables
3. Test database connectivity
4. Review CORS configuration
5. Check the GitHub Issues for similar problems

## 🎯 Post-Deployment Steps

1. **Test all user roles** with demo credentials
2. **Verify API endpoints** are accessible
3. **Check database** migrations completed
4. **Test file uploads** if implemented
5. **Monitor performance** and error rates
6. **Set up backups** for database
7. **Configure SSL** certificates
8. **Update DNS** records if needed

---

🚀 **Your Apartment Management System is now live!**