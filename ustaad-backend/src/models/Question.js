import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["assessment", "daily", "practice", "board-faq"],
    required: true,
  },
  subject: { type: String, default: "general" },
  chapterId: { type: String, default: "" },
  paperYear: { type: String, default: "" },
  question: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: Number, required: true },
  explanation: { type: String, default: "" },
});

export default mongoose.model("Question", questionSchema);
