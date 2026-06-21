import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

import Welcome from "./pages/onboarding/Welcome";
import Auth from "./pages/onboarding/Auth";
import CreateProfile from "./pages/onboarding/CreateProfile";
import Assessment from "./pages/onboarding/Assessment";
import PersonalPlan from "./pages/onboarding/PersonalPlan";
import MeetAiTutor from "./pages/onboarding/MeetAiTutor";

import Dashboard from "./pages/app/Dashboard";
import DailyChallenge from "./pages/app/DailyChallenge";
import LearningPath from "./pages/app/LearningPath";
import SelectChapter from "./pages/app/SelectChapter";
import MicroLearning from "./pages/app/MicroLearning";
import RealWorldApplications from "./pages/app/RealWorldApplications";
import PracticeTest from "./pages/app/PracticeTest";
import AskAiTutor from "./pages/app/AskAiTutor";
import LessonCompleted from "./pages/app/LessonCompleted";
import Streak from "./pages/app/Streak";
import Leaderboard from "./pages/app/Leaderboard";
import Community from "./pages/app/Community";
import StudyLoungeRoom from "./pages/app/StudyLoungeRoom";
import Analytics from "./pages/app/Analytics";
import Recommendations from "./pages/app/Recommendations";
import CareerExplorer from "./pages/app/CareerExplorer";
import CareerRoadmap from "./pages/app/CareerRoadmap";
import SkillDevelopment from "./pages/app/SkillDevelopment";
import TheoryLab from "./pages/app/TheoryLab";
import BoardFAQ from "./pages/app/BoardFAQ";
import WeeklyTargets from "./pages/app/WeeklyTargets";
import Rewards from "./pages/app/Rewards";
import Scholarships from "./pages/app/Scholarships";
import BecomeUstaad from "./pages/app/BecomeUstaad";
import EditProfile from "./pages/app/EditProfile";
import InfoPage from "./pages/info/InfoPage";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminContent from "./pages/admin/AdminContent";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminChallenges from "./pages/admin/AdminChallenges";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminAiInsights from "./pages/admin/AdminAiInsights";
import AdminAdmins from "./pages/admin/AdminAdmins";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import AdminParents from "./pages/admin/AdminParents";
import AdminSkillsCareers from "./pages/admin/AdminSkillsCareers";
import AdminTheoryLab from "./pages/admin/AdminTheoryLab";
import AdminBoardFaq from "./pages/admin/AdminBoardFaq";
import AdminWeeklyTargets from "./pages/admin/AdminWeeklyTargets";
import AdminStreakOverview from "./pages/admin/AdminStreakOverview";
import AdminChapterQuestions from "./pages/admin/AdminChapterQuestions";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRoute from "./components/AdminRoute";

import ParentLogin from "./pages/parent/ParentLogin";
import ParentSignup from "./pages/parent/ParentSignup";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentLinkChild from "./pages/parent/ParentLinkChild";
import ParentChildReport from "./pages/parent/ParentChildReport";
import ParentReports from "./pages/parent/ParentReports";
import ParentTips from "./pages/parent/ParentTips";
import ParentActivity from "./pages/parent/ParentActivity";
import ParentProgress from "./pages/parent/ParentProgress";
import ParentLeaderboard from "./pages/parent/ParentLeaderboard";
import ParentRewards from "./pages/parent/ParentRewards";
import ParentChallenges from "./pages/parent/ParentChallenges";
import ParentNotifications from "./pages/parent/ParentNotifications";
import ParentSettings from "./pages/parent/ParentSettings";
import ParentHelp from "./pages/parent/ParentHelp";
import ParentChildAnalytics from "./pages/parent/ParentChildAnalytics";
import ParentChildTargets from "./pages/parent/ParentChildTargets";
import ParentChildSkills from "./pages/parent/ParentChildSkills";
import ParentChildCommunity from "./pages/parent/ParentChildCommunity";
import ParentRoute from "./components/ParentRoute";

const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;
const admin = (element) => <AdminRoute>{element}</AdminRoute>;
const parent = (element) => <ParentRoute>{element}</ParentRoute>;

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about/:slug" element={<InfoPage />} />
        <Route path="/products/:slug" element={<InfoPage />} />
        <Route path="/apps/:slug" element={<InfoPage />} />
        <Route path="/help/:slug" element={<InfoPage />} />
        <Route path="/legal/:slug" element={<InfoPage />} />
        <Route path="/social/:slug" element={<InfoPage />} />

        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/profile" element={protect(<CreateProfile />)} />
        <Route path="/assessment" element={protect(<Assessment />)} />
        <Route path="/personal-plan" element={protect(<PersonalPlan />)} />
        <Route path="/meet-tutor" element={protect(<MeetAiTutor />)} />

        <Route path="/dashboard" element={protect(<Dashboard />)} />
        <Route path="/daily-challenge" element={protect(<DailyChallenge />)} />
        <Route path="/learning-path" element={protect(<LearningPath />)} />
        <Route path="/theory-lab" element={protect(<TheoryLab />)} />
        <Route path="/board-faq" element={protect(<BoardFAQ />)} />
        <Route path="/weekly-targets" element={protect(<WeeklyTargets />)} />
        <Route path="/chapter/:subject" element={protect(<SelectChapter />)} />
        <Route path="/lesson/:chapterId" element={protect(<MicroLearning />)} />
        <Route path="/real-world/:chapterId" element={protect(<RealWorldApplications />)} />
        <Route path="/practice/:chapterId" element={protect(<PracticeTest />)} />
        <Route path="/ai-tutor" element={protect(<AskAiTutor />)} />
        <Route path="/lesson-complete" element={protect(<LessonCompleted />)} />
        <Route path="/streak" element={protect(<Streak />)} />
        <Route path="/leaderboard" element={protect(<Leaderboard />)} />
        <Route path="/community" element={protect(<Community />)} />
        <Route path="/community/:loungeId" element={protect(<StudyLoungeRoom />)} />
        <Route path="/analytics" element={protect(<Analytics />)} />
        <Route path="/recommendations" element={protect(<Recommendations />)} />
        <Route path="/career-explorer" element={protect(<CareerExplorer />)} />
        <Route path="/career/:careerId" element={protect(<CareerRoadmap />)} />
        <Route path="/skills" element={protect(<SkillDevelopment />)} />
        <Route path="/rewards" element={protect(<Rewards />)} />
        <Route path="/scholarships" element={protect(<Scholarships />)} />
        <Route path="/edit-profile" element={protect(<EditProfile />)} />
        <Route path="/become-ustaad" element={protect(<BecomeUstaad />)} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin" element={admin(<AdminDashboard />)} />
        <Route path="/admin/analytics" element={admin(<AdminAnalytics />)} />
        <Route path="/admin/users" element={admin(<AdminUsers />)} />
        <Route path="/admin/users/:userId" element={admin(<AdminUserDetail />)} />
        <Route path="/admin/parents" element={admin(<AdminParents />)} />
        <Route path="/admin/skills-careers" element={admin(<AdminSkillsCareers />)} />
        <Route path="/admin/leaderboard" element={admin(<AdminLeaderboard />)} />
        <Route path="/admin/questions" element={admin(<AdminQuestions />)} />
        <Route path="/admin/challenges" element={admin(<AdminChallenges />)} />
        <Route path="/admin/content" element={admin(<AdminContent />)} />
        <Route path="/admin/chapter-questions" element={admin(<AdminChapterQuestions />)} />
        <Route path="/admin/theory-lab" element={admin(<AdminTheoryLab />)} />
        <Route path="/admin/board-faq" element={admin(<AdminBoardFaq />)} />
        <Route path="/admin/weekly-targets" element={admin(<AdminWeeklyTargets />)} />
        <Route path="/admin/streak" element={admin(<AdminStreakOverview />)} />
        <Route path="/admin/rewards" element={admin(<AdminRewards />)} />
        <Route path="/admin/community" element={admin(<AdminCommunity />)} />
        <Route path="/admin/ai-insights" element={admin(<AdminAiInsights />)} />
        <Route path="/admin/admins" element={admin(<AdminAdmins />)} />
        <Route path="/admin/settings" element={admin(<AdminSettings />)} />

        <Route path="/parent/login" element={<ParentLogin />} />
        <Route path="/parent/signup" element={<ParentSignup />} />
        <Route path="/parent" element={parent(<ParentDashboard />)} />
        <Route path="/parent/link" element={parent(<ParentLinkChild />)} />
        <Route path="/parent/reports" element={parent(<ParentReports />)} />
        <Route path="/parent/notifications" element={parent(<ParentNotifications />)} />
        <Route path="/parent/progress" element={parent(<ParentProgress />)} />
        <Route path="/parent/activity" element={parent(<ParentActivity />)} />
        <Route path="/parent/challenges" element={parent(<ParentChallenges />)} />
        <Route path="/parent/leaderboard" element={parent(<ParentLeaderboard />)} />
        <Route path="/parent/rewards" element={parent(<ParentRewards />)} />
        <Route path="/parent/tips" element={parent(<ParentTips />)} />
        <Route path="/parent/settings" element={parent(<ParentSettings />)} />
        <Route path="/parent/help" element={parent(<ParentHelp />)} />
        <Route path="/parent/child/:studentId" element={parent(<ParentChildReport />)} />
        <Route path="/parent/child/:studentId/analytics" element={parent(<ParentChildAnalytics />)} />
        <Route path="/parent/child/:studentId/targets" element={parent(<ParentChildTargets />)} />
        <Route path="/parent/child/:studentId/skills" element={parent(<ParentChildSkills />)} />
        <Route path="/parent/child/:studentId/community" element={parent(<ParentChildCommunity />)} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
