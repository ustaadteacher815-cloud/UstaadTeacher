import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button, Alert } from "react-bootstrap";

import OnboardingLayout from "../../components/layouts/OnboardingLayout";

import { api } from "../../api/client";

import { useAuth } from "../../hooks/useAuth";



function PersonalPlan() {

  const navigate = useNavigate();

  const { user, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  const plan = user?.personalPlan || {

    priorities: ["Trigonometry", "Organic Chemistry", "Mechanics"],

    dailyGoals: ["Complete 1 micro-lesson", "Solve 10 practice questions", "Earn 50 XP"],

    chapters: ["Trigonometry Basics", "Chemical Bonding", "Laws of Motion"],

  };



  const handleContinue = async () => {

    setError("");

    setLoading(true);

    try {

      await api.acknowledgePlan();

      await refreshUser();

      navigate("/meet-tutor");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };



  return (

    <OnboardingLayout step={4}>

      <div className="text-center mb-3">

        <div style={{ fontSize: "3rem" }}>🧠</div>

        <h1 className="ustaad-title">Your Personal Plan</h1>

        <p className="ustaad-subtitle">AI has created a learning path tailored for you</p>

      </div>



      {error && <Alert variant="danger">{error}</Alert>}



      <h6 className="fw-bold mb-2">Subject Priorities</h6>

      {plan.priorities?.map((item) => (

        <div key={item} className="ustaad-option selected">{item}</div>

      ))}



      <h6 className="fw-bold mb-2 mt-3">Daily Learning Goals</h6>

      {plan.dailyGoals?.map((item) => (

        <div key={item} className="ustaad-option">✅ {item}</div>

      ))}



      <h6 className="fw-bold mb-2 mt-3">Recommended Chapters</h6>

      {plan.chapters?.map((item) => (

        <div key={item} className="ustaad-option">📖 {item}</div>

      ))}



      <Button

        className="ustaad-btn-primary w-100 mt-4"

        onClick={handleContinue}

        disabled={loading}

      >

        {loading ? "SAVING..." : "MEET YOUR AI TUTOR"}

      </Button>

    </OnboardingLayout>

  );

}



export default PersonalPlan;

