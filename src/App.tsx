import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ReadingList from './pages/reading/ReadingList.tsx';
import ReadingDetail from './pages/reading/ReadingDetail.tsx';
import ReadingQuiz from './pages/reading/ReadingQuiz.tsx';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ClanPageContainer from './pages/social/ClanPageContainer';
import ClanFormPage from './pages/social/ClanFormPage';
import ClanDiscoverPage from './pages/social/ClanDiscoverPage';
import ClanLeaderboardPage from './pages/social/ClanLeaderboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLeaguePage from './pages/admin/AdminLeaguePage';
import AdminAchievementsPage from './pages/admin/AdminAchievementsPage';
import AdminDailyMissionsPage from './pages/admin/AdminDailyMissionsPage';
import AdminReadingsPage from './pages/admin/AdminReadingsPage.tsx';
import AdminQuizBuilderPage from './pages/admin/AdminQuizBuilderPage.tsx';
import AchievementsPage from './pages/gamification/AchievementsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ForumListPage from './pages/discussion/ForumListPage';
import ForumDetailPage from './pages/discussion/ForumDetailPage';
import TestDiscussionPage from './pages/discussion/ForumDetailPage.tsx';
import { useAuth } from './context/AuthContext';

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

function AdminRoute({ children }: { children: React.ReactNode }) {
    const { loading, isAuthenticated, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="yomu-shell yomu-grid-noise flex min-h-screen items-center justify-center px-6">
                <div className="yomu-glass rounded-2xl px-6 py-5 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-300/30 border-t-indigo-300" />
                    <p className="mt-3 text-sm text-indigo-100/80">Mengecek akses admin...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="yomu-shell yomu-grid-noise flex min-h-screen items-center justify-center px-6">
                <div className="yomu-glass rounded-2xl px-6 py-5 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-300/30 border-t-indigo-300" />
                    <p className="mt-3 text-sm text-indigo-100/80">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />

                {/* ==================================
                Rute Khusus Administrator
                ================================== */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    }
                >
                    <Route index element={<Navigate to="league" replace />} />
                    <Route path="league" element={<AdminLeaguePage />} />
                    <Route path="achievements" element={<AdminAchievementsPage />} />
                    <Route path="daily-missions" element={<AdminDailyMissionsPage />} />
                    {/* Rute Admin Modul Reading */}
                    <Route path="readings" element={<AdminReadingsPage />} />
                    <Route path="readings/:id/quiz-builder" element={<AdminQuizBuilderPage />} />
                </Route>

                {/* ==================================
                Rute Pelajar / Umum
                ================================== */}
                
                {/* Reading Routes */}
                <Route path="/readings" element={<ReadingList />} />
                <Route path="/readings/:id" element={<ReadingDetail />} />
                <Route path="/readings/:id/quiz" element={<ReadingQuiz />} />

                {/* Auth Routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Clan routes */}
                <Route path="/clan" element={<ProtectedRoute><ClanPageContainer /></ProtectedRoute>} />
                <Route path="/clan/create" element={<ProtectedRoute><ClanFormPage /></ProtectedRoute>} />
                <Route path="/clan/:id/edit" element={<ProtectedRoute><ClanFormPage /></ProtectedRoute>} />
                <Route path="/discover-clans" element={<ProtectedRoute><ClanDiscoverPage /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><ClanLeaderboardPage /></ProtectedRoute>} />

                {/* Forum Routes (Dari Staging & Feat) */}
                <Route path="/forum" element={<ProtectedRoute><ForumListPage /></ProtectedRoute>} />
                <Route path="/forum/:readingId" element={<ProtectedRoute><ForumDetailPage /></ProtectedRoute>} />
                <Route path="/discussion-test" element={<TestDiscussionPage />} />

                {/* Gamification & Profile Routes (Dari Staging) */}
                <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                <Route path="/settings" element={<ComingSoonPage />} />
            </Routes>
        </Router>
    );
}

export default App;