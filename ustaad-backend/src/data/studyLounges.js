export const studyLounges = [
  {
    id: "cbse12",
    name: "CBSE Class 12 Study Group",
    type: "Group",
    topic: "All Class 12 subjects",
    activity: "Share doubts, notes, and exam tips with CBSE classmates",
    baseOnline: 180,
    challenge: "Complete 1 chapter quest today and post your score here!",
    icon: "👥",
  },
  {
    id: "math-battle",
    name: "Math Battle Arena",
    type: "Subject Battle",
    topic: "Mathematics · Algebra, Calculus, Probability",
    activity: "Solve practice problems and compare solutions",
    baseOnline: 72,
    challenge: "Try the Matrices chapter quest — who gets 100% first?",
    icon: "📐",
  },
  {
    id: "physics-room",
    name: "Physics Study Room",
    type: "Study Room",
    topic: "Physics · Electrostatics, Optics, Modern Physics",
    activity: "Discuss numericals and concept checks",
    baseOnline: 38,
    challenge: "Explain Ohm's law in your own words in the chat!",
    icon: "⚛️",
  },
  {
    id: "team-quiz",
    name: "Team Challenge: Weekly Quiz",
    type: "Team Challenge",
    topic: "Mixed CBSE syllabus",
    activity: "Team up for the weekly quiz target together",
    baseOnline: 95,
    challenge: "Finish today's daily challenge as a team goal!",
    icon: "🏆",
  },
];

export function findStudyLounge(loungeId) {
  return studyLounges.find((lounge) => lounge.id === loungeId);
}
