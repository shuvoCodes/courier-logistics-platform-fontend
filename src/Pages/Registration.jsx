import { useState } from "react";
import { baseUrl } from "../services/BaseUrl";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Registration = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fastname: "",
        lastname: "",
        phone: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const resUser = await fetch(`${baseUrl}/Auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const userData = await resUser.json();

            toast.success(userData.Message);

            if (userData.Message === "User Registered Sucessfully.") {
                navigate("/login");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 py-10">

            <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl sm:p-10">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Create Your Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Join our Courier & Logistics Platform
                    </p>
                </div>

                {/* Registration Form */}
                <div>

                    <div className="grid gap-5 sm:grid-cols-2">

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="01XXXXXXXX"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                First Name
                            </label>

                            <input
                                type="text"
                                name="fastname"
                                placeholder="Enter first name"
                                value={formData.fastname}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastname"
                                placeholder="Enter last name"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Password */}
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-7 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? "Loading..." : "Create Account"}
                    </button>

                </div>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </a>
                </p>

            </div>

        </div>
    );
};

export default Registration;
