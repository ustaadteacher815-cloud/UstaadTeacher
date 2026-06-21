import ParentLayout from "../../components/layouts/ParentLayout";

const tips = [
  {
    title: "Encourage daily 15-minute sessions",
    desc: "Short, consistent study beats long cramming sessions. Ustaad's daily challenges are designed for this.",
  },
  {
    title: "Celebrate streaks and badges",
    desc: "Positive reinforcement keeps motivation high. Acknowledge when your child hits a 7-day streak.",
  },
  {
    title: "Review analytics together",
    desc: "Open the weekly report and discuss weak topics calmly — turn it into a planning conversation.",
  },
  {
    title: "Use AI Tutor as a supplement",
    desc: "The AI tutor helps with homework doubts but shouldn't replace classroom learning or teacher guidance.",
  },
  {
    title: "Set a regular study time",
    desc: "Same time each day builds habit. Many families use after-school or before-dinner slots.",
  },
  {
    title: "Stay informed, don't micromanage",
    desc: "Check progress weekly rather than after every lesson. Trust the process and celebrate growth.",
  },
];

function ParentTips() {
  return (
    <ParentLayout title="Parent Tips">
      <div className="page-intro">
        <p>Practical advice to help your child get the most from Ustaad.</p>
      </div>

      {tips.map((tip) => (
        <div key={tip.title} className="ustaad-list-card">
          <h6 className="fw-bold mb-1">{tip.title}</h6>
          <p className="text-muted mb-0 small">{tip.desc}</p>
        </div>
      ))}
    </ParentLayout>
  );
}

export default ParentTips;
