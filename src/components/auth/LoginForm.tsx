import { useState } from "react";
import { loginUser } from "../../services/authAPI";

const LoginForm = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
            const response = await loginUser({ identifier, password });
            localStorage.setItem("token", response.token);
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("role", response.role);
            window.location.href = "/";
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login gagal");
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Username / Email / Nomor HP"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Login</button>
        </div>
    );
};

export default LoginForm;