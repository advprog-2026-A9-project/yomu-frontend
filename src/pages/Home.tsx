import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();


    // Fungsi untuk menghapus sesi
    const handleLogout = () => {
        logout();
        navigate('/'); // Memuat ulang halaman Home
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 font-sans text-center relative">

            {/* Navigasi Auth di Pojok Kanan Atas */}
            <div className="absolute top-6 right-8 flex gap-4 items-center">
                {loading ? (
                    <span className="text-gray-400 text-sm">Checking session...</span>
                ) : isAuthenticated ? (
                    <>
                        <span className="text-gray-400 text-sm">
                            Status: <strong className="text-green-400">Online ({user?.role ?? 'PELAJAR'})</strong>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition text-sm shadow-md"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition text-sm shadow-md">
                            Login
                        </Link>
                        <Link to="/register" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition text-sm shadow-md">
                            Register
                        </Link>
                    </>
                )}
            </div>

            <h1 className="text-5xl font-bold mb-4 text-blue-400">Yomu Dashboard</h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg">
                Selamat datang di proyek Yomu. Pilih modul yang ingin kamu akses di bawah ini.
            </p>

            <div className="grid gap-4 md:grid-cols-3 w-full max-w-4xl">
                {/* Tombol Aktif ke Modul Kamu */}
                <Link to="/readings" className="p-6 bg-blue-800 hover:bg-blue-700 rounded-xl border border-blue-600 transition shadow-lg flex flex-col items-center">
                    <span className="text-2xl mb-2">📚</span>
                    <h2 className="text-xl font-bold">Modul Bacaan & Kuis</h2>
                    <p className="text-sm text-blue-200 mt-2">Dikerjakan oleh Ryan</p>
                </Link>

                {/* Tombol Dummy untuk Modul Lain */}
                <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 opacity-60 cursor-not-allowed flex flex-col items-center">
                    <span className="text-2xl mb-2">🔐</span>
                    <h2 className="text-xl font-bold">Modul Auth</h2>
                    <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
                </div>

                <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 opacity-60 cursor-not-allowed flex flex-col items-center">
                    <span className="text-2xl mb-2">🎮</span>
                    <h2 className="text-xl font-bold">Modul Gamifikasi</h2>
                    <p className="text-sm text-gray-400 mt-2">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}

export default Home;