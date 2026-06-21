import express from "express";
import { protect } from "../middleware/auth.js";
import { getCareersForUser, getCareerDetailForUser } from "../data/careers.js";

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.json(getCareersForUser(req.user));
});

router.get("/:careerId", protect, (req, res) => {
  const career = getCareerDetailForUser(req.user, req.params.careerId);
  if (!career) {
    return res.status(404).json({ message: "Career not found" });
  }
  res.json(career);
});

export default router;
