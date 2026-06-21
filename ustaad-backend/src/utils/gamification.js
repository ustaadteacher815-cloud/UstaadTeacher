export function buildWeeklyTargets(user) {
  const questsCompleted = user.lessonsCompleted || 0;
  const questCycle = questsCompleted % 3;
  const questsRemaining = questCycle === 0 && questsCompleted > 0 ? 0 : 3 - questCycle;

  const challengesDone = user.completedChallenges?.length || 0;
  const challengeCycle = challengesDone % 5;
  const challengesRemaining = challengeCycle === 0 && challengesDone > 0 ? 0 : 5 - challengeCycle;

  const xpMilestone = 150;
  const xpProgress = user.xp % xpMilestone;
  const xpRemaining = xpProgress === 0 && user.xp > 0 ? 0 : xpMilestone - xpProgress;

  const streakGoal = 7;
  const streakRemaining = Math.max(streakGoal - (user.streak || 0), 0);

  return {
    weekLabel: "Weekly CBSE Targets",
    targets: [
      {
        id: "quests",
        label: "Chapter quests",
        icon: "🎯",
        done: questCycle === 0 && questsCompleted > 0 ? 3 : questCycle,
        goal: 3,
        remaining: questsRemaining,
        complete: questsRemaining === 0 && questsCompleted > 0,
        hint: questsRemaining
          ? `Complete ${questsRemaining} more chapter quest${questsRemaining === 1 ? "" : "s"}`
          : "Weekly quest target reached!",
      },
      {
        id: "challenges",
        label: "Daily challenges",
        icon: "⚡",
        done: challengeCycle === 0 && challengesDone > 0 ? 5 : challengeCycle,
        goal: 5,
        remaining: challengesRemaining,
        complete: challengesRemaining === 0 && challengesDone > 0,
        hint: challengesRemaining
          ? `Finish ${challengesRemaining} more daily challenge${challengesRemaining === 1 ? "" : "s"}`
          : "Challenge target reached!",
      },
      {
        id: "xp",
        label: "XP milestone",
        icon: "⭐",
        done: xpProgress,
        goal: xpMilestone,
        remaining: xpRemaining,
        complete: xpRemaining === 0 && user.xp > 0,
        hint: xpRemaining
          ? `Earn ${xpRemaining} more XP`
          : "XP milestone unlocked!",
      },
      {
        id: "streak",
        label: "Study streak",
        icon: "🔥",
        done: Math.min(user.streak || 0, streakGoal),
        goal: streakGoal,
        remaining: streakRemaining,
        complete: (user.streak || 0) >= streakGoal,
        hint: streakRemaining
          ? `${streakRemaining} day${streakRemaining === 1 ? "" : "s"} to a 7-day streak`
          : "7-day streak achieved!",
      },
    ],
  };
}

export function studentLevel(xp = 0) {
  return Math.max(1, Math.floor(xp / 120) + 1);
}

export function studentTitle(xp = 0, lessonsCompleted = 0) {
  if (xp >= 1500) return "Limit Breaker";
  if (xp >= 1200) return "Derivative Demigod";
  if (xp >= 1000) return "Venn Master";
  if (xp >= 800) return "Trig Titan";
  if (xp >= 600) return "Complex Crusader";
  if (lessonsCompleted >= 10) return "Quest Scholar";
  if (lessonsCompleted >= 5) return "Chapter Explorer";
  return "Scholar";
}
