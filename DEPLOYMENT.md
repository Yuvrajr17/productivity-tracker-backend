# Deployment Guide - Productivity Tracker

## 🚀 Deployment Overview

This guide covers deploying your MERN app to production using popular platforms.

---

## 📦 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrated to MongoDB Atlas
- [ ] Security measures implemented (HTTPS, rate limiting)
- [ ] Error logging setup
- [ ] Frontend build optimized
- [ ] Backend tests passing
- [ ] CORS properly configured
- [ ] JWT secret changed to strong key

---

## 🔐 Security Setup

### 1. Generate Strong JWT Secret
```bash
# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Environment Variables for Production

**Backend .env:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/productivity-tracker?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_here
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### 3. Security Best Practices

```javascript
// Add to server.js for production
const helmet = require('helmet');
const mongoSanitize = require('mongo-sanitize');
const rateLimit = require('express-rate-limit');

app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Prevent MongoDB injection
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

---

## 🌐 Backend Deployment

### Option 1: Heroku (Easiest)

#### Prerequisites
- Heroku account (https://www.heroku.com)
- Heroku CLI installed

#### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
cd server
heroku create your-app-name
```

3. **Add MongoDB Atlas**
```bash
# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **View Logs**
```bash
heroku logs --tail
```

**Backend URL:** `https://your-app-name.herokuapp.com`

---

### Option 2: AWS EC2

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu)
- Node.js installed

#### Steps

1. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

2. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm git
```

3. **Clone Repository**
```bash
git clone https://github.com/yourusername/mern-todo-app.git
cd mern-todo-app/server
npm install
```

4. **Setup PM2 (Process Manager)**
```bash
sudo npm install -g pm2
pm2 start server.js --name "productivity-tracker"
pm2 startup
pm2 save
```

5. **Setup Nginx (Reverse Proxy)**
```bash
sudo apt install nginx

# Create config file
sudo nano /etc/nginx/sites-available/default
```

**Nginx Config:**
```nginx
upstream nodejs {
  server localhost:5000;
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://nodejs;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

6. **Enable SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: DigitalOcean App Platform

#### Steps

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Connect DigitalOcean**
   - Go to https://cloud.digitalocean.com/apps
   - Click "Create App"
   - Select GitHub repo
   - Configure build settings
   - Add environment variables
   - Deploy

---

## 💻 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account (https://vercel.com)
- GitHub connected

#### Steps

1. **Push to GitHub**
```bash
cd client
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **Import on Vercel**
   - Go to https://vercel.com/new
   - Import from GitHub
   - Select repository
   - Configure build settings:
     - Framework: Create React App
     - Build Command: `npm run build`
     - Start Command: `npm start`

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `REACT_APP_API_URL=https://your-backend-url.com`

4. **Deploy**
   - Vercel automatically deploys on push

**Frontend URL:** `https://your-app.vercel.app`

---

### Option 2: Netlify

#### Steps

1. **Build React App**
```bash
cd client
npm run build
```

2. **Deploy on Netlify**
   - Drag `build/` folder to netlify.com
   - OR connect GitHub for auto-deploy

3. **Configure Redirects**
   - Create `public/_redirects` file:
```
/*  /index.html   200
```

---

### Option 3: GitHub Pages

```bash
cd client

# Add to package.json
"homepage": "https://yourusername.github.io/mern-todo-app"

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## 🗄️ Database Setup - MongoDB Atlas

### Steps

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up/login

2. **Create Cluster**
   - Click "Create a New Cluster"
   - Select free tier
   - Choose region (closest to users)
   - Click "Create Cluster"

3. **Setup Security**
   - Go to "Database Access"
   - Create database user
   - Generate password

4. **Allow IP Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" or add specific IPs
   - For production, use specific IP

5. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace username and password

6. **Update .env**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/productivity-tracker?retryWrites=true&w=majority
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install Backend Dependencies
        run: |
          cd server
          npm install

      - name: Run Backend Tests
        run: |
          cd server
          npm test

      - name: Install Frontend Dependencies
        run: |
          cd client
          npm install

      - name: Build Frontend
        run: |
          cd client
          npm run build

      - name: Deploy to Production
        run: |
          # Your deployment script here
          echo "Deploying to production..."
```

---

## 📊 Monitoring & Logging

### 1. Error Tracking - Sentry

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({ 
  dsn: "your-sentry-dsn",
  environment: "production"
});

app.use(Sentry.Handlers.errorHandler());
```

### 2. Logging - Winston

```bash
npm install winston
```

```javascript
const logger = require('winston');

logger.info('Application started');
logger.error('Database connection failed');
```

### 3. Performance Monitoring

```bash
npm install newrelic
```

---

## 🔍 Testing Deployment

### 1. Test Backend API
```bash
curl https://your-backend-url.com/api/health
# Should return: {"message": "Server is running"}
```

### 2. Test Authentication
```bash
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Frontend
- Open https://your-frontend-url.com
- Try login/register
- Create a task
- Check if XP is awarded

---

## 🚨 Troubleshooting

### CORS Errors
```javascript
// Update backend .env
CORS_ORIGIN=https://your-frontend-url.com
```

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check username/password

### Deployment Fails
- Check logs: `heroku logs --tail`
- Verify environment variables
- Check Node version compatibility

### Frontend not loading API
- Check REACT_APP_API_URL in .env
- Verify backend URL is correct
- Check CORS configuration

---

## 📈 Performance Optimization

### Backend
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
```

### Frontend
```javascript
// Code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tasks = React.lazy(() => import('./pages/Tasks'));

// Use Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

---

## 💰 Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Heroku | None | $7+/month |
| Vercel | Yes | Pay-as-you-go |
| Netlify | Yes | Pay-as-you-go |
| MongoDB Atlas | 512MB | $57+/month |
| AWS EC2 | 12 months | $5-20/month |
| DigitalOcean | None | $5+/month |

**Budget Option:** Vercel (Free) + Netlify (Free) + MongoDB Atlas Free Tier = **$0/month** (with limitations)

---

## ✅ Post-Deployment

1. Setup monitoring and logging
2. Configure backups
3. Setup domain and SSL
4. Test all features
5. Monitor performance
6. Setup alerts for errors
7. Regular security updates

---

**Your app is now production-ready! 🎉**
