import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import learningRoutes from "./routes/learning.js";
import challengeRoutes from "./routes/challenges.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import aiRoutes from "./routes/ai.js";
import rewardsRoutes from "./routes/rewards.js";
import communityRoutes from "./routes/community.js";
import adminRoutes from "./routes/admin.js";
import parentRoutes from "./routes/parent.js";
import careerRoutes from "./routes/careers.js";
import skillRoutes from "./routes/skills.js";
import { initSkillCareerContent } from "./services/skillCareerService.js";
import { checkGeminiConnection } from "./services/aiService.js";

const app = express();const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Ustaad API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/skills", skillRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const start = async () => {
  await connectDB();
  await initSkillCareerContent();
  const aiStatus = await checkGeminiConnection();
  if (aiStatus.ok) {
    console.log(`AI Tutor: Gemini connected (${aiStatus.model})`);
  } else {
    console.warn(`AI Tutor: using fallback replies — ${aiStatus.reason}`);
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
