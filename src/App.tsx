import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reading from './pages/reading/Reading';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ClanDashboard from './pages/social/ClanDashboard';
import Leaderboard from './pages/social/Leaderboard';
import TestDiscussionPage from './pages/discussion/TestDiscussionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/readings" element={<Reading />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/clan" element={<ClanDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/discussion-test" element={<TestDiscussionPage />} />
      </Routes>
    </Router>
  );
}

export default App;