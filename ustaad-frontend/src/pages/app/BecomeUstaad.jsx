import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import AppLayout from "../../components/layouts/AppLayout";

const milestones = [
  { icon: "🎓", title: "Confident Learner", desc: "Complete 50 lessons", done: true },
  { icon: "📈", title: "Strong Academic Scores", desc: "Score 80%+ in assessments", done: false },
  { icon: "🎯", title: "Career Ready", desc: "Explore 3 career paths", done: false },
  { icon: "💼", title: "Skilled Professional", desc: "Complete 2 skill modules", done: false },
];

function BecomeUstaad() {
  return (
    <AppLayout title="Become an Ustaad 🌟" backTo="/dashboard" backLabel="Back to Home">
      <div className="ustaad-card text-center mb-4" style={{ background: "linear-gradient(135deg, #58cc02, #1cb0f6)", color: "white" }}>
        <div style={{ fontSize: "4rem" }}>🌟</div>
        <h3 className="fw-bold">Your Journey to Mastery</h3>
        <p className="mb-0">Become a confident, career-ready Ustaad</p>
      </div>

      {milestones.map((m) => (
        <div key={m.title} className={`ustaad-list-card ${m.done ? "" : "opacity-75"}`}>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: "2rem" }}>{m.icon}</span>
            <div>
              <h6 className="fw-bold mb-1">{m.title}</h6>
              <small className="text-muted">{m.desc}</small>
            </div>
            {m.done && <span className="ustaad-badge ms-auto">✅ Achieved</span>}
          </div>
        </div>
      ))}

      <Button as={Link} to="/dashboard" className="ustaad-btn-primary w-100 mt-3">
        CONTINUE YOUR JOURNEY
      </Button>
    </AppLayout>
  );
}

export default BecomeUstaad;
