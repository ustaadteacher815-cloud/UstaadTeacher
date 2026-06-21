function resolveApiUrl() {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const trimmed = String(raw).trim().replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const API_URL = resolveApiUrl();

const getToken = () => localStorage.getItem("ustaad_token");

export const setToken = (token) => {
  if (token) localStorage.setItem("ustaad_token", token);
  else localStorage.removeItem("ustaad_token");
};

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const fallback =
      res.status === 404
        ? "API route not found. Check VITE_API_URL ends with /api on Render."
        : "Request failed";
    throw new Error(data.message || fallback);
  }
  return data;
}

export const api = {
  health: () => request("/health"),

  sendOtp: (phone) =>
    request("/auth/send-otp", { method: "POST", body: JSON.stringify({ phone }) }),

  verifyOtp: (phone, otp, mode) =>
    request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp, mode }),
    }),

  adminSignup: (phone, otp, name, adminKey) =>
    request("/auth/admin-signup", {
      method: "POST",
      body: JSON.stringify({ phone, otp, name, adminKey }),
    }),

  parentSignup: (phone, otp, name) =>
    request("/auth/parent-signup", {
      method: "POST",
      body: JSON.stringify({ phone, otp, name }),
    }),

  parentDashboard: () => request("/parent/dashboard"),
  parentActivity: () => request("/parent/activity"),
  parentProgress: () => request("/parent/progress"),
  parentLeaderboard: () => request("/parent/leaderboard"),
  parentRewards: () => request("/parent/rewards"),
  parentChallenges: () => request("/parent/challenges"),
  parentNotifications: () => request("/parent/notifications"),
  parentUpdateProfile: (name) =>
    request("/parent/profile", { method: "PATCH", body: JSON.stringify({ name }) }),
  parentLinkChild: (studentPhone) =>
    request("/parent/link", { method: "POST", body: JSON.stringify({ studentPhone }) }),
  parentUnlinkChild: (studentId) =>
    request(`/parent/link/${studentId}`, { method: "DELETE" }),
  parentChildReport: (studentId) => request(`/parent/child/${studentId}`),
  parentChildAnalytics: (studentId) => request(`/parent/child/${studentId}/analytics`),
  parentChildWeeklyTargets: (studentId) => request(`/parent/child/${studentId}/weekly-targets`),
  parentChildSkills: (studentId) => request(`/parent/child/${studentId}/skills`),
  parentChildCommunity: (studentId) => request(`/parent/child/${studentId}/community`),
  parentReports: () => request("/parent/reports"),

  socialLogin: (provider, name) =>
    request("/auth/social", {
      method: "POST",
      body: JSON.stringify({ provider, name }),
    }),

  getMe: () => request("/users/me"),
  updateProfile: (profile) =>
    request("/users/profile", { method: "PUT", body: JSON.stringify(profile) }),

  getAssessment: () => request("/users/assessment"),
  submitAssessment: (answers) =>
    request("/users/assessment/submit", {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  getDashboard: () => request("/users/dashboard"),
  acknowledgePlan: () =>
    request("/users/plan-viewed", { method: "PUT" }),
  completeOnboarding: () =>
    request("/users/onboarding-complete", { method: "PUT" }),
  getAnalytics: () => request("/users/analytics"),
  getRecommendations: () => request("/users/recommendations"),
  getWeeklyTargets: () => request("/users/weekly-targets"),

  getCareers: () => request("/careers"),
  getCareer: (careerId) => request(`/careers/${careerId}`),

  getSkills: () => request("/skills"),
  completeSkillLesson: (trackId, lessonId) =>
    request(`/skills/${trackId}/lessons/${lessonId}/complete`, { method: "POST" }),

  getSubjects: () => request("/learning/subjects"),
  getTheoryLab: () => request("/learning/theory-lab"),
  getBoardFaq: () => request("/learning/board-faq"),
  getChapters: (subject) => request(`/learning/subjects/${subject}/chapters`),
  getPractice: (chapterId) => request(`/learning/practice/${chapterId}`),
  submitPractice: (chapterId, answers, hasDoubt) =>
    request(`/learning/practice/${chapterId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers, hasDoubt }),
    }),
  completeLesson: (chapterId) =>
    request(`/learning/lesson/${chapterId}/complete`, { method: "POST" }),

  getDailyChallenge: () => request("/challenges/today"),
  completeChallenge: (questionId, selected) =>
    request("/challenges/complete", {
      method: "POST",
      body: JSON.stringify({ questionId, selected }),
    }),

  getLeaderboard: () => request("/leaderboard"),
  getAiHistory: () => request("/ai/history"),
  clearAiHistory: () => request("/ai/history", { method: "DELETE" }),
  sendAiMessage: (message, options = {}) =>
    request("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, ...options }),
    }),
  getLessonScript: (chapterName) =>
    request("/ai/lesson-script", {
      method: "POST",
      body: JSON.stringify({ chapterName }),
    }),
  getChapterExtras: (chapterName, type) =>
    request("/ai/chapter-extras", {
      method: "POST",
      body: JSON.stringify({ chapterName, type }),
    }),

  getRewards: () => request("/rewards"),
  redeemReward: (rewardId) =>
    request("/rewards/redeem", {
      method: "POST",
      body: JSON.stringify({ rewardId }),
    }),

  getCommunity: () => request("/community"),
  getStudyLounge: (loungeId) => request(`/community/${loungeId}`),
  joinStudyLounge: (loungeId) =>
    request(`/community/${loungeId}/join`, { method: "POST" }),
  postLoungeMessage: (loungeId, text) =>
    request(`/community/${loungeId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  adminStats: () => request("/admin/stats"),
  adminGetUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/users${q ? `?${q}` : ""}`);
  },
  adminGetUser: (id) => request(`/admin/users/${id}`),
  adminGetUserAnalytics: (id) => request(`/admin/users/${id}/analytics`),
  adminGetUserWeeklyTargets: (id) => request(`/admin/users/${id}/weekly-targets`),
  adminGetUserSkills: (id) => request(`/admin/users/${id}/skills`),
  adminGetParents: () => request("/admin/parents"),
  adminSkillsOverview: () => request("/admin/skills/overview"),
  adminCareersOverview: () => request("/admin/careers/overview"),
  adminGetSkillTracks: () => request("/admin/skills"),
  adminCreateSkillTrack: (data) =>
    request("/admin/skills", { method: "POST", body: JSON.stringify(data) }),
  adminUpdateSkillTrack: (id, data) =>
    request(`/admin/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  adminDeleteSkillTrack: (id) =>
    request(`/admin/skills/${id}`, { method: "DELETE" }),
  adminGetCareers: () => request("/admin/careers"),
  adminCreateCareer: (data) =>
    request("/admin/careers", { method: "POST", body: JSON.stringify(data) }),
  adminUpdateCareer: (id, data) =>
    request(`/admin/careers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  adminDeleteCareer: (id) =>
    request(`/admin/careers/${id}`, { method: "DELETE" }),
  adminGetCommunityMessages: (loungeId) => request(`/admin/community/${loungeId}/messages`),
  adminUpdateUser: (id, data) =>
    request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  adminGetQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/questions${q ? `?${q}` : ""}`);
  },
  adminCreateQuestion: (data) =>
    request("/admin/questions", { method: "POST", body: JSON.stringify(data) }),
  adminUpdateQuestion: (id, data) =>
    request(`/admin/questions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  adminDeleteQuestion: (id) =>
    request(`/admin/questions/${id}`, { method: "DELETE" }),
  adminContentOverview: () => request("/admin/content/overview"),
  adminTheoryLabOverview: () => request("/admin/learning/theory-lab"),
  adminBoardFaqOverview: () => request("/admin/learning/board-faq"),
  adminWeeklyTargetsOverview: () => request("/admin/weekly-targets/overview"),
  adminStreakOverview: () => request("/admin/streak/overview"),
  adminAnalytics: () => request("/admin/analytics"),
  adminChallenges: () => request("/admin/challenges"),
  adminLeaderboard: () => request("/admin/leaderboard"),
  adminRewardsOverview: () => request("/admin/rewards"),
  adminCommunityOverview: () => request("/admin/community"),
  adminAiInsights: () => request("/admin/ai-insights"),
  adminListAdmins: () => request("/admin/admins"),
};
