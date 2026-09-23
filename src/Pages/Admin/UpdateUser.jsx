import { useState } from "react";

import toast from "react-hot-toast";
import { baseUrl } from "../../services/BaseUrl";
import { useLocation, useNavigate, useParams } from "react-router";

const UpdateUser = () => {
    const navigate = useNavigate();
    const { users_id } = useParams();
    const location = useLocation();

    // User data coming from AdminUsers page
    const user = location.state?.user;

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: user?.email || "",
        username: user?.username || "",
        fastname: user?.fastname || "",
        lastname: user?.lastname || "",
        phone: user?.phone || "",
    });

    // =========================
    // Handle Input
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // Update User
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("lm_token");

            const response = await fetch(
                `${baseUrl}/Admin/users/${users_id}/update`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to update user"
                );
            }

            toast.success("User updated successfully!");

            // Back to users page
            navigate("/admin/users");

        } catch (error) {
            console.error(error);

            toast.error(
                error.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // If User Data Not Found
    // =========================
    if (!user) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-5">

                <div className="card bg-base-100 shadow-xl max-w-md w-full">

                    <div className="card-body text-center">

                        <div className="text-6xl mb-3">
                            👤
                        </div>

                        <h2 className="text-2xl font-bold">
                            User Not Found
                        </h2>

                        <p className="text-base-content/60">
                            User information is not available.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/users")
                            }
                            className="btn btn-primary mt-4"
                        >
                            ← Back to Users
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">

            <div className="max-w-4xl mx-auto">

                {/* ================= HEADER ================= */}
                <div className="mb-6">

                    <button
                        onClick={() =>
                            navigate("/admin/users")
                        }
                        className="btn btn-ghost mb-3"
                    >
                        ← Back to Users
                    </button>

                    <h1 className="text-3xl font-bold">
                        User Profile
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        View and update user information.
                    </p>

                </div>

                {/* ================= PROFILE CARD ================= */}
                <div className="card bg-base-100 shadow-xl">

                    <div className="card-body">

                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b">

                            <div className="avatar placeholder">

                                <div className="bg-primary text-primary-content rounded-full w-24 h-24">

                                    <span className="text-4xl">
                                        {(
                                            user.username ||
                                            user.email ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                </div>

                            </div>

                            <div className="text-center sm:text-left">

                                <h2 className="text-2xl font-bold">
                                    {user.username || "User"}
                                </h2>

                                <p className="text-base-content/60">
                                    {user.email}
                                </p>

                                <div className="flex gap-2 mt-2 justify-center sm:justify-start">

                                    <span className="badge badge-primary">
                                        {user.role || "user"}
                                    </span>

                                    {user.is_active ? (

                                        <span className="badge badge-success">
                                            Active
                                        </span>

                                    ) : (

                                        <span className="badge badge-error">
                                            Inactive
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>

                        {/* ================= USER INFORMATION ================= */}

                        <div className="mt-6">

                            <h3 className="text-xl font-bold mb-4">
                                User Information
                            </h3>

                            <form onSubmit={handleSubmit}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* User ID */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                User ID
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={user.id}
                                            className="input input-bordered bg-base-200"
                                            disabled
                                        />

                                    </div>

                                    {/* Email */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Email
                                            </span>
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                            required
                                        />

                                    </div>

                                    {/* Username */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Username
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                            required
                                        />

                                    </div>

                                    {/* First Name */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                First Name
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="fastname"
                                            value={formData.fastname}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                        />

                                    </div>

                                    {/* Last Name */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Last Name
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                        />

                                    </div>

                                    {/* Phone */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Phone
                                            </span>
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input input-bordered"
                                            placeholder="01XXXXXXXXX"
                                        />

                                    </div>

                                    {/* Role */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Role
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={user.role || "user"}
                                            className="input input-bordered bg-base-200"
                                            disabled
                                        />

                                    </div>

                                    {/* Status */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Status
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                user.is_active
                                                    ? "Active"
                                                    : "Inactive"
                                            }
                                            className="input input-bordered bg-base-200"
                                            disabled
                                        />

                                    </div>

                                    {/* Created At */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Created At
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                user.create_at
                                                    ? new Date(
                                                        user.create_at
                                                    ).toLocaleString()
                                                    : "N/A"
                                            }
                                            className="input input-bordered bg-base-200"
                                            disabled
                                        />

                                    </div>

                                </div>

                                {/* ================= BUTTONS ================= */}

                                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-5 border-t">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/admin/users")
                                        }
                                        className="btn btn-outline"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >

                                        {loading ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                ✏️ Update User
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default UpdateUser;