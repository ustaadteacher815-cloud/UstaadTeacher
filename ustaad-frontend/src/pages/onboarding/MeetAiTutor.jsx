import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button, Alert } from "react-bootstrap";

import OnboardingLayout from "../../components/layouts/OnboardingLayout";

import { api } from "../../api/client";

import { useAuth } from "../../hooks/useAuth";



function MeetAiTutor() {

  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  const handleStart = async () => {

    setError("");

    setLoading(true);

    try {

      await api.completeOnboarding();

      await refreshUser();

      navigate("/dashboard");

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };



  return (

    <OnboardingLayout step={5}>

      <div className="text-center">

        <div

          style={{

            width: 120,

            height: 120,

            borderRadius: "50%",

            background: "linear-gradient(135deg, #58cc02, #1cb0f6)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            fontSize: "3.5rem",

            margin: "0 auto 24px",

          }}

        >

          🤖

        </div>

        <h1 className="ustaad-title">Meet Your AI Tutor</h1>

        <p className="ustaad-subtitle">

          Hi! I&apos;m Ustaad AI — your personal teacher. Ask me anything,

          anytime. I&apos;ll explain step-by-step with text or voice.

        </p>



        {error && <Alert variant="danger">{error}</Alert>}



        <div className="ustaad-option text-start mb-2">💬 Ask questions anytime</div>

        <div className="ustaad-option text-start mb-2">🎙️ Voice explanations</div>

        <div className="ustaad-option text-start mb-4">📝 Step-by-step solutions</div>



        <Button

          className="ustaad-btn-primary w-100"

          onClick={handleStart}

          disabled={loading}

        >

          {loading ? "STARTING..." : "START LEARNING"}

        </Button>

      </div>

    </OnboardingLayout>

  );

}



export default MeetAiTutor;

