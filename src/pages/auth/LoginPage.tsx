import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
    return (
        <div className="yomu-shell yomu-grid-noise flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <aside className="animate-fade-rise space-y-6">
                    <div className="max-w-xl">
                        <span className="yomu-badge">Selamat Datang Kembali</span>
                        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                            Lanjutkan progres belajar tanpa kehilangan ritme.
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100/80 sm:text-base">
                            Masuk untuk melanjutkan bacaan, kuis, misi harian, dan kontribusi komunitas dari posisi terakhir kamu.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="yomu-card p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/50">Bacaan</p>
                            <p className="mt-2 text-2xl font-black text-white">120+</p>
                            <p className="mt-1 text-sm text-indigo-100/75">Modul aktif</p>
                        </div>
                        <div className="yomu-card p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/50">Clan</p>
                            <p className="mt-2 text-2xl font-black text-white">48</p>
                            <p className="mt-1 text-sm text-indigo-100/75">Komunitas terdaftar</p>
                        </div>
                        <div className="yomu-card p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/50">Streak</p>
                            <p className="mt-2 text-2xl font-black text-white">7 hari</p>
                            <p className="mt-1 text-sm text-indigo-100/75">Progress konsisten</p>
                        </div>
                    </div>
                </aside>

                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;