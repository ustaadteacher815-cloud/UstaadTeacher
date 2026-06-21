# Deploy Ustaad on Render

## Prerequisites

1. [GitHub](https://github.com) account
2. [Render](https://render.com) account (free tier works)
3. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster (Render does not host MongoDB)

---

## Step 1 — MongoDB Atlas

1. Create a free **M0 cluster** on MongoDB Atlas
2. **Database Access** → Add user (username + password)
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. **Connect** → Drivers → copy connection string, e.g.:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/ustaad?retryWrites=true&w=majority
   ```
5. Replace `USER`, `PASSWORD`, and ensure database name is `ustaad`

---

## Step 2 — Push code to GitHub

```bash
cd Ustaad_Teacher
git init
git add .
git commit -m "Prepare Ustaad for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ustaad-teacher.git
git push -u origin main
```

---

## Step 3 — Deploy on Render (Blueprint)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your GitHub repo (`ustaad-teacher`)
4. Render detects `render.yaml` and creates:
   - `ustaad-backend` (Node API)
   - `ustaad-frontend` (Static React site)
5. When prompted, set **MONGODB_URI** to your Atlas connection string
6. Click **Apply** and wait for both services to deploy (~5–10 min)

---

## Step 4 — Seed production database

After backend is live, open **Render Shell** on `ustaad-backend` (or run locally with production URI):

```bash
npm run seed
```

This loads assessment, daily challenge, and practice questions.

---

## Step 5 — Verify

| Service | URL |
|---------|-----|
| Frontend | `https://ustaad-frontend.onrender.com` |
| Backend health | `https://ustaad-backend.onrender.com/api/health` |

Test signup flow on the live frontend. OTP appears in backend **Logs** on Render (or use `123456` in dev).

---

## Environment variables (auto-set by Blueprint)

| Service | Variable | Source |
|---------|----------|--------|
| Backend | `MONGODB_URI` | You set manually |
| Backend | `JWT_SECRET` | Auto-generated |
| Backend | `CLIENT_URL` | Linked from frontend URL |
| Frontend | `BACKEND_URL` | Linked from backend URL |

---

## Manual deploy (without Blueprint)

### Backend — Web Service
- **Root Directory:** `ustaad-backend`
- **Build:** `npm install`
- **Start:** `npm start`
- **Env:** `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL=https://YOUR-FRONTEND.onrender.com`

### Frontend — Static Site
- **Root Directory:** `ustaad-frontend`
- **Build:** `npm install && npm run build:render`
- **Publish:** `dist`
- **Env:** `BACKEND_URL=https://YOUR-BACKEND.onrender.com`
- **Redirects:** `/*` → `/index.html` (SPA)

---

## Notes

- Free tier backend **spins down** after inactivity; first request may take ~30s
- Always use **HTTPS** URLs in production env vars
- Never commit `.env` files — use Render dashboard for secrets
