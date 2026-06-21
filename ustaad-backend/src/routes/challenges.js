import express from "express";
import { protect } from "../middleware/auth.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { updateStreak } from "../utils/helpers.js";

const router = express.Router();

const todayKey = () => new Date().toISOString().slice(0, 10);

router.get("/today", protect, async (req, res) => {
  const challenge = await Question.findOne({ type: "daily" });
  if (!challenge) {
    return res.status(404).json({ message: "No daily challenge found" });
  }

  const completed = req.user.completedChallenges.includes(todayKey());
  res.json({
    _id: challenge._id,
    title: "Real-Life Problem",
    question: challenge.question,
    options: challenge.options,
    completed,
  });
});

router.post("/complete", protect, async (req, res) => {
  try {
    const { questionId, selected } = req.body;
    const challenge = await Question.findById(questionId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const day = todayKey();
    const user = req.user;
    if (user.completedChallenges.includes(day)) {
      return res.status(400).json({ message: "Challenge already completed today" });
    }

    const correct = challenge.answer === selected;
    user.completedChallenges.push(day);
    if (correct) {
      user.xp += 50;
      user.coins += 10;
    } else {
      user.xp += 20;
      user.coins += 5;
    }
    updateStreak(user);
    await user.save();

    res.json({
      correct,
      xpEarned: correct ? 50 : 20,
      coinsEarned: correct ? 10 : 5,
      explanation: challenge.explanation,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
