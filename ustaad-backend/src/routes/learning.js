import express from "express";
import { protect } from "../middleware/auth.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { updateStreak } from "../utils/helpers.js";
import {
  findSubjectByChapterId,
  getSubjectsForStudentGrade,
  getSubjectForStudent,
  isChapterAllowedForStudent,
  normalizeStudentGrade,
  findChapterById,
} from "../data/syllabus.js";
import { getBoardFaqForStudent } from "../data/boardFaq.js";
import {
  getPracticeQuestionsForChapter,
  gradePracticeAnswers,
  assertChapterAccess,
} from "../utils/chapterQuestions.js";

const router = express.Router();

function formatSubjectsResponse(user) {
  const progress = user.subjectProgress || {};
  const gradeLabel = normalizeStudentGrade(user.grade);

  return getSubjectsForStudentGrade(user.grade).map((subject) => ({
    id: subject.id,
    name: subject.name,
    icon: subject.icon,
    grade: subject.grade,
    board: subject.board,
    progress: progress[subject.id] || 0,
    chapters: subject.chapters.length,
    studentGrade: gradeLabel,
  }));
}

router.get("/subjects", protect, async (req, res) => {
  res.json(formatSubjectsResponse(req.user));
});

router.get("/subjects/:subject/chapters", protect, (req, res) => {
  const subject = getSubjectForStudent(req.user.grade, req.params.subject);
  if (!subject) {
    return res.status(404).json({ message: "Subject not found for your grade" });
  }
  res.json(subject.chapters);
});

router.get("/practice/:chapterId", protect, async (req, res) => {
  try {
    assertChapterAccess(req.user.grade, req.params.chapterId);

    const questions = await getPracticeQuestionsForChapter(req.params.chapterId);
    const chapter = findChapterById(req.params.chapterId);
    const subject = findSubjectByChapterId(req.params.chapterId);

    res.json({
      chapterId: req.params.chapterId,
      chapterName: chapter?.name || req.params.chapterId,
      chapterNo: chapter?.chapterNo,
      subjectId: subject?.id || "",
      subjectName: subject?.name || "",
      questions: questions.map(({ id, question, options }) => ({
        _id: id,
        question,
        options,
      })),
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.post("/practice/:chapterId/submit", protect, async (req, res) => {
  try {
    assertChapterAccess(req.user.grade, req.params.chapterId);

    const { answers, hasDoubt } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }

    const pool = await getPracticeQuestionsForChapter(req.params.chapterId);
    const correct = gradePracticeAnswers(pool, answers);

    let xpEarned = 0;
    let coinsEarned = 0;

    if (!hasDoubt) {
      const user = req.user;
      const lessonKey = req.params.chapterId;
      if (!user.completedLessons.includes(lessonKey)) {
        user.completedLessons.push(lessonKey);
        user.lessonsCompleted += 1;
        xpEarned = 150;
        coinsEarned = 10;
        user.xp += xpEarned;
        user.coins += coinsEarned;
        user.timeSpentMinutes += 8;
        const subject = findSubjectByChapterId(lessonKey);
        if (subject) {
          user.subjectProgress[subject.id] = Math.min(
            (user.subjectProgress[subject.id] || 0) + 12,
            100
          );
        }
        updateStreak(user);
        await user.save();
      }
    }

    res.json({
      correct,
      total: answers.length,
      xpEarned,
      coinsEarned,
      user: req.user,
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.post("/lesson/:chapterId/complete", protect, async (req, res) => {
  try {
    if (!isChapterAllowedForStudent(req.user.grade, req.params.chapterId)) {
      return res.status(403).json({ message: "This chapter is not in your grade syllabus" });
    }

    const user = req.user;
    const lessonKey = req.params.chapterId;
    if (!user.completedLessons.includes(lessonKey)) {
      user.completedLessons.push(lessonKey);
      user.lessonsCompleted += 1;
      user.xp += 30;
      user.coins += 5;
      updateStreak(user);
      await user.save();
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/theory-lab", protect, async (req, res) => {
  const gradeLabel = normalizeStudentGrade(req.user.grade);
  const completed = new Set(req.user.completedLessons || []);

  const subjects = getSubjectsForStudentGrade(req.user.grade).map((subject) => ({
    id: subject.id,
    name: subject.name,
    icon: subject.icon,
    chapters: subject.chapters.map((chapter) => ({
      id: chapter.id,
      chapterNo: chapter.chapterNo,
      name: chapter.name,
      lessons: chapter.lessons,
      completed: completed.has(chapter.id),
    })),
  }));

  res.json({ gradeLabel, subjects });
});

router.get("/board-faq", protect, async (req, res) => {
  const base = getBoardFaqForStudent(req.user);
  const allowedChapterIds = [
    ...new Set(base.subjects.flatMap((subject) => subject.chapters.map((chapter) => chapter.id))),
  ];

  const dbQuestions = await Question.find({
    type: "board-faq",
    chapterId: { $in: allowedChapterIds },
  }).select("question options answer explanation chapterId paperYear");

  const dbPapers = dbQuestions.map((q) => {
    const chapter = findChapterById(q.chapterId);
    const subject = findSubjectByChapterId(q.chapterId);
    const steps = q.explanation.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const year = q.paperYear || "2024";

    return {
      id: q._id.toString(),
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      steps: steps.length ? steps : ["Apply the correct formula and substitute values."],
      chapterId: q.chapterId,
      chapterName: chapter?.name || q.chapterId,
      chapterNo: chapter?.chapterNo,
      subjectId: subject?.id || "",
      subjectName: subject?.name || "",
      paperLabel: `CBSE Board ${year} · ${chapter?.name || "Archive"}`,
      paperYear: year,
    };
  });

  const deduped = [];
  const seenKeys = new Set();
  [...dbPapers, ...base.papers].forEach((paper) => {
    const key = paper.chapterId + paper.question.slice(0, 40);
    if (!seenKeys.has(key)) {
      deduped.push(paper);
      seenKeys.add(key);
    }
  });

  const subjects = base.subjects.map((subject) => ({
    ...subject,
    chapters: subject.chapters.map((chapter) => ({
      ...chapter,
      paperCount: deduped.filter((paper) => paper.chapterId === chapter.id).length,
    })),
  }));

  res.json({
    gradeLabel: base.gradeLabel,
    total: deduped.length,
    papers: deduped,
    subjects,
  });
});

export default router;
