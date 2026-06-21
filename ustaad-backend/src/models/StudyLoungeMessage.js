import mongoose from "mongoose";

const studyLoungeMessageSchema = new mongoose.Schema(
  {
    loungeId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, default: "Student" },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model("StudyLoungeMessage", studyLoungeMessageSchema);
