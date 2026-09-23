import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { baseUrl } from "../../services/BaseUrl";

const UpdateParcelUsers = () => {
    const { parcelId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        receiver_name: "",
        receiver_phone: "",
        pickup_address: "",
        delivery_address: "",
        category: "",
        weight: "",
        delivery_fee: "",
        status: "pending",
    });

    // =========================
    // Fetch Parcel Data
    // =========================
    const fetchParcel = useCallback(async () => {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("lm_token");

        if (!token) {
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${baseUrl}/parcels/${parcelId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to fetch parcel"
                );
            }

            setFormData({
                receiver_name: data.receiver_name || "",
                receiver_phone: data.receiver_phone || "",
                pickup_address: data.pickup_address || "",
                delivery_address: data.delivery_address || "",
                category: data.category || "",
                weight: data.weight ?? "",
                delivery_fee: data.delivery_fee ?? "",
                status: data.status || "pending",
            });

        } catch (error) {
            console.error("Fetch parcel error:", error);
            setError(error.message || "Failed to load parcel");
        } finally {
            setLoading(false);
        }
    }, [parcelId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            void fetchParcel();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [fetchParcel]);

    // =========================
    // Handle Input Change
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // Update Parcel
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const token = localStorage.getItem("lm_token");

        if (!token) {
            setError("Authentication token not found.");
            setSaving(false);
            return;
        }

        try {
            const response = await fetch(
                `${baseUrl}/parcels/update/${parcelId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        receiver_name: formData.receiver_name,
                        receiver_phone: formData.receiver_phone,
                        pickup_address: formData.pickup_address,
                        delivery_address: formData.delivery_address,
                        category: formData.category,
                        weight: Number(formData.weight),
                        delivery_fee: Number(formData.delivery_fee),
                        status: formData.status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to update parcel"
                );
            }

            setSuccess("Parcel updated successfully!");

            setTimeout(() => {
                navigate("/admin/allparcels");
            }, 1000);

        } catch (error) {
            console.error("Update parcel error:", error);
            setError(error.message || "Failed to update parcel");
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Loading
    // =========================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/allparcels")}
                        className="btn btn-ghost btn-sm mb-3"
                    >
                        ← Back to Parcels
                    </button>

                    <h1 className="text-2xl md:text-3xl font-bold">
                        Update Parcel
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        Update parcel information
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error mb-5">
                        <span>{error}</span>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="alert alert-success mb-5">
                        <span>{success}</span>
                    </div>
                )}

                {/* Form Card */}
                <div className="card bg-base-100 shadow-lg">

                    <div className="card-body">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Parcel ID */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-base-content/60">
                                    Parcel ID
                                </p>

                                <p className="font-bold text-lg">
                                    #{parcelId}
                                </p>
                            </div>

                            {/* Receiver Information */}
                            <div>

                                <h2 className="font-bold text-lg mb-4">
                                    Receiver Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Receiver Name
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="receiver_name"
                                            value={formData.receiver_name}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Receiver Phone
                                            </span>
                                        </label>

                                        <input
                                            type="tel"
                                            name="receiver_phone"
                                            value={formData.receiver_phone}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Delivery Information */}
                            <div>

                                <h2 className="font-bold text-lg mb-4">
                                    Delivery Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Pickup Address
                                            </span>
                                        </label>

                                        <textarea
                                            name="pickup_address"
                                            value={formData.pickup_address}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered w-full"
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Delivery Address
                                            </span>
                                        </label>

                                        <textarea
                                            name="delivery_address"
                                            value={formData.delivery_address}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered w-full"
                                            rows="3"
                                            required
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Parcel Details */}
                            <div>

                                <h2 className="font-bold text-lg mb-4">
                                    Parcel Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* Category */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Category
                                            </span>
                                        </label>

                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="select select-bordered w-full"
                                            required
                                        >
                                            <option value="">
                                                Select Category
                                            </option>

                                            <option value="Books">
                                                Books
                                            </option>

                                            <option value="Documents">
                                                Documents
                                            </option>

                                            <option value="Electronics">
                                                Electronics
                                            </option>

                                            <option value="Clothing">
                                                Clothing
                                            </option>

                                            <option value="Food">
                                                Food
                                            </option>

                                            <option value="Others">
                                                Others
                                            </option>
                                        </select>
                                    </div>

                                    {/* Weight */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Weight (kg)
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    {/* Delivery Fee */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Delivery Fee
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="delivery_fee"
                                            value={formData.delivery_fee}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Status */}
                            <div>

                                <h2 className="font-bold text-lg mb-4">
                                    Parcel Status
                                </h2>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="select select-bordered w-full md:w-1/2"
                                    required
                                >
                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="picked_up">
                                        Picked Up
                                    </option>

                                    <option value="in_transit">
                                        In Transit
                                    </option>

                                    <option value="delivered">
                                        Delivered
                                    </option>

                                    <option value="cancelled">
                                        Cancelled
                                    </option>
                                </select>

                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">

                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/allparcels")}
                                    className="btn btn-outline"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn btn-primary"
                                >
                                    {saving ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Parcel"
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default UpdateParcelUsers;

