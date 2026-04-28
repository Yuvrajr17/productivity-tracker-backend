# Quick Start Guide - Productivity Tracker with Gamification

## 🚀 5-Minute Setup

### Step 1: Prerequisites
Make sure you have installed:
- Node.js (https://nodejs.org/) - v14 or higher
- MongoDB (https://www.mongodb.com/) - local or use MongoDB Atlas (cloud)
- npm (comes with Node.js)

### Step 2: Start MongoDB
**Option A: Local MongoDB**
```bash
# On Windows, Linux, or macOS
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string (replace in .env)

### Step 3: Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create and edit .env file with your values:
# MONGODB_URI=mongodb://localhost:27017/productivity-tracker
# JWT_SECRET=your_secret_key_here_change_in_production
# PORT=5000

# Start server
npm start
# Server running on http://localhost:5000
```

### Step 4: Frontend Setup (New Terminal)
```bash
cd client

# Install dependencies
npm install

# Start React app
npm start
# App opens at http://localhost:3000
```

### Step 5: Use the App
1. Open http://localhost:3000
2. Click "Register" to create account
3. Start creating tasks!
4. Complete tasks to earn XP and level up

## 📋 Initial Setup Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running
- [ ] Server dependencies installed (`npm install` in server folder)
- [ ] Client dependencies installed (`npm install` in client folder)
- [ ] .env file created in server folder
- [ ] MongoDB connection working (check server console)
- [ ] Server running on port 5000
- [ ] Client running on port 3000

## 🎯 First Task to Try

1. Login/Register on http://localhost:3000
2. Go to "Tasks" tab
3. Click "+ Create Task"
4. Fill in:
   - Title: "Complete First Task"
   - Priority: "High"
   - Category: "Personal"
   - Estimated Time: 5 minutes
5. Click "Create Task"
6. Mark it as complete ✓
7. Go to Dashboard to see XP earned! 🎉

## 🔧 Common Issues & Solutions

### "Cannot connect to MongoDB"
```bash
# Windows - Start MongoDB
mongod

# macOS - Using Homebrew
brew services start mongodb-community

# Or use MongoDB Atlas (cloud version)
```

### "Port 5000 already in use"
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### "Port 3000 already in use"
```bash
# Specify different port
PORT=3001 npm start
```

### Blank page on http://localhost:3000
1. Check browser console (F12) for errors
2. Ensure server is running
3. Clear browser cache (Ctrl+Shift+Del)

## 📚 File Structure Explanation

```
mern-todo-app/
├── server/              # Backend (Express + MongoDB)
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── utils/          # Helper functions (gamification logic)
│   └── server.js       # Main server file
│
└── client/              # Frontend (React)
    ├── src/
    │   ├── pages/      # Page components
    │   ├── context/    # State management
    │   └── styles/     # CSS files
    └── public/         # Static files
```

## 🌟 Key Features to Explore

1. **Dashboard** - View your stats, levels, and badges
2. **Tasks** - Create and manage tasks with categories
3. **Analytics** - See charts and productivity metrics
4. **Leaderboard** - Compete with other users

## 🎮 Understanding Gamification

- **XP (Experience Points)** - Earn by completing tasks
- **Levels** - Progress through levels as you earn XP
- **Streaks** - Complete a task daily to build streaks
- **Badges** - Unlock achievements
- **Leaderboard** - Compete globally

## 📖 API Quick Reference

All API calls need `Authorization: Bearer YOUR_TOKEN` header

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","category":"work","priority":"high"}'
```

## 🚀 Deployment

For production deployment, see:
- Backend: Deploy to Heroku, AWS, or DigitalOcean
- Frontend: Deploy to Vercel, Netlify, or Firebase
- Database: Use MongoDB Atlas (cloud)

## 💡 Next Steps

1. Explore all features in the app
2. Read the full README.md for detailed documentation
3. Customize the XP system in `server/utils/gamification.js`
4. Add new badges and features
5. Deploy to production when ready

## 📞 Need Help?

- Check the main README.md for detailed docs
- Look at console errors (Ctrl+Shift+I)
- Check server logs in terminal
- Review API routes in `server/routes/`

---

**Ready to boost your productivity? Let's go! 🎯**
