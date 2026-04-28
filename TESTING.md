# Testing Guide - Productivity Tracker

## 🧪 Testing Strategy

This guide covers unit tests, integration tests, and manual testing for the MERN application.

---

## 📦 Setup Testing Framework

### Backend Tests

```bash
cd server
npm install --save-dev jest supertest
```

**Update package.json:**
```json
{
  "scripts": {
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"]
  }
}
```

---

## 🔧 Backend Unit Tests

Create `server/tests/auth.test.js`:

```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

// Mock database connection
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Authentication', () => {
  
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    
    test('Should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('testuser');
    });

    test('Should not register if email exists', async () => {
      await User.create({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'hashed_password'
      });

      const res = await request(app).post('/api/auth/register').send({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('User already exists');
    });

    test('Should not register if passwords do not match', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Passwords do not match');
    });

    test('Should not register if password is too short', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: '123',
        confirmPassword: '123'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123' // Will be hashed
      });
    });

    test('Should login with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    test('Should not login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });

    test('Should not login with non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });
});
```

Create `server/tests/tasks.test.js`:

```javascript
const request = require('supertest');
const Task = require('../models/Task');
const User = require('../models/User');

describe('Tasks', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Create test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id;
    
    // Generate token
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
  });

  beforeEach(async () => {
    await Task.deleteMany({ userId });
  });

  describe('POST /api/tasks', () => {
    
    test('Should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          category: 'personal',
          priority: 'high',
          baseXP: 50
        });

      expect(res.status).toBe(201);
      expect(res.body.task.title).toBe('Test Task');
      expect(res.body.task.userId.toString()).toBe(userId.toString());
    });

    test('Should not create task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'personal'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('required');
    });

    test('Should not create task without auth token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    
    test('Should get all user tasks', async () => {
      await Task.create([
        { userId, title: 'Task 1', completed: false },
        { userId, title: 'Task 2', completed: true }
      ]);

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    test('Should filter by completion status', async () => {
      await Task.create([
        { userId, title: 'Task 1', completed: false },
        { userId, title: 'Task 2', completed: true }
      ]);

      const res = await request(app)
        .get('/api/tasks?completed=true')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].completed).toBe(true);
    });

    test('Should filter by category', async () => {
      await Task.create([
        { userId, title: 'Work Task', category: 'work' },
        { userId, title: 'Personal Task', category: 'personal' }
      ]);

      const res = await request(app)
        .get('/api/tasks?category=work')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe('work');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    
    test('Should update task', async () => {
      const task = await Task.create({
        userId,
        title: 'Original Title',
        completed: false
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title'
        });

      expect(res.status).toBe(200);
      expect(res.body.task.title).toBe('Updated Title');
    });

    test('Should award XP when completing task', async () => {
      const task = await Task.create({
        userId,
        title: 'Test Task',
        completed: false,
        baseXP: 50
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          completed: true
        });

      expect(res.status).toBe(200);
      expect(res.body.task.completed).toBe(true);
      expect(res.body.task.actualXPEarned).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    
    test('Should delete task', async () => {
      const task = await Task.create({
        userId,
        title: 'Task to Delete'
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    test('Should not delete other users task', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password123'
      });

      const task = await Task.create({
        userId: otherUser._id,
        title: 'Other Users Task'
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
```

---

## 🎨 Frontend Testing

```bash
cd client
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Create `client/src/components/Navbar.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';

const MockedNavbar = ({ user }) => (
  <AuthContext.Provider value={{ user, logout: jest.fn() }}>
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  </AuthContext.Provider>
);

describe('Navbar', () => {
  test('Should render navigation links when user is logged in', () => {
    const user = { username: 'testuser', id: '123' };
    render(<MockedNavbar user={user} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  test('Should display username when logged in', () => {
    const user = { username: 'testuser', id: '123' };
    render(<MockedNavbar user={user} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('Should not render when user is not logged in', () => {
    render(
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
```

---

## 🧑‍💻 Manual Testing Checklist

### Authentication
- [ ] Register with valid data
- [ ] Register with invalid email
- [ ] Register with mismatched passwords
- [ ] Register with existing email
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Login with non-existent email
- [ ] Logout clears token
- [ ] Protected routes redirect to login

### Task Management
- [ ] Create task with all fields
- [ ] Create task with minimal fields
- [ ] Create task without title (should fail)
- [ ] View all tasks
- [ ] Filter tasks by category
- [ ] Filter tasks by priority
- [ ] Filter tasks by status (completed/pending)
- [ ] Update task title
- [ ] Update task priority
- [ ] Mark task as complete
- [ ] Unmark completed task
- [ ] Delete task
- [ ] Cannot delete other user's task

### Gamification
- [ ] XP awarded when task completed
- [ ] XP amount based on priority
- [ ] XP amount based on time efficiency
- [ ] Level increases with XP
- [ ] Progress bar shows correct XP
- [ ] Streak increments on daily completion
- [ ] Streak resets on missed day
- [ ] Badges awarded at milestones
- [ ] Badges display correctly

### Analytics
- [ ] Weekly chart shows activity
- [ ] Monthly stats calculated correctly
- [ ] Productivity score accurate
- [ ] Category breakdown correct
- [ ] Time tracking accurate

### Leaderboard
- [ ] Users ranked by XP
- [ ] Current user visible on leaderboard
- [ ] Pagination works
- [ ] Top 3 show medals
- [ ] User stats display correctly

---

## 🔄 Continuous Integration

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:latest
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install Backend Dependencies
        run: cd server && npm install

      - name: Run Backend Tests
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          JWT_SECRET: test_secret
        run: cd server && npm test

      - name: Install Frontend Dependencies
        run: cd client && npm install

      - name: Run Frontend Tests
        run: cd client && npm test -- --coverage --watchAll=false

      - name: Upload Coverage
        uses: codecov/codecov-action@v2
```

---

## 📊 Test Coverage Goals

| Component | Goal |
|-----------|------|
| Authentication | 90%+ |
| Tasks CRUD | 85%+ |
| Gamification | 80%+ |
| Analytics | 75%+ |
| UI Components | 70%+ |

---

## ✅ Test Commands

```bash
# Backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Frontend
npm test                 # Run tests
npm test -- --coverage  # Coverage report
```

---

**Happy Testing! 🧪**
