const todayKey = () => new Date().toISOString().slice(0, 10);

export const updateStreak = (user) => {
  const today = todayKey();
  if (user.lastActiveDate === today) return user;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (user.lastActiveDate === yesterdayKey) {
    user.streak += 1;
  } else if (user.lastActiveDate !== today) {
    user.streak = 1;
  }

  user.lastActiveDate = today;

  if (user.streak >= 7 && !user.badges.includes("7-day")) {
    user.badges.push("7-day");
  }
  if (user.streak >= 30 && !user.badges.includes("30-day")) {
    user.badges.push("30-day");
  }
  if (user.streak >= 100 && !user.badges.includes("100-day")) {
    user.badges.push("100-day");
  }

  return user;
};

export const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const buildPersonalPlan = (assessment, subjects = []) => {
  const weaknesses = assessment.weaknesses?.length
    ? assessment.weaknesses
    : [];
  const strengths = assessment.strengths?.length
    ? assessment.strengths
    : [];

  return {
    priorities: weaknesses.slice(0, 3),
    dailyGoals: [
      "Complete 1 micro-lesson",
      "Solve 10 practice questions",
      "Earn 50 XP",
    ],
    chapters: weaknesses.slice(0, 3),
  };
};

export const aiReply = (question) => {
  const q = question.toLowerCase();
  if (q.includes("set") || q.includes("sets")) {
    return "Sets in mathematics:\n\n1. A set is a well-defined collection of distinct objects (elements)\n2. Notation: A = {1, 2, 3} — curly braces list elements\n3. Types: empty set ∅, finite, infinite, equal sets\n4. Operations: union (∪), intersection (∩), difference (−), complement\n5. Venn diagrams help visualize overlaps between sets\n\nExample: If A = {1,2,3} and B = {2,3,4}, then A ∪ B = {1,2,3,4} and A ∩ B = {2,3}";
  }
  if (q.includes("sin") || q.includes("cos") || q.includes("trig")) {
    return "For trigonometry problems:\n1. Draw the triangle and label sides\n2. Identify the ratio (sin, cos, tan)\n3. Use the correct identity or formula\n4. Substitute values and simplify";
  }
  if (q.includes("newton") || q.includes("force") || q.includes("physics")) {
    return "For physics problems:\n1. List given quantities with units\n2. Choose the right law (Newton's, conservation, etc.)\n3. Write the equation\n4. Solve and check units";
  }
  if (q.includes("water") || q.includes("chemical") || q.includes("chemistry")) {
    return "For chemistry problems:\n1. Write the chemical equation\n2. Balance it if needed\n3. Use mole concept or stoichiometry\n4. Verify your answer makes chemical sense";
  }
  return "Great question! Let me explain step-by-step:\n1. Identify what is given and what is asked\n2. Recall the relevant concept or formula\n3. Apply it carefully with units\n4. Verify your final answer";
};
