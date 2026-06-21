import express from "express";
import { protect } from "../middleware/auth.js";
import { updateStreak } from "../utils/helpers.js";
import {
  getSkillTracksForUser,
  findSkillTrack,
  completeSkillLesson,
} from "../data/skills.js";

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.json(getSkillTracksForUser(req.user));
});

router.post("/:trackId/lessons/:lessonId/complete", protect, async (req, res) => {
  try {
    const track = findSkillTrack(req.params.trackId);
    if (!track) {
      return res.status(404).json({ message: "Skill track not found" });
    }

    const result = completeSkillLesson(req.user, req.params.trackId, req.params.lessonId);
    if (!result) {
      return res.status(400).json({ message: "Invalid lesson" });
    }

    updateStreak(req.user);
    await req.user.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
