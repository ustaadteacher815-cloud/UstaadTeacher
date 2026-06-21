import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOtp } from "../utils/helpers.js";

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

function shouldReturnDevOtp() {
  if (process.env.SHOW_DEV_OTP === "false") return false;
  if (process.env.NODE_ENV !== "production") return true;
  // No SMS gateway yet — expose OTP in API until SHOW_DEV_OTP=false.
  return true;
}

router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone?.trim()) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      user = await User.create({ phone: phone.trim() });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      message: "OTP sent successfully",
      devOtp: shouldReturnDevOtp() ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, mode } = req.body;
    const user = await User.findOne({ phone: phone?.trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found. Send OTP first." });
    }

    const validOtp =
      user.otp === otp &&
      user.otpExpires &&
      user.otpExpires > new Date();

    const devBypass =
      process.env.NODE_ENV !== "production" && otp === "123456";

    if (!validOtp && !devBypass) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    if (mode === "login" && !user.name) {
      return res.status(400).json({
        message: "Account not found. Please sign up first.",
      });
    }

    const isNewUser = !user.onboardingComplete;

    res.json({
      token: signToken(user._id),
      user,
      isNewUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/social", async (req, res) => {
  try {
    const { provider, phone, name, providerId } = req.body;
    if (!provider?.trim()) {
      return res.status(400).json({ message: "Provider is required" });
    }

    const socialKey = phone?.trim() || `${provider.trim()}:${providerId?.trim() || "default"}`;

    let user = await User.findOne({ phone: socialKey });
    if (!user) {
      user = await User.create({
        phone: socialKey,
        name: name || "",
        authProvider: provider || "google",
      });
    } else if (name && !user.name) {
      user.name = name;
      await user.save();
    }

    res.json({
      token: signToken(user._id),
      user,
      isNewUser: !user.onboardingComplete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/admin-signup", async (req, res) => {
  try {
    const { phone, otp, name, adminKey } = req.body;
    const expectedKey = process.env.ADMIN_SIGNUP_KEY;

    if (!expectedKey) {
      return res.status(503).json({
        message: "Admin signup is not configured. Set ADMIN_SIGNUP_KEY on the server.",
      });
    }

    if (adminKey !== expectedKey) {
      return res.status(403).json({ message: "Invalid admin invite key" });
    }

    if (!phone?.trim() || !name?.trim()) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(400).json({ message: "Send OTP to this phone first" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin account already exists for this phone" });
    }

    if (user.role === "parent") {
      return res.status(400).json({ message: "Parent account already exists for this phone" });
    }

    if (user.role === "student" && user.onboardingComplete) {
      return res.status(400).json({
        message: "This phone is already registered as a student account",
      });
    }

    const validOtp =
      user.otp === otp &&
      user.otpExpires &&
      user.otpExpires > new Date();

    const devBypass =
      process.env.NODE_ENV !== "production" && otp === "123456";

    if (!validOtp && !devBypass) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.name = name.trim();
    user.role = "admin";
    user.onboardingComplete = true;
    user.planViewed = true;
    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(201).json({
      token: signToken(user._id),
      user,
      message: "Admin account created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/parent-signup", async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone?.trim() || !name?.trim()) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(400).json({ message: "Send OTP to this phone first" });
    }

    if (user.role === "parent") {
      return res.status(400).json({ message: "Parent account already exists for this phone" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "This phone is registered as an admin account" });
    }

    if (user.role === "student" && user.onboardingComplete) {
      return res.status(400).json({
        message: "This phone is already registered as a student account",
      });
    }

    const validOtp =
      user.otp === otp &&
      user.otpExpires &&
      user.otpExpires > new Date();

    const devBypass =
      process.env.NODE_ENV !== "production" && otp === "123456";

    if (!validOtp && !devBypass) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.name = name.trim();
    user.role = "parent";
    user.onboardingComplete = true;
    user.planViewed = true;
    user.linkedStudents = user.linkedStudents || [];
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(201).json({
      token: signToken(user._id),
      user,
      message: "Parent account created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
