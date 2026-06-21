import { getSubjectsForStudentGrade, normalizeStudentGrade } from "../data/syllabus.js";

export function buildSubjectProgressForStudent(user) {
  const subjects = getSubjectsForStudentGrade(user.grade);

  return subjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    icon: subject.icon,
    grade: subject.grade,
    progress: user.subjectProgress?.[subject.id] || 0,
  }));
}

export function computeOverallSubjectProgress(user) {
  const subjects = buildSubjectProgressForStudent(user);

  if (!subjects.length) {
    return user.lessonsCompleted > 0 ? Math.min(user.lessonsCompleted * 6, 100) : 0;
  }

  const total = subjects.reduce((sum, subject) => sum + subject.progress, 0);
  return Math.round(total / subjects.length);
}

export function subjectProgressMap(user) {
  return Object.fromEntries(
    buildSubjectProgressForStudent(user).map((subject) => [subject.id, subject.progress])
  );
}

export function formatStudentGrade(user) {
  return normalizeStudentGrade(user.grade);
}
