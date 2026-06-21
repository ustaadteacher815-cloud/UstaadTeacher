export const navSections = [
  {
    title: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: "📊", end: true },
      { to: "/admin/analytics", label: "Analytics", icon: "📈" },
    ],
  },
  {
    title: "Users",
    items: [
      { to: "/admin/users", label: "Users", icon: "👥" },
      { to: "/admin/parents", label: "Parents", icon: "👨‍👩‍👧" },
      { to: "/admin/leaderboard", label: "Leaderboard", icon: "🏆" },
    ],
  },
  {
    title: "Learning",
    items: [
      { to: "/admin/content", label: "Chapter Quests", icon: "🎯" },
      { to: "/admin/theory-lab", label: "Theory Lab", icon: "📖" },
      { to: "/admin/board-faq", label: "Board FAQ", icon: "📋" },
      { to: "/admin/questions", label: "Question Bank", icon: "❓" },
      { to: "/admin/challenges", label: "Daily Challenge", icon: "⚡" },
    ],
  },
  {
    title: "Progress",
    items: [
      { to: "/admin/weekly-targets", label: "Weekly Targets", icon: "🎯" },
      { to: "/admin/streak", label: "Streaks", icon: "🔥" },
      { to: "/admin/skills-careers", label: "Skills & Careers", icon: "💡" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { to: "/admin/community", label: "Study Lounges", icon: "👥" },
      { to: "/admin/rewards", label: "Rewards", icon: "🎁" },
      { to: "/admin/ai-insights", label: "Doubt Coach Logs", icon: "🧠" },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/admin/admins", label: "Admin Users", icon: "🛡️" },
      { to: "/admin/settings", label: "Settings", icon: "⚙️" },
    ],
  },
];
