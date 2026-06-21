import express from "express";
import { protect } from "../middleware/auth.js";
import { getAiTutorReply, getChapterLessonScript, getChapterExtras } from "../services/aiService.js";

const router = express.Router();

router.get("/history", protect, async (req, res) => {
  res.json(req.user.aiChatHistory || []);
});

router.delete("/history", protect, async (req, res) => {
  req.user.aiChatHistory = [];
  await req.user.save();
  res.json({ message: "Chat cleared" });
});

router.post("/chat", protect, async (req, res) => {
  try {
    const { message, chapterName, sessionOnly, localHistory } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const user = req.user;
    const history = sessionOnly
      ? (Array.isArray(localHistory) ? localHistory : [])
      : user.aiChatHistory || [];

    const aiMessage = chapterName
      ? `The student is studying the CBSE chapter "${chapterName}". Answer clearly about this chapter only:\n${message.trim()}`
      : message.trim();

    const { reply, source } = await getAiTutorReply(aiMessage, history);

    if (!sessionOnly) {
      user.aiChatHistory.push({ role: "user", text: message });
      user.aiChatHistory.push({ role: "ai", text: reply });

      if (user.aiChatHistory.length > 50) {
        user.aiChatHistory = user.aiChatHistory.slice(-50);
      }

      await user.save();
    }

    res.json({
      reply,
      source,
      history: sessionOnly ? undefined : user.aiChatHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/lesson-script", protect, async (req, res) => {
  try {
    const { chapterName } = req.body;
    if (!chapterName?.trim()) {
      return res.status(400).json({ message: "chapterName is required" });
    }
    const result = await getChapterLessonScript(chapterName.trim());
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/chapter-extras", protect, async (req, res) => {
  try {
    const { chapterName, type } = req.body;
    if (!chapterName?.trim()) {
      return res.status(400).json({ message: "chapterName is required" });
    }
    if (!["diagrams", "formulas"].includes(type)) {
      return res.status(400).json({ message: "type must be diagrams or formulas" });
    }
    const result = await getChapterExtras(chapterName.trim(), type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
