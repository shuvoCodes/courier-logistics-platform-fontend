import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../Content/AuthProvider";
import { baseUrl } from "../services/BaseUrl";
import { useNavigate } from "react-router";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [saveAccount, setSaveAccount] = useState(false);
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { setAuthUser, setAccessToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setIsLoggingIn(true);

        const formData = new URLSearchParams();

        formData.append("username", userName);
        formData.append("password", password);

        try {
            // =========================
            // Login
            // =========================
            const res = await fetch(`${baseUrl}/Auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            const data = await res.json();

            const refreshToken = data?.refresh_token;
            const accessToken = data?.access_token;

            // Login failed
            if (!res.ok) {
                const message =
                    data?.detail || "Username or password is incorrect!";

                toast.error(message);
                setError(message);
                setIsLoggingIn(false);
                return;
            }

            // =========================
            // Select token
            // =========================
            const token = saveAccount
                ? refreshToken
                : accessToken;

            if (!token) {
                toast.error("Token was not received from server!");
                setIsLoggingIn(false);
                return;
            }

            // Set token in AuthContext
            setAccessToken(token);

            // Save token
            localStorage.setItem("lm_token", token);

            // =========================
            // Get current logged-in user
            // =========================
            const userRes = await fetch(`${baseUrl}/Auth/me`, {
                method: "GET",
                headers: {
                    // /me এর জন্য access token ব্যবহার করতে হবে
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = await userRes.json();

            if (!userRes.ok) {
                const message =
                    userData?.detail ||
                    "Could not get user information!";

                toast.error(message);
                setError(message);
                setIsLoggingIn(false);
                return;
            }

            // =========================
            // User successfully loaded
            // =========================
            if (userData?.id) {
                setAuthUser(userData);

                toast.success("Login successful!");

                navigate("/");
            } else {
                toast.error("Username or password is incorrect!");
                setIsLoggingIn(false);
            }
        } catch (error) {
            console.error("Login error:", error);

            setError("Something went wrong. Please try again.");
            toast.error("Something went wrong. Please try again.");

            setIsLoggingIn(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">

            <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10">

                {/* =========================
                    Loading Overlay
                ========================= */}
                {isLoggingIn && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm">

                        {/* Spinner */}
                        <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>

                        <p className="mt-5 text-lg font-semibold text-slate-800">
                            Logging in...
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Please wait while we prepare your account
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Login to your Courier & Logistics Account
                    </p>

                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="mb-5">

                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={userName}
                            onChange={(e) =>
                                setUserName(e.target.value)
                            }
                            required
                            disabled={isLoggingIn}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />

                    </div>

                    {/* Password */}
                    <div className="mb-6">

                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={isLoggingIn}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />

                    </div>

                    {/* Save Account */}
                    <div className="mb-6 flex items-center gap-2">

                        <input
                            type="checkbox"
                            id="saveAccount"
                            checked={saveAccount}
                            onChange={(e) =>
                                setSaveAccount(e.target.checked)
                            }
                            disabled={isLoggingIn}
                            className="h-4 w-4 accent-blue-600"
                        />

                        <label
                            htmlFor="saveAccount"
                            className="text-sm text-gray-600"
                        >
                            Save Account
                        </label>

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {isLoggingIn ? (
                            <>
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>

                {/* Registration Link */}
                <p className="mt-6 text-center text-sm text-gray-500">

                    Don't have an account?{" "}

                    <a
                        href="/registration"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </a>

                </p>

            </div>

        </div>
    );
};

export default Login;