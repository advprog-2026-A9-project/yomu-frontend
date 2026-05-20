import { useState } from "react";
import { registerUser } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, Lock, Mail, Phone, UserCircle2 } from "lucide-react";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


const RegisterForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        if (!username) {
            setError("Username harus diisi");
            return;
        }
        if (!email && !phoneNumber) {
            setError("Email atau nomor HP harus diisi");
            return;
        }
        if (email && !EMAIL_REGEX.test(email.trim())) {
            setError("Format email tidak valid. Contoh: example@gmail.com");
            return;
        }
        try {
            await registerUser({
                username,
                email: email.trim() || undefined,
                phoneNumber: phoneNumber.trim() || undefined,
                displayName,
                password,
            });
            setSuccess("Registrasi berhasil! Silakan login.");
            setTimeout(() => navigate("/login"), 1500);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registrasi gagal");
        }
    };

    return (
        <article className="yomu-card w-full animate-fade-rise p-6 shadow-2xl sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="yomu-badge">Buat Akun Baru</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Gabung ke komunitas Yomu</h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100/80">
                        Buat akun untuk mengikuti bacaan, berkontribusi di forum, dan naik tier bersama clan.
                    </p>
                </div>
                <div className="hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200 sm:block">
                    <BadgeCheck size={22} />
                </div>
            </div>

            {error && (
                <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {success}
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
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">Username</span>
                    <div className="relative">
                        <UserCircle2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
                        <input
                            type="text"
                            placeholder="Pilih username"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                        />
                    </div>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">Email</span>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
                            <input
                                type="email"
                                placeholder="Email (opsional)"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                            />
                        </div>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">Nomor HP</span>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
                            <input
                                type="text"
                                placeholder="Nomor HP (opsional)"
                                value={phoneNumber}
                                autoComplete="tel"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                            />
                        </div>
                    </label>
                </div>

                <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">Display Name</span>
                    <input
                        type="text"
                        placeholder="Nama tampil di komunitas"
                        value={displayName}
                        autoComplete="name"
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-100/60">Password</span>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
                        <input
                            type="password"
                            placeholder="Buat password yang aman"
                            value={password}
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-indigo-100/35 outline-none transition focus:border-indigo-400/60 focus:bg-white/10"
                        />
                    </div>
                </label>

                <button type="submit" className="yomu-button-primary w-full gap-2">
                    Daftar
                    <ArrowRight size={18} />
                </button>
            </form>

            <p className="mt-6 text-sm text-indigo-100/75">
                Sudah punya akun?{' '}
                <a href="/login" className="font-semibold text-indigo-200 underline decoration-indigo-300/40 underline-offset-4">
                    Login di sini
                </a>
            </p>
        </article>
    );
};

export default RegisterForm;