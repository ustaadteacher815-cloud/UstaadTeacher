import Question from "../models/Question.js";
import { findChapterById, isChapterAllowedForStudent } from "../data/syllabus.js";
import { boardPapers } from "../data/boardFaq.js";

function faqToQuestion(paper, index) {
  return {
    id: `faq-${paper.chapterId}-${index}`,
    question: paper.question,
    options: paper.options,
    answer: paper.answer,
    explanation: paper.explanation,
    source: "board-faq",
  };
}

function genericChapterQuestion(chapterId) {
  const chapter = findChapterById(chapterId);
  const name = chapter?.name || "this chapter";

  return {
    id: `generic-${chapterId}`,
    question: `Which topic is covered in the CBSE chapter "${name}"?`,
    options: [name, "Unrelated topic", "General knowledge", "None of these"],
    answer: 0,
    explanation: `This quest focuses on ${name} from your syllabus.`,
    source: "generic",
  };
}

export async function getPracticeQuestionsForChapter(chapterId) {
  const dbQuestions = await Question.find({
    type: "practice",
    chapterId,
  });

  const dbMapped = dbQuestions.map((q) => ({
    id: q._id.toString(),
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation || "",
    source: "database",
  }));

  if (dbMapped.length > 0) {
    return dbMapped;
  }

  const faqMapped = boardPapers
    .filter((paper) => paper.chapterId === chapterId)
    .map((paper, index) => faqToQuestion(paper, index));

  const merged = [...dbMapped];
  const seen = new Set(dbMapped.map((q) => q.question));

  faqMapped.forEach((q) => {
    if (!seen.has(q.question)) {
      merged.push(q);
      seen.add(q.question);
    }
  });

  if (merged.length === 0) {
    merged.push(genericChapterQuestion(chapterId));
  }

  return merged.slice(0, 5);
}

export function findPracticeQuestion(pool, questionId) {
  return pool.find((q) => q.id === questionId);
}

export function gradePracticeAnswers(pool, answers) {
  let correct = 0;

  answers.forEach(({ questionId, selected }) => {
    const q = findPracticeQuestion(pool, questionId);
    if (q && q.answer === selected) correct += 1;
  });

  return correct;
}

export function assertChapterAccess(userGrade, chapterId) {
  if (!isChapterAllowedForStudent(userGrade, chapterId)) {
    const error = new Error("This chapter is not in your grade syllabus");
    error.status = 403;
    throw error;
  }
}
