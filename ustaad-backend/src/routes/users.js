import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import {
  buildPersonalPlan,
  updateStreak,
} from "../utils/helpers.js";
import { buildStudentAnalytics, deriveAssessmentInsights } from "../utils/analytics.js";
import { buildWeeklyTargets, studentLevel, studentTitle } from "../utils/gamification.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, grade, board, subjects, goals } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (grade) user.grade = grade;
    if (board) user.board = board;
    if (subjects) user.subjects = subjects;
    if (goals) user.goals = goals;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/assessment", protect, async (req, res) => {
  const questions = await Question.find({ type: "assessment" }).select(
    "-answer -explanation"
  );
  res.json(questions);
});

router.post("/assessment/submit", protect, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }

    const questions = await Question.find({ type: "assessment" });
    let score = 0;

    answers.forEach(({ questionId, selected }) => {
      const q = questions.find((item) => item._id.toString() === questionId);
      if (q && q.answer === selected) score += 1;
    });

    const { strengths, weaknesses, subjectScores } = deriveAssessmentInsights(
      questions,
      answers
    );

    const user = req.user;
    user.assessment = {
      score,
      total: questions.length,
      strengths: strengths.map(({ topic }) => topic),
      weaknesses: weaknesses.map(({ topic }) => topic),
      subjectScores,
    };

    Object.entries(subjectScores).forEach(([subjectId, pct]) => {
      const current = user.subjectProgress?.[subjectId] || 0;
      if (pct > current) {
        user.subjectProgress[subjectId] = pct;
      }
    });
    user.personalPlan = buildPersonalPlan(user.assessment, user.subjects);
    user.xp += score * 10;
    user.coins += score * 5;
    updateStreak(user);
    await user.save();

    res.json({
      score,
      total: questions.length,
      strengths: user.assessment.strengths,
      weaknesses: user.assessment.weaknesses,
      personalPlan: user.personalPlan,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/plan-viewed", protect, async (req, res) => {
  try {
    const user = req.user;
    user.planViewed = true;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/onboarding-complete", protect, async (req, res) => {
  try {
    const user = req.user;
    user.planViewed = true;
    user.onboardingComplete = true;
    updateStreak(user);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/dashboard", protect, async (req, res) => {
  res.json({
    name: req.user.name,
    xp: req.user.xp,
    coins: req.user.coins,
    streak: req.user.streak,
    badges: req.user.badges,
    level: studentLevel(req.user.xp),
    title: studentTitle(req.user.xp, req.user.lessonsCompleted),
    lessonsCompleted: req.user.lessonsCompleted,
    onboardingComplete: req.user.onboardingComplete,
    personalPlan: req.user.personalPlan,
    assessment: req.user.assessment,
  });
});

router.get("/weekly-targets", protect, async (req, res) => {
  res.json(buildWeeklyTargets(req.user));
});

router.get("/analytics", protect, async (req, res) => {
  res.json(buildStudentAnalytics(req.user));
});

router.get("/recommendations", protect, async (req, res) => {
  const analytics = buildStudentAnalytics(req.user);
  const weakness = analytics.weaknesses[0];
  const strength = analytics.strengths[0];

  const items = [];

  if (weakness) {
    items.push({
      type: "Revise",
      topic: weakness.topic,
      reason: `Score ${weakness.score}% — focus here to improve`,
    });
  }

  if (strength) {
    items.push({
      type: "Master",
      topic: strength.topic,
      reason: `${strength.score}% — keep building on this strength`,
    });
  }

  if (items.length === 0) {
    items.push({
      type: "Start",
      topic: "Complete your first lesson",
      reason: "Finish a chapter to unlock personalized recommendations",
    });
  }

  res.json(items);
});

export default router;
