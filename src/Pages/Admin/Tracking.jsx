import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { baseUrl } from "../../services/BaseUrl";


const Tracking = () => {
    const { parcelId } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Validation
        if (!status) {
            setError("Please select a tracking status.");
            return;
        }

        if (!location.trim()) {
            setError("Please enter the current location.");
            return;
        }

        if (!description.trim()) {
            setError("Please enter a description.");
            return;
        }

        const token = localStorage.getItem("lm_token");

        if (!token) {
            setError("Authentication token not found. Please login again.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${baseUrl}/tracking/${parcelId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: status,
                        location: location.trim(),
                        description: description.trim(),
                    }),
                }
            );

            // Get response as text first
            const responseText = await response.text();

            console.log("Status:", response.status);
            console.log("Response:", responseText);

            let data = {};

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : {};
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError);
            }

            // Backend error
            if (!response.ok) {
                let errorMessage = "Failed to create tracking.";

                if (data.detail) {
                    errorMessage =
                        typeof data.detail === "string"
                            ? data.detail
                            : JSON.stringify(data.detail);
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (response.status === 500) {
                    errorMessage =
                        "Server error. Please check the backend/Render logs.";
                } else if (response.status === 401) {
                    errorMessage =
                        "Authentication failed. Please login again.";
                } else if (response.status === 403) {
                    errorMessage =
                        "You are not allowed to add tracking.";
                } else if (response.status === 404) {
                    errorMessage = "Parcel not found.";
                }

                throw new Error(errorMessage);
            }

            // Success
            console.log("Tracking created:", data);

            setSuccess(
                `Tracking information added successfully${
                    data.tracking_number
                        ? ` for ${data.tracking_number}`
                        : ""
                }.`
            );

            // Clear form
            setStatus("");
            setLocation("");
            setDescription("");

        } catch (error) {
            console.error("Tracking Error:", error);

            setError(
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-6">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost btn-sm mb-4"
                    disabled={loading}
                >
                    ← Back
                </button>

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Add Parcel Tracking
                    </h1>

                    <p className="text-base-content/60 mt-1">
                        Add a new tracking update for this parcel.
                    </p>
                </div>
            </div>

            {/* Main Card */}
            <div className="max-w-4xl mx-auto">

                <div className="card bg-base-100 shadow-xl">

                    <div className="card-body">

                        {/* Parcel Information */}
                        <div className="bg-base-200 rounded-xl p-4 mb-6">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Parcel ID
                                    </p>

                                    <p className="text-xl font-bold">
                                        #{parcelId}
                                    </p>
                                </div>

                                <div className="badge badge-primary badge-lg">
                                    Tracking Update
                                </div>

                            </div>
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

                        {/* Form */}
                        <form onSubmit={handleSubmit}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Status */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Tracking Status
                                        </span>
                                    </label>

                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="select select-bordered w-full"
                                        disabled={loading}
                                    >
                                        <option value="">
                                            Select Status
                                        </option>

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

                                {/* Location */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Current Location
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        placeholder="e.g. Dhaka Branch"
                                        className="input input-bordered w-full"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">

                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Description
                                        </span>
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        placeholder="Write tracking update details..."
                                        className="textarea textarea-bordered w-full min-h-32"
                                        disabled={loading}
                                    />

                                    <label className="label">
                                        <span className="label-text-alt text-base-content/50">
                                            Describe what happened to the
                                            parcel.
                                        </span>
                                    </label>

                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">

                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
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
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Tracking"
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>

                {/* Information Card */}
                <div className="card bg-base-100 shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-lg">
                            Tracking Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">

                            {/* Parcel */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-base-content/60">
                                    Parcel
                                </p>

                                <p className="font-bold">
                                    #{parcelId}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-base-content/60">
                                    Status
                                </p>

                                <p className="font-bold capitalize">
                                    {status
                                        ? status.replace("_", " ")
                                        : "Not selected"}
                                </p>
                            </div>

                            {/* Location */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <p className="text-sm text-base-content/60">
                                    Location
                                </p>

                                <p className="font-bold truncate">
                                    {location || "Not added"}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Tracking;

