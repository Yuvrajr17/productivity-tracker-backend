# Productivity Tracker API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Headers:
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "123abc",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Status:** 201 Created

---

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "123abc",
    "username": "johndoe",
    "email": "john@example.com",
    "totalXP": 250,
    "level": 2,
    "currentStreak": 5
  }
}
```

**Status:** 200 OK

---

### Get Current User
**GET** `/auth/me`

**Headers:** Requires authentication

**Response:**
```json
{
  "_id": "123abc",
  "username": "johndoe",
  "email": "john@example.com",
  "totalXP": 250,
  "level": 2,
  "currentStreak": 5,
  "longestStreak": 10,
  "totalTasksCompleted": 25,
  "badges": [
    {
      "name": "First Step",
      "description": "Complete your first task",
      "earnedAt": "2024-01-15T10:00:00Z",
      "icon": "👣"
    }
  ]
}
```

**Status:** 200 OK

---

## 📋 Task Endpoints

### Create Task
**POST** `/tasks`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write API documentation for all endpoints",
  "category": "work",
  "priority": "high",
  "baseXP": 50,
  "estimatedTime": 120,
  "tags": ["documentation", "work"],
  "dueDate": "2024-02-01"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "task123",
    "userId": "123abc",
    "title": "Complete project documentation",
    "description": "Write API documentation for all endpoints",
    "category": "work",
    "priority": "high",
    "baseXP": 50,
    "estimatedTime": 120,
    "completed": false,
    "createdAt": "2024-01-20T10:00:00Z"
  }
}
```

**Status:** 201 Created

---

### Get All Tasks
**GET** `/tasks`

**Headers:** Requires authentication

**Query Parameters:**
- `completed` (boolean, optional) - Filter by completion status
- `category` (string, optional) - Filter by category
- `priority` (string, optional) - Filter by priority

**Example:**
```
GET /tasks?completed=false&category=work&priority=high
```

**Response:**
```json
[
  {
    "_id": "task123",
    "title": "Complete project documentation",
    "category": "work",
    "priority": "high",
    "completed": false,
    "baseXP": 50,
    "createdAt": "2024-01-20T10:00:00Z"
  },
  {
    "_id": "task124",
    "title": "Review code",
    "category": "work",
    "priority": "medium",
    "completed": true,
    "baseXP": 30,
    "actualXPEarned": 36,
    "completedAt": "2024-01-21T10:00:00Z"
  }
]
```

**Status:** 200 OK

---

### Get Single Task
**GET** `/tasks/:id`

**Headers:** Requires authentication

**Response:**
```json
{
  "_id": "task123",
  "userId": "123abc",
  "title": "Complete project documentation",
  "description": "Write API documentation for all endpoints",
  "category": "work",
  "priority": "high",
  "baseXP": 50,
  "estimatedTime": 120,
  "completed": false,
  "createdAt": "2024-01-20T10:00:00Z"
}
```

**Status:** 200 OK

---

### Update Task
**PUT** `/tasks/:id`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "category": "learning",
  "priority": "medium",
  "completed": true,
  "actualTime": 100,
  "tags": ["updated"]
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "task123",
    "title": "Updated task title",
    "completed": true,
    "actualXPEarned": 60,
    "completedAt": "2024-01-21T14:00:00Z"
  }
}
```

**Status:** 200 OK

**Note:** When setting `completed: true`, XP is automatically calculated and awarded.

---

### Delete Task
**DELETE** `/tasks/:id`

**Headers:** Requires authentication

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Status:** 200 OK

---

### Get Task Statistics
**GET** `/tasks/stats/summary`

**Headers:** Requires authentication

**Response:**
```json
{
  "total": 25,
  "completed": 20,
  "pending": 5,
  "byCategory": {
    "work": 10,
    "personal": 8,
    "learning": 5,
    "health": 2
  },
  "byPriority": {
    "high": 8,
    "medium": 12,
    "low": 5
  },
  "totalXPEarned": 850
}
```

**Status:** 200 OK

---

## 👤 User Endpoints

### Get User Profile
**GET** `/users/profile`

**Headers:** Requires authentication

**Response:**
```json
{
  "_id": "123abc",
  "username": "johndoe",
  "email": "john@example.com",
  "profilePicture": "https://...",
  "totalXP": 1250,
  "level": 5,
  "currentStreak": 12,
  "longestStreak": 45,
  "totalTasksCompleted": 85,
  "badges": [...]
}
```

**Status:** 200 OK

---

### Update User Profile
**PUT** `/users/profile`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "username": "johndoe_new",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "username": "johndoe_new",
    "profilePicture": "https://example.com/avatar.jpg"
  }
}
```

**Status:** 200 OK

---

### Get User Badges
**GET** `/users/badges`

**Headers:** Requires authentication

**Response:**
```json
[
  {
    "_id": "badge1",
    "badgeName": "First Step",
    "description": "Complete your first task",
    "earnedAt": "2024-01-15T10:00:00Z",
    "icon": "👣"
  },
  {
    "_id": "badge2",
    "badgeName": "Task Master",
    "description": "Complete 10 tasks",
    "earnedAt": "2024-01-20T10:00:00Z",
    "icon": "🎯"
  }
]
```

**Status:** 200 OK

---

### Get Gamification Stats
**GET** `/users/gamification/stats`

**Headers:** Requires authentication

**Response:**
```json
{
  "username": "johndoe",
  "totalXP": 1250,
  "level": 5,
  "currentStreak": 12,
  "longestStreak": 45,
  "totalTasksCompleted": 85,
  "badgesCount": 6,
  "badges": [...],
  "xpToNextLevel": {
    "currentLevel": 5,
    "xpToNextLevel": 350,
    "xpEarnedInCurrentLevel": 150,
    "xpNeededForCurrentLevel": 500
  },
  "leaderboardPosition": 42
}
```

**Status:** 200 OK

---

### Get Global Leaderboard
**GET** `/users/leaderboard`

**Query Parameters:**
- `limit` (number, optional, default: 10) - Number of users to return

**Response:**
```json
[
  {
    "rank": 1,
    "_id": "user1",
    "username": "topplayer",
    "totalXP": 5000,
    "level": 15,
    "currentStreak": 50,
    "totalTasksCompleted": 200,
    "badges": [...]
  },
  {
    "rank": 2,
    "_id": "user2",
    "username": "secondplace",
    "totalXP": 4800,
    "level": 14,
    "currentStreak": 35,
    "totalTasksCompleted": 180,
    "badges": [...]
  }
]
```

**Status:** 200 OK

---

### Get Paginated Leaderboard
**GET** `/users/leaderboard/page`

**Query Parameters:**
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 20) - Results per page

**Response:**
```json
{
  "leaderboard": [...],
  "totalPages": 50,
  "currentPage": 1,
  "totalUsers": 1000
}
```

**Status:** 200 OK

---

## 📊 Analytics Endpoints

### Get Weekly Analytics
**GET** `/analytics/weekly`

**Headers:** Requires authentication

**Response:**
```json
[
  {
    "date": "2024-01-15",
    "tasksCompleted": 3,
    "xpEarned": 120
  },
  {
    "date": "2024-01-16",
    "tasksCompleted": 2,
    "xpEarned": 85
  },
  {
    "date": "2024-01-17",
    "tasksCompleted": 4,
    "xpEarned": 150
  }
]
```

**Status:** 200 OK

---

### Get Monthly Analytics
**GET** `/analytics/monthly`

**Headers:** Requires authentication

**Response:**
```json
{
  "totalTasksCompleted": 65,
  "totalXPEarned": 2400,
  "totalTimeSpent": 3600,
  "avgCompletionTime": 55,
  "categoryBreakdown": {
    "work": 25,
    "health": 15,
    "learning": 20,
    "personal": 5,
    "fitness": 0,
    "other": 0
  },
  "productivityScore": 85,
  "streakInfo": {
    "current": 12,
    "longest": 45
  },
  "level": 5
}
```

**Status:** 200 OK

---

### Get Category Breakdown
**GET** `/analytics/categories`

**Headers:** Requires authentication

**Response:**
```json
{
  "work": {
    "completed": 35,
    "xp": 1050
  },
  "health": {
    "completed": 15,
    "xp": 450
  },
  "learning": {
    "completed": 20,
    "xp": 600
  },
  "personal": {
    "completed": 10,
    "xp": 300
  },
  "fitness": {
    "completed": 5,
    "xp": 150
  },
  "other": {
    "completed": 0,
    "xp": 0
  }
}
```

**Status:** 200 OK

---

## 📝 Category Options

- `work` - Work-related tasks
- `health` - Health and wellness tasks
- `learning` - Learning and education tasks
- `personal` - Personal development tasks
- `fitness` - Fitness and exercise tasks
- `other` - Miscellaneous tasks

## ⭐ Priority Options

- `low` - Low priority (1.0x XP multiplier)
- `medium` - Medium priority (1.2x XP multiplier)
- `high` - High priority (1.5x XP multiplier)

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting
Currently no rate limiting. Consider implementing in production.

## CORS
Allow requests from: `http://localhost:3000` (configurable in .env)

## Authentication Token Expiry
Default: 30 days

---

**Last Updated:** January 2024
