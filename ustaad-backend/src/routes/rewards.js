import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const rewards = [
  { id: "dominos", name: "Food Coupon — Domino's", cost: 200, icon: "🍕" },
  { id: "amazon", name: "Amazon Discount Voucher", cost: 500, icon: "🛒" },
  { id: "premium", name: "Ustaad Premium (1 Month)", cost: 800, icon: "⭐" },
  { id: "scholarship", name: "Scholarship Entry Token", cost: 1000, icon: "🎓" },
];

router.get("/", protect, (req, res) => {
  res.json({
    coins: req.user.coins,
    rewards: rewards.map((r) => ({
      ...r,
      redeemed: req.user.redeemedRewards.includes(r.id),
      canRedeem: req.user.coins >= r.cost,
    })),
  });
});

router.post("/redeem", protect, async (req, res) => {
  try {
    const { rewardId } = req.body;
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }
    if (req.user.redeemedRewards.includes(rewardId)) {
      return res.status(400).json({ message: "Already redeemed" });
    }
    if (req.user.coins < reward.cost) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    req.user.coins -= reward.cost;
    req.user.redeemedRewards.push(rewardId);
    await req.user.save();

    res.json({ message: "Reward redeemed!", coins: req.user.coins, user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
