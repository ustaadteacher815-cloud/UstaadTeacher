import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import { studentLevel, studentTitle } from "../utils/gamification.js";

const router = express.Router();

function formatEntry(user, rank, currentUserId) {
  const isYou = user._id.toString() === currentUserId;
  return {
    rank,
    id: user._id,
    name: isYou ? "You" : user.name || "Student",
    xp: user.xp || 0,
    grade: user.grade || "",
    board: user.board || "",
    streak: user.streak || 0,
    quests: user.lessonsCompleted || 0,
    level: studentLevel(user.xp),
    title: studentTitle(user.xp, user.lessonsCompleted),
    highlight: isYou,
    isYou,
  };
}

router.get("/", protect, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const filter = { role: "student", onboardingComplete: true };

    const students = await User.find(filter)
      .sort({ xp: -1, updatedAt: -1 })
      .select("name xp grade board streak lessonsCompleted");

    const ranked = students.map((user, index) =>
      formatEntry(user, index + 1, currentUserId)
    );

    let yourRank = ranked.find((entry) => entry.isYou);

    if (!yourRank && req.user.role === "student") {
      const higherCount = await User.countDocuments({
        ...filter,
        xp: { $gt: req.user.xp || 0 },
      });

      yourRank = {
        rank: higherCount + 1,
        id: req.user._id,
        name: "You",
        xp: req.user.xp || 0,
        grade: req.user.grade || "",
        board: req.user.board || "",
        streak: req.user.streak || 0,
        quests: req.user.lessonsCompleted || 0,
        level: studentLevel(req.user.xp),
        title: studentTitle(req.user.xp, req.user.lessonsCompleted),
        highlight: true,
        isYou: true,
      };
    }

    const top10 = ranked.slice(0, 10);
    const rankings = [...top10];

    if (yourRank && !top10.some((entry) => entry.isYou)) {
      rankings.push(yourRank);
    }

    res.json({
      rankings,
      yourRank: yourRank?.rank ?? null,
      totalStudents: students.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
