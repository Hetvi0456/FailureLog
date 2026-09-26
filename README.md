# FailureLog

A personal debugging memory system for software developers to document, track, and recall root causes and verified solutions across projects.

## Problem

Developers frequently encounter runtime errors, configuration issues, and unexpected bugs. During the debugging process, they attempt multiple fixes, trigger secondary errors, and eventually find a resolution. However, over time, developers forget the precise root cause and definitive working solution. When the same or a similar error occurs months later, valuable time is wasted re-debugging the problem from scratch.

## Features

- **User Authentication**: Secure user registration and login powered by JWT tokens and bcrypt password hashing.
- **Failure Logging**: Log detailed error records with title, stack traces/error messages, project name, technology stack, error category, and environment context.
- **Failure Lifecycle CRUD**: Full lifecycle management—create, view details, edit fields, and delete failure entries.
- **Debugging Attempt Timeline**: Record step-by-step debugging attempts (Action, Result, Notes, Timestamp) chronologically for each failure.
- **Resolution Tracking**: Mark failures as resolved with explicit root cause analysis and definitive working solutions, automatically capturing resolution timestamps (`resolvedAt`).
- **Backend Search**: Real-time keyword search across titles, error messages, projects, and technologies.
- **Multi-Attribute Filtering**: Filter failure records by status (`open`, `in_progress`, `resolved`), project, technology, and category.
- **Dashboard Statistics**: Instant overview of debugging metrics including Total Failures, Open, In Progress, Resolved, Resolution Rate (%), and Top Technologies / Categories breakdown.

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Router**: React Router 7
- **Styling**: Vanilla CSS (Modern Dark Mode Design System)

### Backend
- **Runtime**: Node.js (v22+)
- **Server**: Express 4
- **Security**: jsonwebtoken, bcryptjs, cors, dotenv

### Database
- **Database**: MongoDB Atlas
- **ORM**: Mongoose 8

## Project Structure

```text
FailureLog/
├── client/                 # React + Vite frontend application
│   ├── src/
│   │   ├── api/            # API client & fetch helper
│   │   ├── components/     # Reusable UI components (Navbar, ProtectedRoute)
│   │   ├── context/        # React AuthContext provider
│   │   ├── pages/          # Login, Register, Dashboard, Failure forms & details
│   │   ├── App.jsx         # Router & page routes
│   │   └── index.css       # Core design system & responsive styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Express REST API backend
│   ├── config/             # Database connection helper (db.js)
│   ├── controllers/        # Auth & Failure request handlers
│   ├── middleware/         # JWT Auth guard middleware
│   ├── models/             # User & Failure Mongoose schemas
│   ├── routes/             # Auth, Failure & Health Express routes
│   ├── .env.example        # Environment variable template
│   ├── server.js           # Main Express app entrypoint
│   └── package.json
├── docs/                   # Product specification & implementation roadmap
│   ├── product.md
│   └── roadmap.md
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas cluster connection string

### Installation & Execution

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd FailureLog
   ```

2. **Setup Backend (`server/`)**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server/` directory based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/failurelog?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

3. **Setup Frontend (`client/`)**:
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The React frontend application will run on `http://localhost:3000`.

---

## Current MVP Scope

- **Phase 1**: Initial project setup, Express server, Mongoose MongoDB Atlas connection, and health check API.
- **Phase 2**: JWT Authentication (Register/Login/Me) with bcrypt password hashing, Mongoose User & Failure schemas, and complete user-isolated Failure CRUD.
- **Phase 3**: Embedded debugging attempt timeline tracking (`POST /api/failures/:id/attempts`), backend query search and multi-filtering (`GET /api/failures`), and overall account metrics with resolution rates.
- **Phase 4**: Final UI polish, mobile responsiveness, empty state UX, production build validation, and deployment preparation.

---

## Future Ideas (Out of MVP Scope)

- **AI-Assisted Diagnosis**: Auto-suggested solutions based on stack trace pattern matching.
- **Semantic Vector Search**: Code embeddings to query past failures by semantic meaning.
- **Team Collaboration**: Workspace sharing, team error knowledge bases, and social debugging comments.
- **Advanced Analytics**: Debugging time tracking, error frequency graphs, and recurring bug alerts.
