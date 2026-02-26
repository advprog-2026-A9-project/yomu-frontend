import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 font-sans text-center">
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