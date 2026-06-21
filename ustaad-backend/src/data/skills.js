import { getSubjectsForStudentGrade } from "./syllabus.js";
import { getCareersForUser } from "./careers.js";
import { getSkillTracksData } from "../services/skillCareerService.js";

function completedInTrack(user, track) {
  return (user.completedSkillLessons || []).filter((lessonId) =>
    lessonId.startsWith(`${track.id}-`)
  ).length;
}

function subjectProgressForTrack(user, track) {
  const gradeSubjectIds = getSubjectsForStudentGrade(user.grade).map((s) => s.id);
  const relevantIds = track.relatedSubjects.filter((id) => gradeSubjectIds.includes(id));

  if (!relevantIds.length) return 0;

  const scores = relevantIds.map((id) => user.subjectProgress?.[id] || 0);
  return scores.reduce((sum, value) => sum + value, 0) / scores.length;
}

function computeTrackProgress(user, track) {
  const completed = completedInTrack(user, track);

  if (completed > 0) {
    return Math.min(Math.round((completed / track.lessonCount) * 100), 100);
  }

  const subjectAvg = subjectProgressForTrack(user, track);
  if (subjectAvg > 0) {
    return Math.min(Math.round(subjectAvg * 0.4), 100);
  }

  if (track.id === "communication" && user.lessonsCompleted > 0) {
    return Math.min(user.lessonsCompleted * 5, 100);
  }

  if (track.id === "entrepreneurship") {
    const challengeBoost = (user.completedChallenges?.length || 0) * 12;
    const xpBoost = Math.min(Math.floor((user.xp || 0) / 100), 30);
    return Math.min(challengeBoost + xpBoost, 100);
  }

  return 0;
}

export function getSkillTracksForUser(user) {
  const skillTracks = getSkillTracksData();
  const topCareerIds = getCareersForUser(user)
    .filter((career) => career.recommended)
    .map((career) => career.id);

  return skillTracks
    .map((track) => {
      const completedLessons = completedInTrack(user, track);
      const recommended = track.relatedCareers.some((id) => topCareerIds.includes(id));

      return {
        id: track.id,
        name: track.name,
        icon: track.icon,
        description: track.description,
        lessons: track.lessonCount,
        completedLessons,
        progress: computeTrackProgress(user, track),
        recommended,
      };
    })
    .sort((a, b) => {
      if (a.recommended !== b.recommended) return Number(b.recommended) - Number(a.recommended);
      return b.progress - a.progress;
    });
}

export function findSkillTrack(trackId) {
  return getSkillTracksData().find((track) => track.id === trackId);
}

export function completeSkillLesson(user, trackId, lessonId) {
  const track = findSkillTrack(trackId);
  if (!track) return null;

  const expectedPrefix = `${trackId}-`;
  if (!lessonId.startsWith(expectedPrefix)) {
    return null;
  }

  const lessonNumber = parseInt(lessonId.slice(expectedPrefix.length), 10);
  if (!lessonNumber || lessonNumber < 1 || lessonNumber > track.lessonCount) {
    return null;
  }

  if (!user.completedSkillLessons) {
    user.completedSkillLessons = [];
  }

  if (!user.completedSkillLessons.includes(lessonId)) {
    user.completedSkillLessons.push(lessonId);
    user.xp += 15;
    user.coins += 5;
  }

  return {
    id: track.id,
    name: track.name,
    progress: computeTrackProgress(user, track),
    completedLessons: completedInTrack(user, track),
  };
}
