import { useState } from "react";
import { registerUser } from "../../services/authAPI";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const RegisterForm = () => {
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
                email: email.trim() || null,
                phoneNumber: phoneNumber.trim() || null,
                displayName,
                password,
            });
            setSuccess("Registrasi berhasil! Silakan login.");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registrasi gagal");
        }
    };

    return (
        <div className="register-form">
            <h2>Daftar Akun</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email (opsional jika pakai HP)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nomor HP (opsional jika pakai email)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Daftar</button>
        </div>
    );
};

export default RegisterForm;