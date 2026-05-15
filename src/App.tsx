import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReadingList from './pages/reading/ReadingList.tsx';
import ReadingDetail from './pages/reading/ReadingDetail.tsx';
import ReadingQuiz from './pages/reading/ReadingQuiz.tsx';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import TestDiscussionPage from './pages/discussion/TestDiscussionPage';
import ClanPageContainer from './pages/social/ClanPageContainer';
import ClanFormPage from './pages/social/ClanFormPage';
import ClanDiscoverPage from './pages/social/ClanDiscoverPage';
import ClanLeaderboardPage from './pages/social/ClanLeaderboardPage';

// Placeholder for coming soon pages
function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-slate-950/70 text-white flex items-center justify-center p-4">
      <div className="yomu-card max-w-md w-full space-y-4 text-center">
        <h2 className="text-3xl font-bold">Coming Soon</h2>
        <p className="text-indigo-100/70">This feature is under development.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/readings" element={<ReadingList />} />
        <Route path="/readings/:id" element={<ReadingDetail />} />
        <Route path="/readings/:id/quiz" element={<ReadingQuiz />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Clan routes */}
        <Route path="/clan" element={<ClanPageContainer />} />
        <Route path="/clan/create" element={<ClanFormPage />} />
        <Route path="/clan/:id/edit" element={<ClanFormPage />} />
        <Route path="/discover-clans" element={<ClanDiscoverPage />} />
        <Route path="/leaderboard" element={<ClanLeaderboardPage />} />


        {/* Leaderboard */}

        {/* Forum */}
        <Route path="/discussion-test" element={<TestDiscussionPage />} />

        {/* Coming soon pages */}
        <Route path="/missions" element={<ComingSoonPage />} />
        <Route path="/achievements" element={<ComingSoonPage />} />
        <Route path="/league" element={<ComingSoonPage />} />
        <Route path="/profile" element={<ComingSoonPage />} />
        <Route path="/settings" element={<ComingSoonPage />} />
      </Routes>
    </Router>
  );
}

export default App;