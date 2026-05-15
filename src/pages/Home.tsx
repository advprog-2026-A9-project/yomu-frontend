import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from './landing/LandingPage';
import DashboardHome from './dashboard/DashboardHome';

function Home() {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="yomu-shell yomu-grid-noise flex items-center justify-center px-6">
                <div className="yomu-glass rounded-2xl px-6 py-5 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-300/30 border-t-indigo-300" />
                    <p className="mt-3 text-sm text-indigo-100/80">Menyiapkan pengalaman belajar kamu...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleLogout}
                className="fixed right-4 top-4 z-40 rounded-xl border border-red-300/30 bg-red-500/20 px-4 py-2 text-xs font-bold text-red-100 backdrop-blur hover:bg-red-500/30"
            >
                Logout ({user?.role ?? 'PELAJAR'})
            </button>
            <DashboardHome username={user?.username || 'Pelajar'} loading={false} />
        </div>
    );
}

export default Home;