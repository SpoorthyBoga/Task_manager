# Task Manager

A full-stack task management app built with a React Native (Expo) mobile/web frontend and a Node.js/Express REST API backend, backed by MongoDB.

---

## Project Structure

```
/
├── backend/          # Express REST API
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose schemas (User, Task)
│   ├── routes/       # Auth and task route handlers
│   └── server.js     # Entry point
└── mobile/           # Expo (React Native) app
    ├── app/          # File-based routes (expo-router)
    ├── context/      # AuthContext (global auth state)
    ├── services/     # Axios API client
    ├── styles/       # StyleSheet modules
    └── constants/    # Theme tokens
```

---

## Features

### Authentication
- Email/password login with JWT tokens (1-day expiry)
- Passwords hashed with bcryptjs (salt rounds: 10)
- Token persisted in AsyncStorage and auto-attached to every request via an Axios interceptor
- Session restored on app launch — no re-login needed unless token is cleared
- Protected routes redirect unauthenticated users to the login screen

### Role-Based Access Control
Two roles exist: `Admin` and `User`. Access is enforced on both the API and the frontend.

| Action | Admin | User |
|---|---|---|
| View all tasks | ✅ | ❌ (own tasks only) |
| Create task | ✅ | ❌ |
| Edit task (title, desc, assignee) | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks) |
| Delete task | ✅ | ❌ |
| View team members | ✅ | ❌ |
| Create user | ✅ | ❌ |
| Delete user | ✅ | ❌ |

### Dashboard
- Stats bar showing total, in-progress, and completed task counts
- Search tasks by title (live filter)
- Filter tabs: All / Not Started / In Progress / Done
- Pull-to-refresh on both tasks and users lists
- Admins get a toggle to switch between the Tasks view and Team Members view
- Web layout renders tasks in a 2-column grid; mobile uses a single column
- Empty state illustration when no tasks match the current filter

### Task Management (Admin)
- Create tasks with a title, optional description, and assignee (picked from a user dropdown)
- Edit task title, description, and assignee — an "UNSAVED" badge appears when there are pending changes
- Discard-changes confirmation dialog before navigating away from an edited task
- Inline status picker on each task card (Not Started / In Progress / Done) — updates immediately via PATCH
- Delete tasks with a confirmation prompt (uses `window.confirm` on web, `Alert` on native)
- Task cards cycle through three background colors for visual distinction
- Assignee initial avatar shown on each card

### User Management (Admin)
- Create new users with name, email, password, and role selection (User or Admin)
- Live avatar preview showing initials as the name is typed
- Role picker uses a card-based UI with icons and descriptions
- View all team members in an expandable list — tap a user card to see their assigned tasks inline
- Delete users (also unassigns their tasks on the backend)

### Task View (Regular User)
- Sees only tasks assigned to them
- Can update the status of their own tasks via the inline picker
- No access to create/edit/delete task or user screens (redirected away if navigated directly)

---

## Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Express 4 | HTTP server and routing |
| Mongoose 9 | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT creation and verification |
| cors | Cross-origin request handling |
| dotenv | Environment variable loading |

### Mobile / Frontend
| Package | Purpose |
|---|---|
| Expo SDK 54 | Build toolchain and native APIs |
| expo-router 6 | File-based navigation |
| React Native 0.81 | UI framework |
| Axios | HTTP client |
| @react-native-async-storage/async-storage | Token/session persistence |
| @react-native-picker/picker | Dropdown selectors |
| @expo/vector-icons (Ionicons) | Icon set |
| react-native-reanimated | Animation support |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Expo CLI (`npm install -g expo-cli`) or use `npx expo`

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the server:

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### Mobile Setup

```bash
cd mobile
npm install
```

Update the API base URL in `mobile/services/api.js` to your machine's local IP (not `localhost` — the device/emulator can't reach it):

```js
const API_URL = 'http://<YOUR_LOCAL_IP>:5000/api';
```

Start the Expo dev server:

```bash
npx expo start
```

Then press `a` for Android, `i` for iOS, or `w` for web.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register a new user |
| POST | `/login` | None | Login and receive a JWT |
| GET | `/users` | None | List all users (no passwords) |
| POST | `/admin/create-user` | Admin | Create a user as an admin |
| DELETE | `/users/:id` | Admin | Delete a user and unassign their tasks |

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin | Create a new task |
| GET | `/` | Any | Get tasks (all for Admin, own for User) |
| PATCH | `/:id` | Any | Update task fields (reassign: Admin only) |
| DELETE | `/:id` | Admin | Delete a task |

---

## Data Models

### User
```js
{
  name:     String (required),
  email:    String (required, unique),
  password: String (hashed),
  role:     'Admin' | 'User' (default: 'User')
}
```

### Task
```js
{
  title:       String (required),
  description: String,
  status:      'Not Started' | 'In Progress' | 'Done' (default: 'Not Started'),
  assignedTo:  ObjectId → User (required),
  createdBy:   ObjectId → User
}
```
