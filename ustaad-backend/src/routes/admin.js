import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import StudyLoungeMessage from "../models/StudyLoungeMessage.js";
import { subjects } from "../data/syllabus.js";
import { studyLounges } from "../data/studyLounges.js";
import { getSkillTracksForUser } from "../data/skills.js";
import { getCareersForUser } from "../data/careers.js";
import {
  getSkillTracksData,
  getCareersData,
  listSkillTracksForAdmin,
  listCareersForAdmin,
  createSkillTrack,
  updateSkillTrack,
  deleteSkillTrack,
  createCareer,
  updateCareer,
  deleteCareer,
} from "../services/skillCareerService.js";
import { buildStudentAnalytics } from "../utils/analytics.js";
import { buildWeeklyTargets, studentLevel, studentTitle } from "../utils/gamification.js";
import { boardPapers } from "../data/boardFaq.js";
import { findChapterById, findSubjectByChapterId } from "../data/syllabus.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", async (_req, res) => {
  try {
    const studentFilter = { role: { $nin: ["admin", "parent"] } };

    const [
      totalStudents,
      onboardedStudents,
      activeToday,
      totalQuestions,
      questionsByType,
      xpAgg,
      recentSignups,
    ] = await Promise.all([
      User.countDocuments(studentFilter),
      User.countDocuments({ ...studentFilter, onboardingComplete: true }),
      User.countDocuments({
        ...studentFilter,
        lastActiveDate: new Date().toISOString().slice(0, 10),
      }),
      Question.countDocuments(),
      Question.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: studentFilter },
        { $group: { _id: null, xp: { $sum: "$xp" }, coins: { $sum: "$coins" } } },
      ]),
      User.find(studentFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name phone grade createdAt onboardingComplete"),
    ]);

    const typeCounts = { assessment: 0, daily: 0, practice: 0, "board-faq": 0 };
    questionsByType.forEach((item) => {
      typeCounts[item._id] = item.count;
    });

    res.json({
      totalStudents,
      onboardedStudents,
      activeToday,
      totalQuestions,
      questionTypes: typeCounts,
      totalXp: xpAgg[0]?.xp || 0,
      totalCoins: xpAgg[0]?.coins || 0,
      recentSignups,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 15 } = req.query;
    const filter = { role: { $ne: "admin" } };

    if (search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        { phone: { $regex: term, $options: "i" } },
        { grade: { $regex: term, $options: "i" } },
        { board: { $regex: term, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-otp -otpExpires -aiChatHistory"),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-otp -otpExpires");
    if (!user || user.role === "admin") {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id/analytics", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-otp -otpExpires");
    if (!user || user.role === "admin") {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      ...buildStudentAnalytics(user),
      level: studentLevel(user.xp),
      title: studentTitle(user.xp, user.lessonsCompleted),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id/weekly-targets", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-otp -otpExpires");
    if (!user || user.role === "admin") {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(buildWeeklyTargets(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users/:id/skills", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-otp -otpExpires");
    if (!user || user.role === "admin") {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      tracks: getSkillTracksForUser(user),
      topCareers: getCareersForUser(user).slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/parents", async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" })
      .sort({ createdAt: -1 })
      .select("name phone linkedStudents createdAt")
      .populate("linkedStudents", "name phone grade xp streak onboardingComplete");

    res.json(
      parents.map((parent) => ({
        id: parent._id,
        name: parent.name || "Parent",
        phone: parent.phone,
        linkedCount: parent.linkedStudents?.length || 0,
        children: (parent.linkedStudents || []).map((child) => ({
          id: child._id,
          name: child.name || "Student",
          phone: child.phone,
          grade: child.grade,
          xp: child.xp,
          streak: child.streak,
          onboardingComplete: child.onboardingComplete,
        })),
        createdAt: parent.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/skills/overview", async (_req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "completedSkillLessons xp lessonsCompleted"
    );

    const tracks = getSkillTracksData().map((track) => {
      const activeStudents = students.filter((s) =>
        (s.completedSkillLessons || []).some((id) => id.startsWith(`${track.id}-`))
      ).length;
      return {
        id: track.id,
        name: track.name,
        icon: track.icon,
        description: track.description,
        lessonCount: track.lessonCount,
        relatedSubjects: track.relatedSubjects,
        relatedCareers: track.relatedCareers,
        activeStudents,
      };
    });

    res.json({ tracks, totalTracks: tracks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/skills", async (_req, res) => {
  try {
    const tracks = await listSkillTracksForAdmin();
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/skills", async (req, res) => {
  try {
    const created = await createSkillTrack(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(error.message.includes("already exists") ? 400 : 500).json({ message: error.message });
  }
});

router.put("/skills/:id", async (req, res) => {
  try {
    const updated = await updateSkillTrack(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({ message: error.message });
  }
});

router.delete("/skills/:id", async (req, res) => {
  try {
    await deleteSkillTrack(req.params.id);
    res.json({ message: "Skill track deleted" });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({ message: error.message });
  }
});

router.get("/careers/overview", async (_req, res) => {
  try {
    const careers = getCareersData();
    res.json({
      careers: careers.map((career) => ({
        id: career.id,
        name: career.name,
        icon: career.icon,
        stream: career.stream,
        demand: career.demand,
        salary: career.salary,
        description: career.description,
        skills: career.skills,
        path: career.path,
        relatedSubjects: career.relatedSubjects,
      })),
      totalCareers: careers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/careers", async (_req, res) => {
  try {
    const careerDocs = await listCareersForAdmin();
    res.json(careerDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/careers", async (req, res) => {
  try {
    const created = await createCareer(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(error.message.includes("already exists") ? 400 : 500).json({ message: error.message });
  }
});

router.put("/careers/:id", async (req, res) => {
  try {
    const updated = await updateCareer(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({ message: error.message });
  }
});

router.delete("/careers/:id", async (req, res) => {
  try {
    await deleteCareer(req.params.id);
    res.json({ message: "Career deleted" });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : 500).json({ message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === "admin") {
      return res.status(404).json({ message: "Student not found" });
    }

    const { name, grade, board, xp, coins, streak, isActive, onboardingComplete } =
      req.body;

    if (name !== undefined) user.name = name;
    if (grade !== undefined) user.grade = grade;
    if (board !== undefined) user.board = board;
    if (xp !== undefined) user.xp = Number(xp);
    if (coins !== undefined) user.coins = Number(coins);
    if (streak !== undefined) user.streak = Number(streak);
    if (isActive !== undefined) user.isActive = Boolean(isActive);
    if (onboardingComplete !== undefined) {
      user.onboardingComplete = Boolean(onboardingComplete);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const { type, search = "", chapterId = "" } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (chapterId.trim()) filter.chapterId = chapterId.trim();
    if (search.trim()) {
      filter.question = { $regex: search.trim(), $options: "i" };
    }

    const questions = await Question.find(filter).sort({ type: 1, createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/questions", async (req, res) => {
  try {
    const { type, subject, chapterId, question, options, answer, explanation, paperYear } =
      req.body;

    if (!type || !question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Invalid question data" });
    }

    const created = await Question.create({
      type,
      subject: subject || "general",
      chapterId: chapterId || "",
      question,
      options,
      answer: Number(answer),
      explanation: explanation || "",
      paperYear: paperYear || "",
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/questions/:id", async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/questions/:id", async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/content/overview", async (_req, res) => {
  const totalChapters = subjects.reduce((sum, s) => sum + s.chapters.length, 0);

  res.json({
    subjects: subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      chapters: subject.chapters.length,
      grade: subject.grade || "",
      board: subject.board || "",
    })),
    totalChapters,
    boardFaqPapers: boardPapers.length,
    studyLounges: studyLounges.map((lounge) => ({
      id: lounge.id,
      name: lounge.name,
      type: lounge.type,
    })),
    rewards: [
      { id: "dominos", name: "Food Coupon — Domino's", cost: 200 },
      { id: "amazon", name: "Amazon Discount Voucher", cost: 500 },
      { id: "premium", name: "Ustaad Premium (1 Month)", cost: 800 },
      { id: "scholarship", name: "Scholarship Entry Token", cost: 1000 },
    ],
  });
});

router.get("/learning/theory-lab", async (_req, res) => {
  try {
    const byGrade = [
      { grade: "11", gradeLabel: "Class 11", syllabusGrade: "Class 11" },
      { grade: "12", gradeLabel: "Class 12", syllabusGrade: "Class 12" },
    ].map(({ grade, gradeLabel, syllabusGrade }) => ({
      grade,
      gradeLabel,
      subjects: subjects
        .filter((s) => s.grade === syllabusGrade)
        .map((subject) => ({
          id: subject.id,
          name: subject.name,
          icon: subject.icon,
          chapterCount: subject.chapters.length,
          lessonCount: subject.chapters.reduce((sum, ch) => sum + (ch.lessons || 0), 0),
          chapters: subject.chapters.map((ch) => ({
            id: ch.id,
            chapterNo: ch.chapterNo,
            name: ch.name,
            lessons: ch.lessons,
          })),
        })),
    }));

    const practiceCount = await Question.countDocuments({ type: "practice" });

    res.json({
      grades: byGrade,
      totalSubjects: subjects.length,
      totalChapters: subjects.reduce((sum, s) => sum + s.chapters.length, 0),
      practiceQuestions: practiceCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/learning/board-faq", async (_req, res) => {
  try {
    const staticPapers = boardPapers.map((paper, index) => {
      const chapter = findChapterById(paper.chapterId);
      const subject = findSubjectByChapterId(paper.chapterId);
      return {
        id: `static-${index}`,
        chapterId: paper.chapterId,
        chapterName: chapter?.name || paper.chapterId,
        subjectName: subject?.name || "—",
        grade: subject?.grade || "—",
        paperYear: paper.paperYear,
        questionPreview: paper.question.slice(0, 120),
        source: "static",
      };
    });

    const dbQuestions = await Question.find({ type: "board-faq" }).sort({ createdAt: -1 });
    const dbPapers = dbQuestions.map((q) => {
      const chapter = findChapterById(q.chapterId);
      const subject = findSubjectByChapterId(q.chapterId);
      return {
        id: q._id.toString(),
        chapterId: q.chapterId,
        chapterName: chapter?.name || q.chapterId,
        subjectName: subject?.name || "—",
        grade: subject?.grade || "—",
        paperYear: q.paperYear || "2024",
        questionPreview: q.question.slice(0, 120),
        source: "admin",
      };
    });

    const papers = [...dbPapers, ...staticPapers];

    const bySubject = {};
    papers.forEach((paper) => {
      bySubject[paper.subjectName] = (bySubject[paper.subjectName] || 0) + 1;
    });

    res.json({
      totalPapers: papers.length,
      adminPapers: dbPapers.length,
      staticPapers: staticPapers.length,
      bySubject: Object.entries(bySubject).map(([name, count]) => ({ name, count })),
      papers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/weekly-targets/overview", async (_req, res) => {
  try {
    const students = await User.find({
      role: "student",
      onboardingComplete: true,
    }).select("name grade lessonsCompleted completedChallenges xp streak");

    const targetIds = ["quests", "challenges", "xp", "streak"];
    const completionCounts = Object.fromEntries(targetIds.map((id) => [id, 0]));

    students.forEach((student) => {
      const weekly = buildWeeklyTargets(student);
      weekly.targets.forEach((target) => {
        if (target.complete) completionCounts[target.id] += 1;
      });
    });

    res.json({
      studentCount: students.length,
      weekLabel: "Weekly CBSE Targets",
      targets: targetIds.map((id) => {
        const sample = buildWeeklyTargets(students[0] || {});
        const meta = sample.targets.find((t) => t.id === id) || {};
        return {
          id,
          label: meta.label || id,
          icon: meta.icon || "🎯",
          goal: meta.goal || 0,
          studentsCompleted: completionCounts[id],
          completionRate: students.length
            ? Math.round((completionCounts[id] / students.length) * 100)
            : 0,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/streak/overview", async (_req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "name phone grade streak lastActiveDate xp"
    );

    const distribution = {
      inactive: 0,
      building: 0,
      weekPlus: 0,
      monthPlus: 0,
    };

    students.forEach((s) => {
      const streak = s.streak || 0;
      if (streak === 0) distribution.inactive += 1;
      else if (streak < 7) distribution.building += 1;
      else if (streak < 30) distribution.weekPlus += 1;
      else distribution.monthPlus += 1;
    });

    const topStreaks = [...students]
      .sort((a, b) => (b.streak || 0) - (a.streak || 0))
      .slice(0, 10)
      .map((s) => ({
        id: s._id,
        name: s.name || "Student",
        phone: s.phone,
        grade: s.grade,
        streak: s.streak || 0,
        lastActiveDate: s.lastActiveDate,
      }));

    const avgStreak = students.length
      ? Math.round(students.reduce((sum, s) => sum + (s.streak || 0), 0) / students.length)
      : 0;

    res.json({
      totalStudents: students.length,
      avgStreak,
      distribution,
      topStreaks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const rewardsCatalog = [
  { id: "dominos", name: "Food Coupon — Domino's", cost: 200, icon: "🍕" },
  { id: "amazon", name: "Amazon Discount Voucher", cost: 500, icon: "🛒" },
  { id: "premium", name: "Ustaad Premium (1 Month)", cost: 800, icon: "⭐" },
  { id: "scholarship", name: "Scholarship Entry Token", cost: 1000, icon: "🎓" },
];

const communityCatalog = [
  { id: "cbse12", name: "CBSE Class 12 Study Group", type: "Group" },
  { id: "math-battle", name: "Math Battle Arena", type: "Subject Battle" },
  { id: "physics-room", name: "Physics Study Room", type: "Study Room" },
  { id: "team-quiz", name: "Team Challenge: Weekly Quiz", type: "Team Challenge" },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

router.get("/analytics", async (_req, res) => {
  try {
    const studentFilter = { role: { $nin: ["admin", "parent"] } };
    const today = todayKey();

    const [
      gradeBreakdown,
      boardBreakdown,
      lessonAgg,
      streakAgg,
      challengesToday,
      onboardingPending,
    ] = await Promise.all([
      User.aggregate([
        { $match: { ...studentFilter, grade: { $ne: "" } } },
        { $group: { _id: "$grade", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { ...studentFilter, board: { $ne: "" } } },
        { $group: { _id: "$board", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.aggregate([
        { $match: studentFilter },
        {
          $group: {
            _id: null,
            lessons: { $sum: "$lessonsCompleted" },
            timeSpent: { $sum: "$timeSpentMinutes" },
          },
        },
      ]),
      User.aggregate([
        { $match: studentFilter },
        { $group: { _id: null, avgStreak: { $avg: "$streak" } } },
      ]),
      User.countDocuments({
        ...studentFilter,
        completedChallenges: today,
      }),
      User.countDocuments({ ...studentFilter, onboardingComplete: false }),
    ]);

    res.json({
      gradeBreakdown: gradeBreakdown.map((g) => ({
        label: g._id || "Unknown",
        count: g.count,
      })),
      boardBreakdown: boardBreakdown.map((b) => ({
        label: b._id || "Unknown",
        count: b.count,
      })),
      totalLessonsCompleted: lessonAgg[0]?.lessons || 0,
      totalTimeSpentMinutes: lessonAgg[0]?.timeSpent || 0,
      avgStreak: Math.round(streakAgg[0]?.avgStreak || 0),
      challengesCompletedToday: challengesToday,
      onboardingPending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/challenges", async (_req, res) => {
  try {
    const today = todayKey();
    const [dailyQuestions, completionsToday] = await Promise.all([
      Question.find({ type: "daily" }).sort({ createdAt: -1 }),
      User.countDocuments({
        role: { $ne: "admin" },
        completedChallenges: today,
      }),
    ]);

    res.json({ dailyQuestions, completionsToday, today });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/leaderboard", async (_req, res) => {
  try {
    const users = await User.find({ role: "student", onboardingComplete: true })
      .sort({ xp: -1 })
      .limit(25)
      .select("name phone grade board xp coins streak lessonsCompleted isActive");

    res.json(
      users.map((user, index) => ({
        rank: index + 1,
        id: user._id,
        name: user.name || "Student",
        phone: user.phone,
        grade: user.grade,
        board: user.board,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
        lessonsCompleted: user.lessonsCompleted,
        isActive: user.isActive !== false,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rewards", async (_req, res) => {
  try {
    const students = await User.find({ role: { $ne: "admin" } }).select(
      "redeemedRewards coins"
    );

    const rewards = rewardsCatalog.map((reward) => {
      const redemptions = students.filter((s) =>
        s.redeemedRewards.includes(reward.id)
      ).length;
      return { ...reward, redemptions };
    });

    const totalRedemptions = students.reduce(
      (sum, s) => sum + s.redeemedRewards.length,
      0
    );
    const totalCoins = students.reduce((sum, s) => sum + s.coins, 0);

    res.json({ rewards, totalRedemptions, totalCoinsInCirculation: totalCoins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/community", async (_req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "joinedGroups name"
    );

    const messageCounts = await StudyLoungeMessage.aggregate([
      { $group: { _id: "$loungeId", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      messageCounts.map((item) => [item._id, item.count])
    );

    const lounges = studyLounges.map((lounge) => {
      const members = students.filter((s) =>
        (s.joinedGroups || []).includes(lounge.id)
      );
      return {
        id: lounge.id,
        name: lounge.name,
        type: lounge.type,
        topic: lounge.topic,
        icon: lounge.icon,
        memberCount: members.length,
        messageCount: countMap[lounge.id] || 0,
        members: members.slice(0, 5).map((s) => s.name || "Student"),
      };
    });

    const totalMessages = messageCounts.reduce((sum, item) => sum + item.count, 0);

    res.json({
      lounges,
      totalMemberships: students.reduce(
        (sum, s) => sum + (s.joinedGroups?.length || 0),
        0
      ),
      totalMessages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/community/:loungeId/messages", async (req, res) => {
  try {
    const lounge = studyLounges.find((l) => l.id === req.params.loungeId);
    if (!lounge) {
      return res.status(404).json({ message: "Study lounge not found" });
    }

    const messages = await StudyLoungeMessage.find({ loungeId: req.params.loungeId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("userName text createdAt loungeId");

    res.json({ lounge, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/ai-insights", async (_req, res) => {
  try {
    const students = await User.find({
      role: { $ne: "admin" },
      "aiChatHistory.0": { $exists: true },
    })
      .select("name phone grade aiChatHistory")
      .limit(30);

    const recentMessages = [];
    students.forEach((student) => {
      const history = student.aiChatHistory || [];
      history.slice(-4).forEach((msg) => {
        recentMessages.push({
          student: student.name || "Student",
          phone: student.phone,
          grade: student.grade,
          role: msg.role,
          text: msg.text,
          createdAt: msg.createdAt,
        });
      });
    });

    recentMessages.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    res.json({
      activeChatUsers: students.length,
      recentMessages: recentMessages.slice(0, 40),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admins", async (_req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .sort({ createdAt: -1 })
      .select("name phone createdAt isActive");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
