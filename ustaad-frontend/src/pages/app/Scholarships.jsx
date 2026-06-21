import AppLayout from "../../components/layouts/AppLayout";

const opportunities = [
  { type: "Internship", title: "Tech Intern — Summer 2026", org: "TCS", icon: "💼", desc: "3-month paid internship for Class 12 students" },
  { type: "Scholarship", title: "Merit Scholarship for Class 12", org: "Ustaad Foundation", icon: "🎓", desc: "Up to ₹50,000 for top performers" },
  { type: "Certification", title: "Python for Beginners", org: "Ustaad Academy", icon: "📜", desc: "Free certificate after completing the coding track" },
  { type: "Scholarship", title: "STEM Excellence Award", org: "National Education Board", icon: "🏅", desc: "For students scoring 90%+ in assessments" },
  { type: "Internship", title: "Data Analyst Intern", org: "Infosys", icon: "📊", desc: "Remote internship — apply with your Ustaad profile" },
  { type: "Future", title: "Job Matching", org: "Ustaad Careers", icon: "🔮", desc: "AI-powered career matching — launching soon" },
];

function Scholarships() {
  return (
    <AppLayout title="Scholarships & Opportunities" backTo="/dashboard" backLabel="Back to Home">
      <div className="page-intro">
        <p>
          Discover internships, scholarships, and certifications matched to your grade and learning progress.
          Apply directly through Ustaad — your XP score and assessment results strengthen your application.
        </p>
      </div>

      <h6 className="fw-bold mb-3">{opportunities.length} opportunities</h6>

      {opportunities.map((o) => (
        <div key={o.title} className="ustaad-list-card">
          <span className="ustaad-badge mb-2 d-inline-block">{o.type}</span>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span style={{ fontSize: "2rem" }}>{o.icon}</span>
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">{o.title}</h6>
              <small className="text-muted d-block">{o.org}</small>
              <small className="text-muted">{o.desc}</small>
            </div>
            <button
              className="ustaad-btn-primary btn"
              style={{ height: 40, fontSize: 14 }}
              disabled={o.type === "Future"}
            >
              {o.type === "Future" ? "SOON" : "APPLY"}
            </button>
          </div>
        </div>
      ))}

      <div className="page-intro mt-2">
        <p>
          New opportunities are added weekly. Complete your profile and maintain a strong streak to get priority access.
        </p>
      </div>
    </AppLayout>
  );
}

export default Scholarships;
