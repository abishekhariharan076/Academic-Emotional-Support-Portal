# Academic Emotional Support Portal (AESP) - Project Details

The **Academic Emotional Support Portal (AESP)** is a specialized MERN (MongoDB, Express, React, Node.js) web application designed to bridge the gap between students and mental health professionals in an academic setting. It provides a secure, domain-isolated platform for emotional check-ins, support requests, and resource management.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Data Fetching**: Axios
- **Visualization**: Recharts (for mood trends and analytics)
- **State Management**: Context API (for Auth and User state)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens) & bcrypt.js (password hashing)
- **Security**: 
  - `helmet`: Secure HTTP headers
  - `express-rate-limit`: Brute-force protection
  - `mongo-sanitize`: NoSQL injection prevention
  - `cors`: Cross-Origin Resource Sharing control
- **File Handling**: `multer` (for photo/video uploads in check-ins)

### Database
- **Primary DB**: MongoDB Atlas
- **ODM**: Mongoose

---

## 🏗️ Architecture & Core Logic

### Domain-Based Isolation
A key feature of AESP is its **Institutional Domain Filtering**. Users are automatically grouped by their email domain (e.g., `@university.edu`). 
- Students only see counselors from their own institution.
- Counselors only manage students from their own institution.
- Admins monitor activity within their specific domain.

### Role-Based Access Control (RBAC)
The system strictly enforces permissions for three distinct roles:
1. **Student**: Can submit check-ins, create support requests, and view their history.
2. **Counselor**: Can respond to student requests, update case statuses, and view mood analytics for their assigned students.
3. **Admin**: Manages user accounts, institutional requests, and system-wide analytics.

---

## 🛠️ Core Features

### 1. Emotional Check-Ins
Students can log their emotional state using a structured form:
- **Mood Rating**: Scale-based input.
- **Message**: Textual description of their feelings.
- **Media Support**: Support for up to 5 photos or videos to provide visual context (Recent Update).
- **Anonymous Option**: Students can choose to submit check-ins anonymously to the counselor.

### 2. Support Requests
A ticketing-style system for direct counselor intervention:
- Students initiate "Support Requests".
- Counselors can respond through a dedicated interface.
- Status tracking: `Pending`, `In-Progress`, `Resolved`.

### 3. Resource/Reference Library
A curated section of mental wellness guides tailored for students:
- Topics include Anxiety, Sleep Hygiene, and Focus & Time Management.
- Built with a flexible, section-based dynamic layout.

### 4. Admin Dashboard
- **Request Management**: Connect counselors with students.
- **User Management**: Approve/Revoke access.
- **Analytics**: System-wide mood trends and engagement metrics.

---

## 🗄️ Data Models (Mongoose Schemas)

- **User**: Name, Email, Password (hashed), Role, Domain.
- **CheckIn**: User Reference, Mood Level, Factors, Message, Attachments (Paths), Anonymous Flag, Domain.
- **SupportRequest**: Student Reference, Counselor Reference, Status, Conversation Logs.
- **InstitutionRequest**: Metadata for handling institutional-level tasks.

---

## 📂 Project Structure

```text
/
├── backend/
│   ├── controllers/      # Business logic (auth, checkin, admin, etc.)
│   ├── middleware/       # JWT auth, upload management, sanitization
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoint definitions
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Input, Button, Layout)
│   │   ├── pages/        # Main views (Dashboard, Login, CheckIn)
│   │   ├── context/      # Global state (AuthContext)
│   │   └── App.jsx       # Routing logic
└── docs/                 # Feature walkthroughs and developer guides
```

---

## 🌐 Deployment
- **Frontend**: Hosted on **Vercel**.
- **Backend**: Hosted on **Render**.
- **Database**: Cloud-hosted on **MongoDB Atlas**.
