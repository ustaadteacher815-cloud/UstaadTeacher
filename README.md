# Ustaad — MERN Learning Platform

AI-powered education platform for Class 11 & 12 students.

## Project Structure

```
Ustaad_Teacher/
├── ustaad-backend/    # Node.js + Express + MongoDB API
└── ustaad-frontend/   # React + Vite frontend
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/ustaad`)

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Backend (`ustaad-backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ustaad
JWT_SECRET=ustaad_dev_secret_key_2026
CLIENT_URL=http://localhost:5173
```

Frontend (`ustaad-frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start the servers

**Terminal 1 — Backend:**
```bash
npm run dev:backend
```

**Terminal 2 — Frontend:**
```bash
npm run dev:frontend
```

Open http://localhost:5173

## Deploy to Render (Production)

See **[DEPLOY.md](./DEPLOY.md)** for full steps.

Quick summary:
1. Create **MongoDB Atlas** cluster and copy connection string
2. Push this repo to **GitHub**
3. On Render → **New Blueprint** → connect repo → set `MONGODB_URI`
4. Run `npm run seed` in backend shell after deploy


1. Click **GET STARTED** → Sign up with mobile number
2. OTP is shown on screen in dev mode (or use `123456`)
3. Complete profile → Assessment → Personal plan → Dashboard
4. All XP, coins, streaks, and progress are saved in MongoDB

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP & login |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/assessment/submit` | Submit assessment |
| GET | `/api/users/dashboard` | Dashboard stats |
| GET | `/api/challenges/today` | Daily challenge |
| POST | `/api/challenges/complete` | Complete challenge |
| GET | `/api/learning/subjects` | Learning paths |
| POST | `/api/ai/chat` | AI tutor chat |
| GET | `/api/leaderboard` | Rankings |
| GET | `/api/rewards` | Rewards & coins |
