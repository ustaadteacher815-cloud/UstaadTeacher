import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, default: "" },
    grade: { type: String, default: "" },
    board: { type: String, default: "CBSE" },
    subjects: [{ type: String }],
    goals: [{ type: String }],
    authProvider: {
      type: String,
      enum: ["phone", "google", "apple"],
      default: "phone",
    },
    role: {
      type: String,
      enum: ["student", "admin", "parent"],
      default: "student",
    },
    linkedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires: { type: Date },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
    badges: [{ type: String }],
    assessment: {
      score: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      subjectScores: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    personalPlan: {
      priorities: [{ type: String }],
      dailyGoals: [{ type: String }],
      chapters: [{ type: String }],
    },
    subjectProgress: {
      mathematics: { type: Number, default: 0 },
      physics: { type: Number, default: 0 },
      chemistry: { type: Number, default: 0 },
      biology: { type: Number, default: 0 },
      "mathematics-12": { type: Number, default: 0 },
      "physics-12": { type: Number, default: 0 },
      "biology-12": { type: Number, default: 0 },
    },
    completedLessons: [{ type: String }],
    completedSkillLessons: [{ type: String }],
    completedChallenges: [{ type: String }],
    redeemedRewards: [{ type: String }],
    joinedGroups: [{ type: String }],
    aiChatHistory: [
      {
        role: { type: String, enum: ["user", "ai"] },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    onboardingComplete: { type: Boolean, default: false },
    planViewed: { type: Boolean, default: false },
    lessonsCompleted: { type: Number, default: 0 },
    timeSpentMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
