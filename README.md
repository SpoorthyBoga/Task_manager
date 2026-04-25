# Task Manager — Role-Based Access Control

A full-stack task management application built to fulfill the React Native & Node.js assignment requirements. This project features a robust Role-Based Access Control (RBAC) system, a custom Neo-Brutalist design system, and full synchronization between a React Native mobile/web frontend and a Node.js/Express REST API.

---

## Live Deployment Links

| Environment | URL |
| :--- | :--- |
| **Frontend (Web/Mobile)** | [https://task-manager-silk-kappa-54.vercel.app/](https://task-manager-silk-kappa-54.vercel.app/) |
| **Backend API** | [https://task-manager-4q6p.onrender.com](https://task-manager-4q6p.onrender.com) |

---

## Test Credentials

### Admin Account
| Field | Value |
| :--- | :--- |
| **Email** | admin@test.com |
| **Password** | password123 |

*Role capabilities: Full access. Can create/edit/delete tasks and users, and view all team members across the workspace.*

### User Account 1
| Field | Value |
| :--- | :--- |
| **Email** | user1@gmail.com |
| **Password** | user1 |

### User Account 2
| Field | Value |
| :--- | :--- |
| **Email** | user2@gmail.com |
| **Password** | user2 |

*Role capabilities: Restricted access. Can only view and update the status of tasks directly assigned to them.*

---

## Assignment Evaluation Checklist

This project successfully implements all "Must-Have" requirements and fulfills every single "Good-to-Have" bonus objective.

### ✅ Must-Have Requirements

- **Mobile App:** Built with React Native (Expo). Includes user login, viewing assigned tasks, updating task statuses, clean list formatting, and proper loading/empty states.
- **Backend:** Built with Node.js and Express. Features secure authentication APIs, role-based task fetching, task creation (Admin only), and status updates.
- **Database:** Powered by MongoDB Atlas. Stores Users (Admin/User roles) and Tasks (Title, description, status, assigned user).
- **Role-Based Access (Admin):** Creates tasks, assigns them, views all tasks.
- **Role-Based Access (User):** Views only assigned tasks, updates the status of their own tasks.
- **Data Handling:** Frontend fetches via Axios. Tokens persist across app restarts using AsyncStorage.

### 🌟 Good-to-Have (Bonus Features Achieved)

- **Edit/Delete Tasks:** Admins can fully modify or delete tasks and users.
- **Filter Tasks:** Integrated tab filters for All / Not Started / In Progress / Done.
- **Search Functionality:** Live, real-time search bar to filter tasks by title.
- **Better UI:** Custom "Neo-Brutalism" design system with responsive cards, status pills, and interactive hover/focus states.
- **Token-Based Auth:** Fully secured with JWT (JSON Web Tokens), bcrypt password hashing, and Axios interceptors.

---

## Tech Stack

### Frontend (Mobile & Web)

| Technology | Purpose |
| :--- | :--- |
| **React Native (Expo SDK 54)** | Core UI framework for cross-platform rendering |
| **Expo Router 6** | File-based routing and navigation |
| **Axios** | HTTP client for API communication |
| **AsyncStorage** | Local persistence for JWT sessions |
| **@expo/vector-icons** | Scalable UI iconography |

### Backend (API)

| Technology | Purpose |
| :--- | :--- |
| **Node.js & Express 4** | Server runtime and REST API routing |
| **MongoDB & Mongoose 9** | Cloud database and Object Data Modeling |
| **JSON Web Token (JWT)** | Secure, stateless authentication |
| **Bcrypt.js** | Cryptographic password hashing |

---

## Project Structure

```text
/
├── backend/
│   ├── middleware/       # JWT protection & RBAC authorization
│   ├── models/           # Mongoose schemas (User.js, Task.js)
│   ├── routes/           # Express routes (auth.js, tasks.js)
│   └── server.js         # API Entry Point & DB connection
└── mobile/
    ├── app/              # Expo Router Screens
    │   ├── index.jsx         # Login Screen
    │   ├── dashboard.jsx     # Main Workspace Dashboard
    │   ├── create-task.jsx   # Admin Task Creation
    │   ├── edit-task.jsx     # Admin Task Editing
    │   └── create-user.jsx   # Admin User Creation
    ├── context/          # Global AuthContext provider
    ├── services/         # Axios API configuration
    ├── styles/           # Modular Neo-Brutalist stylesheets
    └── constants/        # Centralized theme tokens
```

---

## Local Development Setup

### Prerequisites

- Node.js (v18+)
- MongoDB instance (Local or Atlas URI)
- Expo CLI (`npm install -g expo-cli`)

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

Start the development server:

```bash
npm run dev
```

*The API will start at `http://localhost:5000`.*

### 2. Frontend (Mobile) Setup

Navigate to the mobile directory and install dependencies:

```bash
cd mobile
npm install
```

Configure the API connection in `mobile/services/api.js`. Replace the `LOCAL_URL` IP address with your machine's actual IPv4 address (e.g., `192.168.1.x`) so your physical device or emulator can communicate with the local Node server.

```javascript
const LOCAL_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

Start the Expo bundler:

```bash
npx expo start
```

*Press `a` to open in an Android Emulator, `i` for iOS Simulator, or `w` to run in the web browser.*

---

## REST API Reference

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | Register a new account |
| **POST** | `/login` | Public | Authenticate and return JWT |
| **GET** | `/users` | Private | List all workspace users |
| **POST** | `/admin/create-user` | Admin Only | Provision a new team member |
| **DELETE** | `/users/:id` | Admin Only | Remove user (auto-unassigns tasks) |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Admin Only | Create a new task |
| **GET** | `/` | Private | Fetch tasks (Admins get all, Users get own) |
| **PATCH** | `/:id` | Private | Update status (Users) or reassign (Admins) |
| **DELETE** | `/:id` | Admin Only | Delete a task entirely |
