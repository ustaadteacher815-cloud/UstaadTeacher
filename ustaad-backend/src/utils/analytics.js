import { getSubjectsForStudentGrade, subjects, findSubjectByChapterId } from "../data/syllabus.js";

const SUBJECT_NAMES = Object.fromEntries(
  subjects.map((subject) => [subject.id, `${subject.name} · ${subject.grade}`])
);

function topicLabel(subjectId) {
  return SUBJECT_NAMES[subjectId] || subjectId;
}

function resolveSubjectId(question) {
  if (question.subject && question.subject !== "general") {
    return question.subject;
  }

  if (question.chapterId) {
    const subject = findSubjectByChapterId(question.chapterId);
    if (subject) return subject.id;
  }

  const text = question.question.toLowerCase();
  if (/sin|cos|tan|matrix|algebra|probability|set\b/.test(text)) return "mathematics";
  if (/newton|force|motion|energy|volt|current|physics/.test(text)) return "physics";
  if (/water|atom|chemical|molecule|organic|h₂o/.test(text)) return "chemistry";
  if (/cell|biology|organ|dna|reproduction/.test(text)) return "biology";

  return "general";
}

function buildSubjectScores(user) {
  const gradeSubjects = getSubjectsForStudentGrade(user.grade);
  const assessmentScores = user.assessment?.subjectScores || {};

  return gradeSubjects.map((subject) => {
    let score = user.subjectProgress?.[subject.id] || 0;

    const completedInSubject = (user.completedLessons || []).filter((lessonId) =>
      subject.chapters.some((ch) => ch.id === lessonId)
    ).length;

    if (completedInSubject > 0 && score === 0) {
      score = Math.min(completedInSubject * 12, 100);
    }

    if (score === 0 && assessmentScores[subject.id] != null) {
      score = assessmentScores[subject.id];
    }

    return {
      id: subject.id,
      topic: `${subject.name} · ${subject.grade}`,
      score,
    };
  });
}

export function deriveAssessmentInsights(questions, answers) {
  const bySubject = {};

  answers.forEach(({ questionId, selected }) => {
    const question = questions.find((item) => item._id.toString() === questionId);
    if (!question) return;

    const subjectId = resolveSubjectId(question);
    if (!bySubject[subjectId]) {
      bySubject[subjectId] = { correct: 0, total: 0 };
    }

    bySubject[subjectId].total += 1;
    if (question.answer === selected) {
      bySubject[subjectId].correct += 1;
    }
  });

  const subjectScores = {};
  const scored = Object.entries(bySubject)
    .filter(([subjectId]) => subjectId !== "general")
    .map(([subjectId, stats]) => {
      const score = Math.round((stats.correct / stats.total) * 100);
      subjectScores[subjectId] = score;
      return { subjectId, topic: topicLabel(subjectId), score };
    })
    .sort((a, b) => b.score - a.score);

  const strengths = scored
    .filter((item) => item.score >= 50)
    .slice(0, 4)
    .map(({ topic, score }) => ({ topic, score }));

  const weaknesses = [...scored]
    .reverse()
    .filter((item) => item.score < 70)
    .slice(0, 4)
    .map(({ topic, score }) => ({ topic, score }));

  return { strengths, weaknesses, subjectScores };
}

export function buildStudentAnalytics(user) {
  const subjectScores = buildSubjectScores(user);
  const withProgress = subjectScores.filter((s) => s.score > 0);
  const sorted = [...withProgress].sort((a, b) => b.score - a.score);

  const progressValues = subjectScores.map((s) => s.score);
  const avgProgress = progressValues.length
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0;

  const assessmentScore = user.assessment?.total
    ? Math.round((user.assessment.score / user.assessment.total) * 100)
    : null;

  const avgScore =
    assessmentScore ??
    (withProgress.length
      ? Math.round(withProgress.reduce((a, b) => a + b.score, 0) / withProgress.length)
      : 0);

  const strengths = sorted
    .filter((s) => s.score >= 35)
    .slice(0, 4)
    .map(({ topic, score }) => ({ topic, score }));

  const weaknesses = [...sorted]
    .reverse()
    .filter((s) => s.score > 0 && s.score < 55)
    .slice(0, 4)
    .map(({ topic, score }) => ({ topic, score }));

  return {
    progress:
      avgProgress ||
      (user.lessonsCompleted > 0 ? Math.min(user.lessonsCompleted * 6, 100) : 0),
    timeSpent: `${((user.timeSpentMinutes || 0) / 60).toFixed(1)}h`,
    lessonsDone: user.lessonsCompleted || 0,
    avgScore,
    streak: user.streak || 0,
    xp: user.xp || 0,
    challengesDone: user.completedChallenges?.length || 0,
    strengths,
    weaknesses,
    subjectBreakdown: subjectScores.map(({ topic, score }) => ({ topic, score })),
  };
}
