import mongoose from "mongoose";

const skillTrackSchema = new mongoose.Schema(
  {
    trackId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "💡" },
    description: { type: String, default: "" },
    lessonCount: { type: Number, default: 12, min: 1 },
    relatedSubjects: [{ type: String }],
    relatedCareers: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("SkillTrack", skillTrackSchema);
