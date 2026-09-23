import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { baseUrl } from "../../services/BaseUrl";


const TrackingUsers = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [updateData, setUpdateData] = useState({
        email: "",
        username: "",
        fastname: "",
        lastname: "",
        phone: "",
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
    });

    const [forgotEmail, setForgotEmail] = useState("");

    const [resetData, setResetData] = useState({
        token: "",
        new_password: "",
    });

    const token = localStorage.getItem("lm_token");

    // =========================
    // Get Current User
    // =========================
    const getCurrentUser = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${baseUrl}/Auth/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Failed to get user information");
            }

            setUser(data);

            setUpdateData({
                email: data.email || "",
                username: data.username || "",
                fastname: data.fastname || "",
                lastname: data.lastname || "",
                phone: data.phone || "",
            });

            setForgotEmail(data.email || "");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Start the request asynchronously so the effect does not synchronously
        // trigger state updates during its execution.
        const loadUser = async () => {
            await getCurrentUser();
        };

        loadUser();
    }, [getCurrentUser, navigate, token]);

    // =========================
    // Update Profile
    // =========================
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setMessage("");
            setError("");

            const res = await fetch(`${baseUrl}/Auth/update/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Profile update failed");
            }

            setMessage("Profile updated successfully!");

            // Reload current user
            getCurrentUser();
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // Change Password
    // =========================
    const handleChangePassword = async (e) => {
        e.preventDefault();

        try {
            setMessage("");
            setError("");

            const res = await fetch(`${baseUrl}/Auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(passwordData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Password change failed");
            }

            setMessage("Password changed successfully!");

            setPasswordData({
                current_password: "",
                new_password: "",
            });
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // Forgot Password
    // =========================
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            setMessage("");
            setError("");

            const res = await fetch(`${baseUrl}/Auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: forgotEmail,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Forgot password request failed");
            }

            setMessage(
                "Password reset request sent successfully. Check your email."
            );
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // Reset Password
    // =========================
    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            setMessage("");
            setError("");

            const res = await fetch(`${baseUrl}/Auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resetData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Password reset failed");
            }

            setMessage("Password reset successfully!");

            setResetData({
                token: "",
                new_password: "",
            });
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // Deactivate Account
    // =========================
    const handleDeactivate = async () => {
        const confirmDeactivate = window.confirm(
            "Are you sure you want to deactivate your account?"
        );

        if (!confirmDeactivate) return;

        try {
            setMessage("");
            setError("");

            const res = await fetch(`${baseUrl}/Auth/me/deactivate`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Account deactivation failed");
            }

            setMessage("Your account has been deactivated.");

            localStorage.removeItem("lm_token");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    // =========================
    // Delete Account
    // =========================
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete your account? This action cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            setMessage("");
            setError("");

            const res = await fetch(`${baseUrl}/Auth/me/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Account deletion failed");
            }

            localStorage.removeItem("lm_token");

            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl font-semibold">
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    Unable to load profile.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-5xl mx-auto">

                {/* ================= HEADER ================= */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                    <div className="flex flex-col md:flex-row items-center gap-5">

                        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {user.fastname} {user.lastname}
                            </h1>

                            <p className="text-gray-500 mt-1">
                                @{user.username}
                            </p>

                            <div className="flex gap-2 mt-3 justify-center md:justify-start">

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        user.role === "admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                    {user.role}
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        user.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {user.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>
                        </div>

                    </div>
                </div>

                {/* ================= MESSAGE ================= */}

                {message && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-5">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                {/* ================= PROFILE INFORMATION ================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        Profile Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label className="block font-semibold mb-2">
                                User ID
                            </label>

                            <input
                                type="text"
                                value={user.id}
                                disabled
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Role
                            </label>

                            <input
                                type="text"
                                value={user.role}
                                disabled
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                            />
                        </div>

                    </div>

                </div>

                {/* ================= UPDATE PROFILE ================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        Update Profile
                    </h2>

                    <form onSubmit={handleUpdate}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block font-semibold mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={updateData.email}
                                    onChange={(e) =>
                                        setUpdateData({
                                            ...updateData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={updateData.username}
                                    onChange={(e) =>
                                        setUpdateData({
                                            ...updateData,
                                            username: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    value={updateData.fastname}
                                    onChange={(e) =>
                                        setUpdateData({
                                            ...updateData,
                                            fastname: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    value={updateData.lastname}
                                    onChange={(e) =>
                                        setUpdateData({
                                            ...updateData,
                                            lastname: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    value={updateData.phone}
                                    onChange={(e) =>
                                        setUpdateData({
                                            ...updateData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Update Profile
                        </button>

                    </form>
                </div>

                {/* ================= CHANGE PASSWORD ================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                    <h2 className="text-2xl font-bold text-gray-800 mb-5">
                        Change Password
                    </h2>

                    <form onSubmit={handleChangePassword}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block font-semibold mb-2">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            current_password: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-2">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            new_password: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-3"
                                    required
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Change Password
                        </button>

                    </form>

                </div>

                {/* ================= FORGOT PASSWORD ================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Forgot Password
                    </h2>

                    <p className="text-gray-500 mb-5">
                        Enter your email to receive a password reset request.
                    </p>

                    <form onSubmit={handleForgotPassword}>

                        <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) =>
                                setForgotEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            className="w-full border rounded-lg px-4 py-3 mb-4"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Send Reset Request
                        </button>

                    </form>

                </div>

                {/* ================= RESET PASSWORD ================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Reset Password
                    </h2>

                    <p className="text-gray-500 mb-5">
                        Enter the reset token received through email.
                    </p>

                    <form onSubmit={handleResetPassword}>

                        <div className="mb-4">

                            <label className="block font-semibold mb-2">
                                Reset Token
                            </label>

                            <input
                                type="text"
                                value={resetData.token}
                                onChange={(e) =>
                                    setResetData({
                                        ...resetData,
                                        token: e.target.value,
                                    })
                                }
                                placeholder="Enter reset token"
                                className="w-full border rounded-lg px-4 py-3"
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="block font-semibold mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={resetData.new_password}
                                onChange={(e) =>
                                    setResetData({
                                        ...resetData,
                                        new_password: e.target.value,
                                    })
                                }
                                placeholder="Enter new password"
                                className="w-full border rounded-lg px-4 py-3"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Reset Password
                        </button>

                    </form>

                </div>

                {/* ================= DANGER ZONE ================= */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-red-200">

                    <h2 className="text-2xl font-bold text-red-600 mb-5">
                        Danger Zone
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">

                        <button
                            onClick={handleDeactivate}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Deactivate Account
                        </button>

                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Delete Account
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default TrackingUsers;