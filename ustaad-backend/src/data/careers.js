import { getSubjectsForStudentGrade } from "./syllabus.js";
import { getCareersData } from "../services/skillCareerService.js";

const SUBJECT_PROFILE_NAMES = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "mathematics-12": "Mathematics",
  "physics-12": "Physics",
  "biology-12": "Biology",
};

function relevantSubjectIds(user, career) {
  const gradeSubjectIds = getSubjectsForStudentGrade(user.grade).map((subject) => subject.id);
  return career.relatedSubjects.filter((id) => gradeSubjectIds.includes(id));
}

export function findCareerById(careerId) {
  return getCareersData().find((career) => career.id === careerId);
}

export function scoreCareerMatch(user, career) {
  const subjectIds = relevantSubjectIds(user, career);
  const progressScores = subjectIds.map((id) => user.subjectProgress?.[id] || 0);
  const progressAvg = progressScores.length
    ? progressScores.reduce((sum, value) => sum + value, 0) / progressScores.length
    : 0;

  let profileBonus = 0;
  if (user.subjects?.length && subjectIds.length) {
    const overlap = subjectIds.filter((id) =>
      user.subjects.includes(SUBJECT_PROFILE_NAMES[id])
    ).length;
    profileBonus = Math.min(overlap * 8, 24);
  }

  let assessmentBonus = 0;
  const assessmentScores = user.assessment?.subjectScores || {};
  const assessmentValues = subjectIds
    .map((id) => assessmentScores[id])
    .filter((value) => value != null);
  if (assessmentValues.length) {
    assessmentBonus =
      assessmentValues.reduce((sum, value) => sum + value, 0) / assessmentValues.length / 5;
  }

  const streamBonus =
    (career.stream === "PCB" &&
      user.subjects?.some((s) => ["Biology", "Chemistry"].includes(s))) ||
    (career.stream === "PCM" &&
      user.subjects?.some((s) => ["Mathematics", "Physics"].includes(s)))
      ? 10
      : 0;

  const raw = progressAvg * 0.5 + profileBonus + assessmentBonus + streamBonus;
  const matchScore = Math.min(Math.round(raw), 100);

  if (progressAvg > 0 || profileBonus > 0 || assessmentBonus > 0 || streamBonus > 0) {
    return Math.max(matchScore, 30);
  }

  return 25;
}

export function getCareersForUser(user) {
  const careers = getCareersData();
  return careers
    .map((career) => ({
      id: career.id,
      name: career.name,
      icon: career.icon,
      stream: career.stream,
      demand: career.demand,
      description: career.description,
      matchScore: scoreCareerMatch(user, career),
      recommended: false,
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((career, index) => ({
      ...career,
      recommended: index < 3,
    }));
}

export function getCareerDetailForUser(user, careerId) {
  const career = findCareerById(careerId);
  if (!career) return null;

  const subjectIds = relevantSubjectIds(user, career);
  const subjectProgress = subjectIds.map((id) => ({
    subjectId: id,
    name: SUBJECT_PROFILE_NAMES[id] || id,
    progress: user.subjectProgress?.[id] || 0,
  }));

  const uniqueByName = subjectProgress.filter(
    (item, index, arr) => arr.findIndex((x) => x.name === item.name) === index
  );

  return {
    id: career.id,
    name: career.name,
    icon: career.icon,
    stream: career.stream,
    skills: career.skills,
    salary: career.salary,
    demand: career.demand,
    path: career.path,
    description: career.description,
    matchScore: scoreCareerMatch(user, career),
    subjectProgress: uniqueByName,
  };
}
