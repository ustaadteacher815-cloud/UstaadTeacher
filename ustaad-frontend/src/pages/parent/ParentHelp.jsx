import { Link } from "react-router-dom";
import ParentLayout from "../../components/layouts/ParentLayout";

const faqs = [
  {
    q: "How do I link my child's account?",
    a: "Go to Link Child and enter the phone number your child used to sign up on Ustaad.",
  },
  {
    q: "Can I link more than one child?",
    a: "Yes. You can link multiple student accounts from the same parent portal.",
  },
  {
    q: "Why can't I see my child's progress?",
    a: "Make sure the phone number matches exactly. Your child must have a student account, not a parent or admin account.",
  },
  {
    q: "How often are reports updated?",
    a: "Progress, streaks, and XP update in real time as your child uses the app.",
  },
];

function ParentHelp() {
  return (
    <ParentLayout title="Help & Support">
      <div className="page-intro">
        <p>Common questions about the Ustaad Parent Portal.</p>
      </div>

      <div className="ustaad-card mb-4">
        <h5 className="fw-bold mb-3">Quick links</h5>
        <div className="d-flex flex-wrap gap-3">
          <Link to="/parent/link" className="ustaad-link">Link a child</Link>
          <Link to="/help/contact" className="ustaad-link">Contact support</Link>
          <Link to="/legal/privacy" className="ustaad-link">Privacy policy</Link>
        </div>
      </div>

      {faqs.map((item) => (
        <div key={item.q} className="ustaad-card mb-3">
          <h6 className="fw-bold mb-2">{item.q}</h6>
          <p className="text-muted mb-0">{item.a}</p>
        </div>
      ))}

      <div className="ustaad-card">
        <h5 className="fw-bold mb-2">Need more help?</h5>
        <p className="text-muted mb-3">
          Email us at support@ustaad.app or visit our help center for guides and tutorials.
        </p>
        <Link to="/help/contact" className="ustaad-btn-primary btn">
          Contact Support
        </Link>
      </div>
    </ParentLayout>
  );
}

export default ParentHelp;
