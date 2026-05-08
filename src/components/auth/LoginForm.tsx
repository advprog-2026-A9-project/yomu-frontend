import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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