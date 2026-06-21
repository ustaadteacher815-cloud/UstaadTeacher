import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config();

const questions = [
  {
    type: "assessment",
    subject: "mathematics",
    chapterId: "trigonometric-functions",
    question: "What is sin(30°)?",
    options: ["0", "1/2", "√3/2", "1"],
    answer: 1,
    explanation: "sin(30°) = 1/2",
  },
  {
    type: "assessment",
    subject: "physics",
    chapterId: "laws-of-motion",
    question: "Newton's First Law is also called:",
    options: ["Law of Inertia", "Law of Gravity", "Law of Motion", "Law of Force"],
    answer: 0,
  },
  {
    type: "assessment",
    subject: "chemistry",
    chapterId: "some-basic-concepts-of-chemistry",
    question: "Chemical formula of water is:",
    options: ["CO₂", "H₂O", "O₂", "NaCl"],
    answer: 1,
  },
  {
    type: "daily",
    question:
      "A ladder 10m long leans against a wall. If the base is 6m from the wall, how high does it reach?",
    options: ["6m", "8m", "10m", "12m"],
    answer: 1,
    explanation: "Using Pythagoras: height = √(10² - 6²) = √64 = 8m",
  },
  {
    type: "practice",
    chapterId: "laws-of-motion",
    question: "Newton's First Law is also called:",
    options: ["Law of Inertia", "Law of Gravity", "Law of Motion", "Law of Force"],
    answer: 0,
  },
  {
    type: "practice",
    chapterId: "structure-of-atom",
    question: "Which particle has a negative charge?",
    options: ["Proton", "Neutron", "Electron", "Nucleus"],
    answer: 2,
  },
  {
    type: "practice",
    chapterId: "cell-the-unit-of-life",
    question: "Which organelle is called the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
    answer: 1,
  },
  {
    type: "practice",
    chapterId: "c12-current-electricity",
    question: "SI unit of electric current is:",
    options: ["Volt", "Ampere", "Ohm", "Coulomb"],
    answer: 1,
  },
  {
    type: "practice",
    chapterId: "c12-matrices",
    question: "A matrix with equal number of rows and columns is called:",
    options: ["Row matrix", "Column matrix", "Square matrix", "Zero matrix"],
    answer: 2,
  },
  {
    type: "practice",
    chapterId: "c12-human-reproduction",
    question: "Fertilisation in humans occurs in the:",
    options: ["Ovary", "Uterus", "Fallopian tube", "Vagina"],
    answer: 2,
  },
  {
    type: "practice",
    chapterId: "sets",
    question: "Which of the following is a set?",
    options: ["{1, 2, 3}", "All tall students", "Good books", "Rich people"],
    answer: 0,
  },
  {
    type: "practice",
    chapterId: "trigonometric-functions",
    question: "What is the value of sin(45°)?",
    options: ["1/√2", "1", "0", "√3/2"],
    answer: 0,
  },
  {
    type: "practice",
    chapterId: "trigonometric-functions",
    question: "Which identity is correct?",
    options: ["sin²θ + cos²θ = 1", "sinθ + cosθ = 1", "sinθ = cosθ", "tanθ = 1"],
    answer: 0,
  },
];

const seed = async () => {
  await connectDB();
  await Question.deleteMany({});
  await Question.insertMany(questions);

  await User.findOneAndUpdate(
    { phone: "9999999999" },
    {
      phone: "9999999999",
      name: "Platform Admin",
      role: "admin",
      onboardingComplete: true,
      planViewed: true,
      isActive: true,
    },
    { upsert: true, new: true }
  );

  console.log("Database seeded with questions and admin user");
  console.log("Admin login: phone 9999999999, OTP from logs or 123456 (dev)");
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
