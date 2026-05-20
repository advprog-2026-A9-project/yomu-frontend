import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OAuth2CallbackPage = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            refreshUser().then(() => {
                navigate("/");
            });
        } else {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <p>Memproses login Google...</p>
        </div>
    );
};

export default OAuth2CallbackPage;