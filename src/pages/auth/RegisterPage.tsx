import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
    return (
        <div className="yomu-shell yomu-grid-noise flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <aside className="animate-fade-rise space-y-6 lg:order-2">
                    <div className="max-w-xl">
                        <span className="yomu-badge">Mulai Perjalanan</span>
                        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                            Buat akun dan masuk ke sistem belajar yang lebih hidup.
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-6 text-indigo-100/80 sm:text-base">
                            Dengan satu akun kamu bisa ikut bacaan, forum diskusi, clan, leaderboard, dan misi harian yang saling terhubung.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="yomu-card p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/50">Forum</p>
                            <p className="mt-2 text-2xl font-black text-white">Aktif</p>
                            <p className="mt-1 text-sm text-indigo-100/75">Diskusi terstruktur</p>
                        </div>
                        <div className="yomu-card p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/50">Badge</p>
                            <p className="mt-2 text-2xl font-black text-white">24</p>
                            <p className="mt-1 text-sm text-indigo-100/75">Achievement siap dibuka</p>
                        </div>
                        <div className="yomu-card p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/50">Clan</p>
                            <p className="mt-2 text-2xl font-black text-white">Naik Tier</p>
                            <p className="mt-1 text-sm text-indigo-100/75">Progress komunitas</p>
                        </div>
                    </div>
                </aside>

                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;