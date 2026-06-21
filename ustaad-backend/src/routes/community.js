import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import StudyLoungeMessage from "../models/StudyLoungeMessage.js";
import { studyLounges, findStudyLounge } from "../data/studyLounges.js";
import { updateStreak } from "../utils/helpers.js";

const router = express.Router();

async function getOnlineCount(loungeId) {
  const joined = await User.countDocuments({ joinedGroups: loungeId, role: "student" });
  const lounge = findStudyLounge(loungeId);
  return (lounge?.baseOnline || 20) + joined;
}

async function getLoungeMembers(loungeId, limit = 8) {
  const members = await User.find({ joinedGroups: loungeId, role: "student" })
    .select("name xp grade")
    .sort({ updatedAt: -1 })
    .limit(limit);

  return members.map((user) => ({
    id: user._id,
    name: user.name || "Student",
    xp: user.xp || 0,
    grade: user.grade || "",
  }));
}

router.get("/", protect, async (req, res) => {
  try {
    const lounges = await Promise.all(
      studyLounges.map(async (lounge) => ({
        ...lounge,
        joined: req.user.joinedGroups.includes(lounge.id),
        members: await getOnlineCount(lounge.id),
      }))
    );
    res.json(lounges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:loungeId", protect, async (req, res) => {
  try {
    const lounge = findStudyLounge(req.params.loungeId);
    if (!lounge) {
      return res.status(404).json({ message: "Study lounge not found" });
    }

    const dbMessages = await StudyLoungeMessage.find({ loungeId: lounge.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    let messages = dbMessages.reverse().map((msg) => ({
      id: msg._id,
      userId: msg.userId,
      userName: msg.userName,
      text: msg.text,
      isYou: msg.userId.toString() === req.user._id.toString(),
      createdAt: msg.createdAt,
    }));

    if (messages.length === 0) {
      messages = [
        {
          id: "welcome",
          userName: "Ustaad Host",
          text: `Welcome to ${lounge.name}! ${lounge.challenge}`,
          isYou: false,
          createdAt: new Date(),
        },
      ];
    }

    const members = await getLoungeMembers(lounge.id);

    res.json({
      ...lounge,
      joined: req.user.joinedGroups.includes(lounge.id),
      members: await getOnlineCount(lounge.id),
      activeScholars: members,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:loungeId/join", protect, async (req, res) => {
  try {
    const lounge = findStudyLounge(req.params.loungeId);
    if (!lounge) {
      return res.status(404).json({ message: "Study lounge not found" });
    }

    if (!req.user.joinedGroups.includes(lounge.id)) {
      req.user.joinedGroups.push(lounge.id);
      updateStreak(req.user);
      await req.user.save();
    }

    res.json({
      message: "Entered study lounge",
      loungeId: lounge.id,
      joinedGroups: req.user.joinedGroups,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:loungeId/messages", protect, async (req, res) => {
  try {
    const lounge = findStudyLounge(req.params.loungeId);
    if (!lounge) {
      return res.status(404).json({ message: "Study lounge not found" });
    }

    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (!req.user.joinedGroups.includes(lounge.id)) {
      req.user.joinedGroups.push(lounge.id);
    }

    const message = await StudyLoungeMessage.create({
      loungeId: lounge.id,
      userId: req.user._id,
      userName: req.user.name || "Student",
      text: text.trim().slice(0, 500),
    });

    req.user.xp += 5;
    updateStreak(req.user);
    await req.user.save();

    res.json({
      message: {
        id: message._id,
        userId: message.userId,
        userName: message.userName,
        text: message.text,
        isYou: true,
        createdAt: message.createdAt,
      },
      xpEarned: 5,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
