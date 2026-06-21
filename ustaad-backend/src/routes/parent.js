import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import {
  buildSubjectProgressForStudent,
  computeOverallSubjectProgress,
  subjectProgressMap,
  formatStudentGrade,
} from "../utils/subjectProgress.js";
import { buildStudentAnalytics } from "../utils/analytics.js";
import { buildWeeklyTargets, studentLevel, studentTitle } from "../utils/gamification.js";
import { getSkillTracksForUser } from "../data/skills.js";
import { getCareersForUser } from "../data/careers.js";
import { studyLounges } from "../data/studyLounges.js";

const router = express.Router();

const parentOnly = (req, res, next) => {
  if (req.user?.role !== "parent") {
    return res.status(403).json({ message: "Parent access required" });
  }
  next();
};

function formatChildSummary(student) {
  const subjects = buildSubjectProgressForStudent(student);

  return {
    id: student._id,
    name: student.name || "Student",
    phone: student.phone,
    grade: student.grade,
    gradeLabel: formatStudentGrade(student),
    board: student.board,
    xp: student.xp,
    coins: student.coins,
    streak: student.streak,
    level: studentLevel(student.xp),
    title: studentTitle(student.xp, student.lessonsCompleted),
    lessonsCompleted: student.lessonsCompleted,
    timeSpent: `${(student.timeSpentMinutes / 60).toFixed(1)}h`,
    progress: computeOverallSubjectProgress(student),
    onboardingComplete: student.onboardingComplete,
    strengths: student.assessment?.strengths || [],
    weaknesses: student.assessment?.weaknesses || [],
    subjects,
    subjectProgress: subjectProgressMap(student),
    lastActiveDate: student.lastActiveDate,
    joinedLounges: student.joinedGroups?.length || 0,
  };
}

async function getLinkedStudent(parentId, studentId) {
  const parent = await User.findById(parentId);
  if (!parent) return null;

  const isLinked = parent.linkedStudents.some(
    (id) => id.toString() === studentId
  );
  if (!isLinked) return null;

  return User.findById(studentId).select("-otp -otpExpires");
}

async function getLinkedChildren(parentId) {
  const parent = await User.findById(parentId).populate(
    "linkedStudents",
    "-otp -otpExpires -aiChatHistory"
  );
  return (parent.linkedStudents || []).filter(
    (s) => s && s.role !== "admin" && s.role !== "parent"
  );
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const last = new Date(dateStr);
  if (Number.isNaN(last.getTime())) return null;
  return Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
}

router.use(protect, parentOnly);

router.get("/dashboard", async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);
    const students = await getLinkedChildren(req.user._id);
    const children = students.map(formatChildSummary);

    res.json({
      parentName: parent.name,
      children,
      linkedCount: children.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/link", async (req, res) => {
  try {
    const { studentPhone } = req.body;
    if (!studentPhone?.trim()) {
      return res.status(400).json({ message: "Student phone is required" });
    }

    const student = await User.findOne({ phone: studentPhone.trim() });
    if (!student || student.role === "admin" || student.role === "parent") {
      return res.status(404).json({ message: "Student account not found" });
    }

    const parent = await User.findById(req.user._id);
    if (parent.linkedStudents.some((id) => id.toString() === student._id.toString())) {
      return res.status(400).json({ message: "This child is already linked" });
    }

    parent.linkedStudents.push(student._id);
    await parent.save();

    res.json({
      message: "Child linked successfully",
      child: formatChildSummary(student),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/link/:studentId", async (req, res) => {
  try {
    const parent = await User.findById(req.user._id);
    parent.linkedStudents = parent.linkedStudents.filter(
      (id) => id.toString() !== req.params.studentId
    );
    await parent.save();
    res.json({ message: "Child unlinked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const students = await getLinkedChildren(req.user._id);
    const children = students.map((s) => ({
      ...formatChildSummary(s),
      badges: s.badges?.length || 0,
      inactiveDays: daysSince(s.lastActiveDate),
    }));
    res.json({ children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/progress", async (req, res) => {
  try {
    const students = await getLinkedChildren(req.user._id);
    const children = students.map((s) => ({
      id: s._id,
      name: s.name || "Student",
      grade: s.grade,
      gradeLabel: formatStudentGrade(s),
      progress: computeOverallSubjectProgress(s),
      subjects: buildSubjectProgressForStudent(s),
      subjectProgress: subjectProgressMap(s),
      lessonsCompleted: s.lessonsCompleted,
      completedLessons: s.completedLessons?.length || 0,
    }));
    res.json({ children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const allStudents = await User.find({ role: "student" })
      .sort({ xp: -1 })
      .select("xp name");
    const rankMap = {};
    allStudents.forEach((s, i) => {
      rankMap[s._id.toString()] = i + 1;
    });

    const linked = await getLinkedChildren(req.user._id);
    const children = linked.map((s) => ({
      id: s._id,
      name: s.name || "Student",
      xp: s.xp,
      streak: s.streak,
      rank: rankMap[s._id.toString()] || null,
      totalStudents: allStudents.length,
    }));

    res.json({ children, totalStudents: allStudents.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rewards", async (req, res) => {
  try {
    const students = await getLinkedChildren(req.user._id);
    const children = students.map((s) => ({
      id: s._id,
      name: s.name || "Student",
      coins: s.coins,
      badges: s.badges || [],
      redeemedRewards: s.redeemedRewards || [],
    }));
    res.json({ children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/challenges", async (req, res) => {
  try {
    const students = await getLinkedChildren(req.user._id);
    const children = students.map((s) => ({
      id: s._id,
      name: s.name || "Student",
      completedChallenges: s.completedChallenges || [],
      completedCount: s.completedChallenges?.length || 0,
      streak: s.streak,
    }));
    res.json({ children });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const students = await getLinkedChildren(req.user._id);
    const notifications = [];

    for (const s of students) {
      const name = s.name || "Your child";
      const inactiveDays = daysSince(s.lastActiveDate);

      if (!s.onboardingComplete) {
        notifications.push({
          id: `${s._id}-onboarding`,
          type: "warning",
          childId: s._id,
          childName: name,
          message: `${name} hasn't finished onboarding yet.`,
        });
      }

      if (inactiveDays !== null && inactiveDays >= 2) {
        notifications.push({
          id: `${s._id}-inactive`,
          type: "warning",
          childId: s._id,
          childName: name,
          message: `${name} hasn't studied in ${inactiveDays} day${inactiveDays === 1 ? "" : "s"}.`,
        });
      } else if (s.streak === 0 && s.onboardingComplete) {
        notifications.push({
          id: `${s._id}-streak`,
          type: "info",
          childId: s._id,
          childName: name,
          message: `${name}'s study streak has reset. Encourage a quick lesson today!`,
        });
      }

      if (s.streak >= 7) {
        notifications.push({
          id: `${s._id}-streak-win`,
          type: "success",
          childId: s._id,
          childName: name,
          message: `${name} is on a ${s.streak}-day streak — great consistency!`,
        });
      }

      const avgProgress = formatChildSummary(s).progress;
      if (avgProgress >= 75) {
        notifications.push({
          id: `${s._id}-progress`,
          type: "success",
          childId: s._id,
          childName: name,
          message: `${name} reached ${avgProgress}% overall progress.`,
        });
      }
    }

    if (students.length === 0) {
      notifications.push({
        id: "no-children",
        type: "info",
        message: "Link your child's account to receive progress alerts.",
      });
    }

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/profile", async (req, res) => {
  try {
    const { name } = req.body;
    const parent = await User.findById(req.user._id);
    if (name?.trim()) parent.name = name.trim();
    await parent.save();
    res.json({ name: parent.name, phone: parent.phone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/child/:studentId", async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user._id, req.params.studentId);

    if (!student) {
      return res.status(403).json({ message: "This child is not linked to your account" });
    }

    res.json({
      ...formatChildSummary(student),
      completedLessons: student.completedLessons,
      badges: student.badges,
      assessment: student.assessment,
      personalPlan: student.personalPlan,
      redeemedRewards: student.redeemedRewards,
      subjectsSelected: student.subjects || [],
      goals: student.goals || [],
      aiMessages: student.aiChatHistory?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/child/:studentId/analytics", async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user._id, req.params.studentId);
    if (!student) {
      return res.status(403).json({ message: "This child is not linked to your account" });
    }

    res.json({
      studentName: student.name || "Student",
      ...buildStudentAnalytics(student),
      level: studentLevel(student.xp),
      title: studentTitle(student.xp, student.lessonsCompleted),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/child/:studentId/weekly-targets", async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user._id, req.params.studentId);
    if (!student) {
      return res.status(403).json({ message: "This child is not linked to your account" });
    }

    res.json({
      studentName: student.name || "Student",
      ...buildWeeklyTargets(student),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/child/:studentId/skills", async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user._id, req.params.studentId);
    if (!student) {
      return res.status(403).json({ message: "This child is not linked to your account" });
    }

    const careers = getCareersForUser(student)
      .filter((c) => c.recommended)
      .slice(0, 3);

    res.json({
      studentName: student.name || "Student",
      tracks: getSkillTracksForUser(student),
      topCareers: careers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/child/:studentId/community", async (req, res) => {
  try {
    const student = await getLinkedStudent(req.user._id, req.params.studentId);
    if (!student) {
      return res.status(403).json({ message: "This child is not linked to your account" });
    }

    const joined = studyLounges.filter((lounge) =>
      (student.joinedGroups || []).includes(lounge.id)
    );

    res.json({
      studentName: student.name || "Student",
      joinedLounges: joined,
      totalJoined: joined.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const students = await getLinkedChildren(req.user._id);
    const reports = students.map((student) => {
      const analytics = buildStudentAnalytics(student);
      const targets = buildWeeklyTargets(student);
      const completedTargets = targets.targets.filter((t) => t.complete).length;

      return {
        id: student._id,
        name: student.name || "Student",
        gradeLabel: formatStudentGrade(student),
        progress: analytics.progress,
        lessonsDone: analytics.lessonsDone,
        timeSpent: analytics.timeSpent,
        streak: analytics.streak,
        xp: analytics.xp,
        avgScore: analytics.avgScore,
        level: studentLevel(student.xp),
        weeklyTargetsComplete: completedTargets,
        weeklyTargetsTotal: targets.targets.length,
      };
    });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
