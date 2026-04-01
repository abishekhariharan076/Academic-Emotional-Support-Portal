# Academic Emotional Support Portal

A full-stack student support platform for emotional check-ins, counselor requests, wellness resources, and role-based campus workflows.

## Overview

The Academic Emotional Support Portal is designed to help students reflect early, ask for help safely, and access practical support resources without leaving the academic environment. The app includes dedicated experiences for students, counselors, and admins.

## Core Features

- Private emotional check-ins with optional anonymous mode
- Support request flow for counselor follow-up
- Student dashboard with recent trends and action prompts
- Resource library with category filters and a quick support planner
- Role-based access control for student, counselor, and admin users
- Domain-aware data separation for institution-specific workflows

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Framer Motion

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Express Validator
- Helmet and rate limiting

## Project Structure

```text
backend/
frontend/
docs/
```

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Use the example files as a starting point:

- `backend/.env.example`
- `frontend/.env.example`

### 3. Run the app

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

## Recent Enhancements

- Recovered and cleaned a partially merged TypeScript frontend
- Improved validation and indexing across backend routes and models
- Added a quick support planner to the resource library
- Refreshed the landing, dashboard, check-in, and resource experiences

## Documentation

Additional notes are available in [docs](./docs).
