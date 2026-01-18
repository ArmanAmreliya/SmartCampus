# SmartCampus - Real-time Academic Dashboard

SmartCampus is a modern, real-time academic management platform designed to bridge the gap between students and faculty. Built with the **MERN Stack (MongoDB, Express, React, Node.js)** and powered by **GraphQL (Apollo)**, it offers live status updates, AI-assisted scheduling, and seamless communication.

## 🚀 Features

### 👨‍🏫 Faculty Portal
- **Live Status Control**: Toggle scheduling status (Available/Busy) in real-time.
- **Dynamic Scheduling**: Manage weekly slots and overrides.
- **Broadcast System**: Send instant announcements to student dashboards.
- **Appointment Management**: Accept or reschedule student visits.

### 🎓 Student Dashboard
- **Real-time Faculty Status**: See who is available instantly via "Live Sync".
- **AI Academic Assistant**: Chatbot powered by Gemini for instant queries about schedules and faculty.
- **Smart Appointment Booking**: Book slots based on live availability.
- **Broadcast Feed**: Stay updated with department-wide announcements.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Apollo Client
- **Backend**: Node.js, Express, Apollo Server, GraphQL (TypeDefs/Resolvers)
- **Database**: MongoDB (Mongoose)
- **Real-time**: GraphQL Subscriptions (WebSocket)
- **AI Integration**: Google Gemini API

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- pnpm (recommended) or npm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SmartCampus
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# GEMINI_API_KEY=your_gemini_key
npm run dev
```

### 3. Frontend Setup
```bash
cd client
pnpm install
# Create .env.local file with:
# VITE_GRAPHQL_API_URL=http://localhost:5000/graphql
pnpm run dev
```

## 🌐 Deployment

The project is configured for seamless deployment:
- **Frontend**: optimized via `pnpm build` (Vite)
- **Backend**: standard Node.js server

---
*Developed for LDCE SmartCampus Project*
