# Troubleshooting & FAQ - Productivity Tracker

## ❓ Frequently Asked Questions

### Installation & Setup

**Q: I get "MongoDB connection failed" error**

A: 
1. Make sure MongoDB is running:
```bash
# Windows
mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

2. Check your MongoDB URI in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
```

3. If using MongoDB Atlas:
   - Verify username and password are correct
   - Check IP whitelist allows your IP
   - Ensure cluster is created and available

---

**Q: "Port 5000 is already in use"**

A:
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm start
```

---

**Q: "npm install fails with permission error"**

A:
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then try install again
npm install
```

---

**Q: Frontend shows blank page**

A:
1. Check browser console (F12) for errors
2. Verify API URL in frontend (should be http://localhost:5000)
3. Clear browser cache: Ctrl+Shift+Del
4. Check if server is running
5. Try different port: `PORT=3001 npm start`

---

### Authentication Issues

**Q: "Token is not valid" error after login**

A:
1. Check JWT_SECRET in `.env` is set correctly
2. Ensure token is being sent in headers:
```javascript
headers: { Authorization: `Bearer ${token}` }
```

3. Check if token has expired (default: 30 days)
4. Try logging out and logging back in

---

**Q: Cannot login with correct credentials**

A:
1. Make sure password was hashed correctly
2. Check database has user record:
```javascript
// Run in mongosh
db.users.findOne({ email: "your@email.com" })
```

3. Try resetting password (if feature exists)
4. Check email is exactly as registered

---

**Q: "Protected route redirects to login"**

A:
1. Verify token is stored in localStorage
2. Check if AuthContext provider wraps app:
```javascript
<AuthProvider>
  <App />
</AuthProvider>
```

3. Ensure ProtectedRoute component is used correctly
4. Check browser's Application tab → Storage → localStorage

---

### Data & Database Issues

**Q: Data not persisting after refresh**

A:
1. Check MongoDB connection is active
2. Verify data is actually in database:
```javascript
// In mongosh
use productivity-tracker
db.tasks.find()
```

3. Check if API is actually writing to DB
4. Look for errors in server console

---

**Q: XP not being awarded when completing task**

A:
1. Check task completion request is being sent:
```javascript
// In browser DevTools → Network tab
// Look for PUT request to /api/tasks/:id
```

2. Verify response shows `actualXPEarned`
3. Check gamification logic in `server/utils/gamification.js`
4. Ensure user document updated:
```javascript
db.users.findOne({ _id: userId })
// Should show increased totalXP
```

---

**Q: Badges not being awarded**

A:
1. Check `checkAndAwardBadges` function runs
2. Add console.logs to debug:
```javascript
console.log('Checking badges for user:', userId);
console.log('Current badges:', user.badges);
```

3. Verify badge criteria met (e.g., 10 tasks for Task Master)
4. Check user model has badges array

---

### Performance Issues

**Q: App loads slowly**

A:
1. **Frontend:**
   - Check network tab for slow API calls
   - Enable compression in server:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Backend:**
   - Add database indexes:
   ```javascript
   // In User.js
   userSchema.index({ totalXP: -1 }); // For leaderboard
   ```

   - Use pagination for large datasets
   - Add caching (Redis)

3. **Database:**
   - Check query performance
   - Ensure indexes exist
   - Monitor connection pool

---

**Q: Dashboard takes long to load**

A:
1. Move heavy computations to backend
2. Cache leaderboard data
3. Use React.lazy for code splitting:
```javascript
const Dashboard = React.lazy(() => import('./Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

### API Issues

**Q: "CORS error" in browser console**

A:
1. Check CORS_ORIGIN in server `.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

2. Verify it matches your frontend URL
3. For production, update to your domain:
```env
CORS_ORIGIN=https://yourdomain.com
```

4. Ensure CORS middleware is enabled:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

---

**Q: API returns 404 for valid endpoint**

A:
1. Check endpoint path is spelled correctly
2. Verify router is mounted:
```javascript
// In server.js
app.use('/api/tasks', require('./routes/tasks'));
```

3. Check HTTP method (GET, POST, PUT, DELETE)
4. Use Postman to test API directly

---

**Q: API returns 500 error**

A:
1. Check server console for error message
2. Add error logging:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});
```

3. Check database connection
4. Verify request data is valid

---

### UI/UX Issues

**Q: Styles not applying**

A:
1. Check CSS file is imported:
```javascript
import '../styles/Dashboard.css';
```

2. Verify file path is correct
3. Check for CSS conflicts
4. Hard refresh browser (Ctrl+Shift+R)
5. Clear browser cache

---

**Q: Button/Form not responding**

A:
1. Check if onClick handler is attached
2. Verify no JavaScript errors in console
3. Check if button is disabled:
```javascript
<button disabled={loading}>Submit</button>
```

4. Ensure form has onSubmit handler
5. Check input fields have onChange handlers

---

**Q: Mobile responsive not working**

A:
1. Add viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

2. Check media queries are correct:
```css
@media (max-width: 768px) {
  /* mobile styles */
}
```

3. Use Chrome DevTools to test responsive
4. Check grid/flex layouts

---

### Development Issues

**Q: nodemon not auto-restarting server**

A:
1. Install nodemon:
```bash
npm install --save-dev nodemon
```

2. Update package.json scripts:
```json
"dev": "nodemon server.js"
```

3. Check file is actually being saved
4. Try restarting nodemon

---

**Q: React Hot Reload not working**

A:
1. Make sure running `npm start` from client folder
2. Check file is saved (look for indicator in editor)
3. React files must be in `src/` folder
4. Restart dev server

---

**Q: Environment variables not loading**

A:
1. Create `.env` file in correct folder:
   - Backend: `server/.env`
   - Frontend: `client/.env` (with REACT_APP_ prefix)

2. Restart server after changing .env
3. For frontend, restart: `npm start`
4. Check syntax - no spaces around `=`

```env
# Correct
MONGODB_URI=mongodb://localhost:27017/db

# Wrong - has spaces
MONGODB_URI = mongodb://localhost:27017/db
```

---

### Testing Issues

**Q: Tests not running**

A:
```bash
# Install Jest
npm install --save-dev jest supertest

# Run tests
npm test

# Watch mode
npm test -- --watch
```

---

**Q: Test database not found**

A:
```javascript
// Create separate test database
const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test';
```

---

## 🔧 Debugging Tips

### 1. Browser DevTools
```
F12 → Console tab
- Look for JavaScript errors
- Check API responses in Network tab
- Inspect element styles in Elements tab
```

### 2. Server Console
```
Look for error messages when requests come in
Add console.log() statements to debug
```

### 3. Postman
Test API endpoints without frontend:
```
1. Create request
2. Set method (GET, POST, etc.)
3. Add headers: Authorization: Bearer <token>
4. Send request
5. Check response
```

### 4. MongoDB Compass
Visualize database:
```
1. Connect to MongoDB
2. Browse collections
3. Check documents
4. Run queries
```

### 5. VS Code Extensions
- REST Client - Test APIs in editor
- MongoDB for VS Code - Query database
- Thunder Client - API testing
- ESLint - Code quality

---

## 🆘 Still Having Issues?

### Steps to Provide Good Bug Report

1. **Describe the issue**
   - What were you trying to do?
   - What happened instead?
   - What should have happened?

2. **Provide details**
   - Operating system
   - Node version: `node --version`
   - npm version: `npm --version`
   - Browser (if frontend issue)

3. **Share error message**
   - Full error from console
   - Stack trace
   - Network tab info

4. **Minimal reproduction**
   - Steps to reproduce
   - Code snippet (if applicable)

### Get Help

1. Check this troubleshooting guide first
2. Search closed GitHub issues
3. Check server/client console logs
4. Ask in community forums
5. Create GitHub issue with details

---

## ✅ Health Check Commands

Run these to verify everything is working:

```bash
# Backend health check
curl http://localhost:5000/api/health

# Frontend health check (should load without errors)
curl http://localhost:3000

# Database connection
mongosh
> use productivity-tracker
> db.users.count()

# Check running ports
lsof -i :5000
lsof -i :3000

# Check Node version
node --version

# Check npm version
npm --version
```

---

## 📚 Resources

- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [JWT Explanation](https://jwt.io)
- [MERN Tutorial](https://mern.io)

---

**Can't find your issue? Create a GitHub issue or ask in discussions! 💬**
