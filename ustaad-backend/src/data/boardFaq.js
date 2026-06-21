import { getSubjectsForStudentGrade, normalizeStudentGrade } from "./syllabus.js";

export const boardPapers = [
  // Class 12 Mathematics
  {
    chapterId: "c12-relations-and-functions",
    question:
      "Let A = {1, 2, 3} and B = {2, 3, 4}. Find A ∪ B and A ∩ B.",
    options: ["{1,2,3,4} and {2,3}", "{2,3} and {1,2,3,4}", "{1,4} and {2}", "{1,2,3} and {4}"],
    answer: 0,
    explanation:
      "List elements of set A: {1, 2, 3}.\nList elements of set B: {2, 3, 4}.\nUnion A ∪ B = all distinct elements from both sets = {1, 2, 3, 4}.\nIntersection A ∩ B = common elements = {2, 3}.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-matrices",
    question: "If A = [[2, 1], [0, 3]], find |A| (determinant of A).",
    options: ["5", "6", "7", "8"],
    answer: 1,
    explanation:
      "For a 2×2 matrix [[a, b], [c, d]], determinant = ad − bc.\nHere a = 2, b = 1, c = 0, d = 3.\n|A| = (2)(3) − (1)(0) = 6 − 0 = 6.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-determinants",
    question: "If |A| = 5 and A is a 2×2 matrix, what is |2A|?",
    options: ["10", "20", "25", "4"],
    answer: 1,
    explanation:
      "For an n×n matrix, |kA| = kⁿ|A|.\nHere n = 2 and k = 2.\n|2A| = 2² × |A| = 4 × 5 = 20.",
    paperYear: "2023",
  },
  {
    chapterId: "c12-continuity-and-differentiability",
    question: "Find the derivative of f(x) = x³ + 2x.",
    options: ["3x² + 2", "3x²", "x² + 2", "3x + 2"],
    answer: 0,
    explanation:
      "Use the power rule: d/dx(xⁿ) = n·xⁿ⁻¹.\nd/dx(x³) = 3x².\nd/dx(2x) = 2.\nSo f′(x) = 3x² + 2.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-integrals",
    question: "Evaluate ∫ 2x dx.",
    options: ["x² + C", "2x² + C", "x + C", "2 + C"],
    answer: 0,
    explanation:
      "Use ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C for n ≠ −1.\n∫ 2x dx = 2 · x²/2 + C = x² + C.",
    paperYear: "2023",
  },
  {
    chapterId: "c12-probability",
    question:
      "A fair coin is tossed once. What is the probability of getting a head?",
    options: ["0", "1/4", "1/2", "1"],
    answer: 2,
    explanation:
      "Sample space S = {H, T}, so n(S) = 2.\nEvent E = {H}, so n(E) = 1.\nP(E) = n(E)/n(S) = 1/2.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-vector-algebra",
    question: "Find the magnitude of vector a = 3i + 4j.",
    options: ["5", "7", "12", "25"],
    answer: 0,
    explanation:
      "For a = ai + bj, |a| = √(a² + b²).\n|a| = √(3² + 4²) = √(9 + 16) = √25 = 5.",
    paperYear: "2023",
  },
  // Class 12 Physics
  {
    chapterId: "c12-electric-charges-and-fields",
    question: "The SI unit of electric charge is:",
    options: ["Ampere", "Coulomb", "Volt", "Ohm"],
    answer: 1,
    explanation:
      "Electric charge is measured in Coulomb (C) in SI units.\nAmpere is unit of current, Volt is potential, Ohm is resistance.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-current-electricity",
    question: "According to Ohm's law, V = IR. If V = 12 V and R = 4 Ω, find I.",
    options: ["2 A", "3 A", "4 A", "48 A"],
    answer: 1,
    explanation:
      "Ohm's law: V = IR, so I = V/R.\nI = 12/4 = 3 A.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-electromagnetic-induction",
    question: "Faraday's law of electromagnetic induction is related to:",
    options: ["Electric field only", "Induced EMF", "Magnetic monopoles", "Photoelectric effect"],
    answer: 1,
    explanation:
      "Faraday's law states that a change in magnetic flux through a coil induces an EMF.\nThis is the basis of generators and transformers.",
    paperYear: "2023",
  },
  {
    chapterId: "c12-ray-optics-and-optical-instruments",
    question: "The mirror formula is:",
    options: ["1/f = 1/v + 1/u", "f = uv", "f = u + v", "1/f = u + v"],
    answer: 0,
    explanation:
      "Mirror formula: 1/f = 1/v + 1/u.\nf = focal length, v = image distance, u = object distance.\nUse sign convention carefully for real/virtual images.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-atoms",
    question: "In Bohr model, electron revolves in:",
    options: ["Random paths", "Fixed orbits without radiating energy", "Elliptical paths only", "Nucleus"],
    answer: 1,
    explanation:
      "Bohr postulated electrons move in fixed circular orbits with quantised angular momentum.\nElectrons do not radiate energy while in these stable orbits.",
    paperYear: "2023",
  },
  // Class 12 Biology
  {
    chapterId: "c12-human-reproduction",
    question: "Fertilisation in humans normally occurs in the:",
    options: ["Ovary", "Uterus", "Fallopian tube", "Vagina"],
    answer: 2,
    explanation:
      "Sperm meets the ovum in the ampulla of the fallopian tube (oviduct).\nThe zygote then travels to the uterus for implantation.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-principles-of-inheritance-and-variation",
    question: "Mendel's law of segregation applies to:",
    options: ["Two traits together", "Separation of alleles during gamete formation", "Linked genes only", "Mutations"],
    answer: 1,
    explanation:
      "Law of segregation: alleles of a gene separate during gamete formation.\nEach gamete receives only one allele for each gene.",
    paperYear: "2024",
  },
  {
    chapterId: "c12-molecular-basis-of-inheritance",
    question: "DNA replication is described as:",
    options: ["Conservative", "Dispersive", "Semi-conservative", "Random"],
    answer: 2,
    explanation:
      "Meselson-Stahl experiment showed each new DNA molecule has one old and one new strand.\nHence replication is semi-conservative.",
    paperYear: "2023",
  },
  {
    chapterId: "c12-ecosystem",
    question: "In a food chain, the flow of energy is:",
    options: ["Cyclic", "Unidirectional", "Bidirectional", "Random"],
    answer: 1,
    explanation:
      "Energy flows from producers → consumers → decomposers.\nAt each trophic level, energy is lost as heat, so flow is unidirectional.",
    paperYear: "2024",
  },
  // Class 11 Mathematics
  {
    chapterId: "sets",
    question:
      "In a survey of 400 students, 200 like apple juice and 250 like orange juice. If 50 like neither, how many like both?",
    options: ["50", "100", "150", "200"],
    answer: 1,
    explanation:
      "Let n(U) = 400, n(A) = 200, n(O) = 250, n(A ∪ O) = 400 − 50 = 350.\nUse n(A ∪ O) = n(A) + n(O) − n(A ∩ O).\n350 = 200 + 250 − n(A ∩ O).\nn(A ∩ O) = 450 − 350 = 100.",
    paperYear: "2024",
  },
  {
    chapterId: "trigonometric-functions",
    question: "What is the value of sin²θ + cos²θ?",
    options: ["0", "1", "2", "sin 2θ"],
    answer: 1,
    explanation:
      "This is the fundamental Pythagorean identity.\nFor any angle θ, sin²θ + cos²θ = 1.",
    paperYear: "2024",
  },
  {
    chapterId: "limits-and-derivatives",
    question: "Find lim(x→0) sin(x)/x.",
    options: ["0", "1", "∞", "Does not exist"],
    answer: 1,
    explanation:
      "This is a standard limit used in calculus.\nlim(x→0) sin(x)/x = 1 (x in radians).",
    paperYear: "2023",
  },
  // Class 11 Physics
  {
    chapterId: "laws-of-motion",
    question: "Newton's First Law is also called:",
    options: ["Law of Inertia", "Law of Gravity", "Law of Action-Reaction", "Law of Momentum"],
    answer: 0,
    explanation:
      "First law: a body remains at rest or in uniform motion unless acted upon by an external force.\nThis defines inertia, hence the name Law of Inertia.",
    paperYear: "2024",
  },
  {
    chapterId: "work-energy-and-power",
    question: "Work done W = F·d·cos θ. When is W maximum for fixed F and d?",
    options: ["θ = 90°", "θ = 0°", "θ = 180°", "θ = 45°"],
    answer: 1,
    explanation:
      "W = Fd cos θ. cos θ is maximum when θ = 0° (cos 0° = 1).\nForce and displacement in the same direction give maximum work.",
    paperYear: "2023",
  },
  // Class 11 Chemistry
  {
    chapterId: "structure-of-atom",
    question: "Which subatomic particle has a negative charge?",
    options: ["Proton", "Neutron", "Electron", "Nucleus"],
    answer: 2,
    explanation:
      "Electrons carry −1 charge.\nProtons are +1, neutrons are neutral.",
    paperYear: "2024",
  },
  // Class 11 Biology
  {
    chapterId: "cell-the-unit-of-life",
    question: "Which organelle is called the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
    answer: 1,
    explanation:
      "Mitochondria produce ATP through cellular respiration.\nATP is the main energy currency of the cell.",
    paperYear: "2024",
  },
];

function formatPaper(paper, gradeLabel, chapter, subject) {
  const steps = paper.explanation
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id: `board-${paper.chapterId}-${paper.question.slice(0, 20).replace(/\W/g, "")}`,
    question: paper.question,
    options: paper.options,
    answer: paper.answer,
    explanation: paper.explanation,
    steps,
    chapterId: paper.chapterId,
    chapterName: chapter?.name || paper.chapterId,
    chapterNo: chapter?.chapterNo,
    subjectId: subject?.id || "",
    subjectName: subject?.name || "",
    paperLabel: `CBSE Board ${paper.paperYear} · ${chapter?.name || "Archive"}`,
    paperYear: paper.paperYear,
  };
}

export function getBoardFaqForStudent(user) {
  const gradeLabel = normalizeStudentGrade(user.grade);
  const gradeSubjects = getSubjectsForStudentGrade(user.grade);
  const chapterMap = new Map();

  gradeSubjects.forEach((subject) => {
    subject.chapters.forEach((chapter) => {
      chapterMap.set(chapter.id, { chapter, subject });
    });
  });

  const allowedChapterIds = new Set(chapterMap.keys());

  const papers = boardPapers
    .filter((paper) => allowedChapterIds.has(paper.chapterId))
    .map((paper) => {
      const { chapter, subject } = chapterMap.get(paper.chapterId);
      return formatPaper(paper, gradeLabel, chapter, subject);
    });

  const subjects = gradeSubjects.map((subject) => ({
    id: subject.id,
    name: subject.name,
    icon: subject.icon,
    chapters: subject.chapters.map((chapter) => ({
      id: chapter.id,
      chapterNo: chapter.chapterNo,
      name: chapter.name,
      paperCount: papers.filter((p) => p.chapterId === chapter.id).length,
    })),
  }));

  return {
    gradeLabel,
    total: papers.length,
    papers,
    subjects,
  };
}
