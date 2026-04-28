# 🚀 Productivity Tracker with Gamification

A full-stack MERN application that transforms routine tasks into fun, engaging challenges with gamification elements like XP, levels, streaks, badges, and a global leaderboard.

## 📋 Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based login/registration
- ✅ **Task Management** - Create, update, complete, and delete tasks
- ✅ **Real-time XP System** - Earn points based on task difficulty and priority
- ✅ **Level Progression** - Advance through levels as you earn XP
- ✅ **Streak Tracking** - Maintain daily streaks to stay motivated
- ✅ **Badge System** - Unlock achievements for milestones
- ✅ **Leaderboard** - Compete with other users globally
- ✅ **Analytics Dashboard** - Track productivity with charts and statistics
- ✅ **Category Organization** - Organize tasks (Work, Health, Learning, etc.)
- ✅ **Priority Levels** - High, Medium, Low priority with XP multipliers

### Gamification Features
- 🎮 **XP Calculation** - Intelligent XP system based on:
  - Task difficulty
  - Priority multiplier
  - Time efficiency bonus
- 📈 **Level System** - Progress through levels (starts at level 1)
- 🔥 **Streak System** - Track current and longest streaks
- 🎖️ **Badge Achievements** - Earn badges for:
  - First Step (1st task)
  - Task Master (10 tasks)
  - Week Warrior (7-day streak)
  - Streak Keeper (30-day streak)
  - XP Collector (1000 XP)
  - Century Club (100 tasks)
  - Level Up (Level 10)
- 🏆 **Global Leaderboard** - Rank by total XP

### Analytics
- 📊 **Weekly Activity Charts** - Line charts showing daily progress
- 📈 **Monthly Statistics** - Comprehensive monthly overview
- 🎯 **Productivity Score** - Calculated based on performance
- 📋 **Category Breakdown** - Pie charts showing task distribution
- ⏱️ **Time Tracking** - Average completion time and total time spent

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **CSS3** - Styling

## 📦 Project Structure

```
mern-todo-app/
├── server/
│   ├── models/
│   │   ├── User.js          # User schema with gamification fields
│   │   ├── Task.js          # Task schema
│   │   ├── Badge.js         # Badge schema
│   │   └── Analytics.js     # Analytics schema
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── tasks.js         # Task CRUD endpoints
│   │   ├── users.js         # User profile & leaderboard
│   │   └── analytics.js     # Analytics endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── utils/
│   │   └── gamification.js  # Gamification logic
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation component
│   │   │   └── ProtectedRoute.js    # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js       # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── Tasks.js             # Tasks management page
│   │   │   ├── Analytics.js         # Analytics page
│   │   │   └── Leaderboard.js       # Leaderboard page
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Tasks.css
│   │   │   ├── Analytics.css
│   │   │   ├── Leaderboard.css
│   │   │   └── Navbar.css
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd mern-todo-app
```

2. **Setup Backend**
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MongoDB URI
# JWT Secret
# Port (default: 5000)

# Start the server
npm start
# Or for development with nodemon
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client

# Install dependencies
npm install

# Start the React app
npm start
# App opens at http://localhost:3000
```

4. **From root directory (optional)**
```bash
# Install all dependencies
npm run install-all

# Run both server and client concurrently
npm run dev
```

## 📝 Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=optional_for_future_features
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/badges` - Get user badges
- `GET /api/users/gamification/stats` - Get gamification stats
- `GET /api/users/leaderboard` - Get top 10 users
- `GET /api/users/leaderboard/page` - Get paginated leaderboard

### Analytics
- `GET /api/analytics/weekly` - Get weekly activity
- `GET /api/analytics/monthly` - Get monthly stats
- `GET /api/analytics/categories` - Get category breakdown

## 📊 XP Calculation

```javascript
XP = baseXP × priorityMultiplier × timeBonus

Priority Multiplier:
- High: 1.5x
- Medium: 1.2x
- Low: 1.0x

Time Bonus:
- Completed before estimated time: +0.25x
```

## 🎮 Level System

```javascript
XP Required for Level N = 100 × N
Level 1: 0 - 99 XP
Level 2: 100 - 299 XP
Level 3: 300 - 599 XP
...
```

## 🎖️ Badges

| Badge | Requirement |
|-------|-------------|
| First Step | Complete 1 task |
| Task Master | Complete 10 tasks |
| Week Warrior | Achieve 7-day streak |
| Streak Keeper | Achieve 30-day streak |
| XP Collector | Earn 1000 XP |
| Century Club | Complete 100 tasks |
| Level Up | Reach level 10 |

## 📱 Pages

### Dashboard
- View gamification stats (XP, Level, Streaks, Tasks)
- Progress bar to next level
- Recent tasks overview
- Badge showcase

### Tasks
- Create tasks with categories and priorities
- Filter by status and category
- View XP rewards
- Mark tasks as complete
- Delete tasks

### Analytics
- Weekly activity line chart
- Monthly statistics
- Category breakdown pie chart
- Productivity score
- Category performance table

### Leaderboard
- Global ranking by XP
- User profiles with badges
- Pagination support
- Medal indicators for top 3

## 🎯 Development Tips

### Adding New Badges
Edit `server/utils/gamification.js` in the `checkAndAwardBadges` function:

```javascript
if (/* condition */) {
  badges.push({
    name: 'Badge Name',
    description: 'Badge description',
    earnedAt: new Date(),
    icon: '🎖️',
  });
}
```

### Customizing XP System
Modify `server/utils/gamification.js`:

```javascript
const calculateTaskXP = (task) => {
  let baseXP = task.baseXP || 10;
  let multiplier = 1.0;
  
  // Add your custom logic here
  
  return Math.round(baseXP * multiplier);
};
```

### Database Schema Changes
Edit models in `server/models/` and update routes accordingly.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (`mongod` command)
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### CORS Errors
- Verify `CORS_ORIGIN` matches frontend URL
- Check browser console for specific errors

### Token Expired
- Frontend automatically logs out on token expiry
- Users need to login again

## 📈 Future Enhancements

- [ ] OpenAI integration for personalized productivity tips
- [ ] Social features (friend requests, shared tasks)
- [ ] Mobile app (React Native)
- [ ] Notifications and reminders
- [ ] Task templates
- [ ] Export analytics to PDF
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Team/Organization support

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a full-stack MERN project example.

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Tracking! 🎯✨**
