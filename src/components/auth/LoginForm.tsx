import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, BadgeCheck, Lock, Mail } from "lucide-react";

const LoginForm = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("");
        if (!identifier) {
            setError("Username/Email/HP harus diisi");
            return;
        }
        if (!password) {
            setError("Password harus diisi");
            return;
        }
        try {
            await login({ identifier, password });
            navigate("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login gagal");
        }
    };

    const handleGoogleLogin = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    };

    return (
        <article className="yomu-card w-full animate-fade-rise p-6 shadow-2xl sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="yomu-badge">Akses Pelajar</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Masuk ke ekosistem belajar</h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100/80">
                        Lanjutkan progres bacaan, misi harian, dan posisi clan dari sesi terakhir kamu.
                    </p>
                </div>
                <div className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200 sm:block">
                    <BadgeCheck size={22} />
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                </div>
            )}

            <form
                className="mt-6 space-y-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                }}
            >
                <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">
                        Username / Email / HP
                    </span>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
                        <input
                            type="text"
                            placeholder="Masukkan identitas akun"
                            value={identifier}
                            autoComplete="username"
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                        />
                    </div>
                </label>

                <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">Password</span>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
                        <input
                            type="password"
                            placeholder="Masukkan password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                        />
                    </div>
                </label>

                <button type="submit" className="yomu-button-primary w-full gap-2">
                    Login
                    <ArrowRight size={18} />
                </button>

                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-indigo-100/35">
                    <span className="h-px flex-1 bg-white/10" />
                    atau
                    <span className="h-px flex-1 bg-white/10" />
                </div>

                <button type="button" onClick={handleGoogleLogin} className="yomu-button-secondary w-full gap-2">
                    Login dengan Google
                </button>
            </form>

            <p className="mt-6 text-sm text-indigo-100/75">
                Belum punya akun?{' '}
                <Link to="/register" className="font-semibold text-indigo-200 underline decoration-indigo-300/40 underline-offset-4">
                    Daftar sekarang
                </Link>
            </p>
        </article>
    );
};

export default LoginForm;