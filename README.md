# Academic Emotional Support Portal

A full-stack MERN-based web application designed to support students through emotional check-ins, support requests, counselor interaction, and resource access in an academic environment.

---

## 📌 Project Overview

The **Academic Emotional Support Portal** is built to provide a structured platform where students can:

* Submit emotional check-ins
* Request support from counselors
* Access mental wellness resources
* Communicate securely within an academic support ecosystem

The system includes role-based access for **Students, Counselors, and Admins**.

---

## 🛠️ Tech Stack

### 🌐 Frontend

* React.js (Vite)
* React Router
* Axios
* Tailwind CSS
* Recharts / Chart.js
* Context API / Redux

### ⚙️ Backend

* Node.js
* Express.js
* RESTful APIs
* JWT Authentication
* bcrypt.js
* CORS
* Helmet

### 🗄️ Database

* MongoDB Atlas
* Mongoose ODM

### ☁️ Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 🔐 Security Features

* JWT-based authentication
* Role-based access control
* Secure password hashing
* Input validation and sanitization
* Optional anonymous submissions

---

## 👥 User Roles

### Student

* Emotional check-in submission
* Support request creation
* View previous submissions

### Counselor

* View student requests
* Respond to support cases
* Update request status

### Admin

* Manage users
* View system analytics
* Monitor overall activity

---

## 🔁 System Workflow

Student Login
→ Submit emotional check-in / support request
→ Backend processes data
→ MongoDB stores records
→ Counselor dashboard displays requests
→ Counselor responds
→ Student receives support and resources

---

## 📊 Core Features

* Emotional check-in system
* Anonymous submission option
* Counselor response dashboard
* Resource access section
* Analytics dashboard
* Status tracking for requests

---

## 📁 Project Structure

```bash
src/
 ┣ components/
 ┣ pages/
 ┣ context/
 ┣ services/
 ┣ utils/
```

---

## 🧩 MongoDB Schema

### User

* name
* email
* role
* password

### CheckIn

* userId
* moodLevel
* message
* anonymous
* createdAt

### SupportRequest

* studentId
* counselorId
* status
* messages[]

---

## 🔍 Future Enhancements

* Appointment booking
* Email notifications
* Dark mode
* Emergency helpline section
* AI-based sentiment tagging

---

## 🚀 Project Status

Currently under development with focus on frontend improvement, workflow integration, and secure backend functionality.

---

## 🎯 Final Goal

A practical, scalable, and real-world academic support platform that demonstrates full-stack development, secure system design, and user-centered problem solving.

---

## 📌 Author

**Abishek Hariharan**
