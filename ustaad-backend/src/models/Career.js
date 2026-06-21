import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    careerId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "🎯" },
    stream: { type: String, default: "STEM" },
    relatedSubjects: [{ type: String }],
    skills: [{ type: String }],
    salary: { type: String, default: "" },
    demand: { type: String, default: "High" },
    path: [{ type: String }],
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
