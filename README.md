# TaskFlow

A full-stack task management app with a Node.js/Express REST API and a React Native (Expo) mobile client.

---

## Project Structure

```
taskflow/
├── backend/          # Express API + MongoDB
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose schemas (User, Task)
│   ├── routes/       # auth.js, tasks.js
│   ├── .env          # Environment variables (not committed)
│   └── server.js     # Entry point
└── mobile/           # Expo React Native app
    ├── app/          # Expo Router screens
    ├── components/   # Shared UI components (FormField)
    ├── constants/    # Design tokens (theme.ts)
    ├── context/      # AuthContext (login/logout/session)
    ├── services/     # Axios API client
    └── styles/       # Shared StyleSheet (shared.ts)
```

---

## Features

**Authentication**
- JWT-based login with token stored in AsyncStorage
- Role-based access: `Admin` and `User`
- Auto-redirect on session restore

**Task Management**
- Admins can create, edit, delete, and reassign tasks
- Users can view their assigned tasks and update status
- Status options: `Not Started`, `In Progress`, `Done`
- Inline status picker on each task card

**Dashboard**
- Stats bar showing total / in-progress / done counts
- Live search and filter tabs
- Pull-to-refresh
- Responsive 2-column layout on web

**User Management (Admin only)**
- Create new users with name, email, password, and role
- Live avatar preview while typing

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator, Android Emulator, or Expo Go on a physical device

---

## Getting Started

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

Start the server:

```bash
npm start          # production
npm run dev        # with nodemon (install nodemon separately if needed)
```

The API will be available at `http://localhost:5000`.

### 2. Mobile

```bash
cd mobile
npm install
```

Open `mobile/services/api.js` and update `API_URL` to your machine's local IP address (not `localhost`):

```js
const API_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

Start the Expo dev server:

```bash
npm start
```

Then press `i` for iOS, `a` for Android, or `w` for web.

---

## API Reference

### Auth

| Method | Endpoint                    | Auth     | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | `/api/auth/register`        | None     | Register a new user      |
| POST   | `/api/auth/login`           | None     | Login, returns JWT token |
| GET    | `/api/auth/users`           | None     | List all users           |
| POST   | `/api/auth/admin/create-user` | Admin  | Admin creates a user     |

### Tasks

| Method | Endpoint          | Auth       | Description                        |
|--------|-------------------|------------|------------------------------------|
| POST   | `/api/tasks`      | Admin      | Create a task                      |
| GET    | `/api/tasks`      | Any        | Get tasks (Admin: all, User: own)  |
| PATCH  | `/api/tasks/:id`  | Any        | Update task (Admin: full, User: status only) |
| DELETE | `/api/tasks/:id`  | Admin      | Delete a task                      |

---

## Environment Variables

| Variable    | Description                        |
|-------------|------------------------------------|
| `MONGO_URI` | MongoDB connection string          |
| `JWT_SECRET`| Secret key for signing JWT tokens  |
| `PORT`      | Port for the Express server (default: 5000) |

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Node.js, Express 5, Mongoose, bcryptjs, JWT     |
| Mobile   | React Native, Expo (SDK 54), Expo Router        |
| Storage  | MongoDB, AsyncStorage (mobile session)          |
| HTTP     | Axios with request interceptor for auth headers |
