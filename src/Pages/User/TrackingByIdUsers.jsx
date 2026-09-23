import { useState } from "react";

import toast from "react-hot-toast";
import { baseUrl } from "../../services/BaseUrl";

const TrackingByIdUsers = () => {
    const [searchType, setSearchType] = useState("parcel");
    const [searchValue, setSearchValue] = useState("");

    const [tracking, setTracking] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e) => {
        e.preventDefault();

        // =========================
        // VALIDATION
        // =========================
        if (!searchValue.trim()) {
            const message =
                searchType === "parcel"
                    ? "Please enter a Parcel ID."
                    : "Please enter a Tracking ID.";

            setError(message);
            toast.error(message);
            return;
        }

        const token = localStorage.getItem("lm_token");

        try {
            setLoading(true);
            setError("");
            setTracking([]);

            let url = "";

            // =========================
            // SEARCH BY PARCEL ID
            // =========================
            if (searchType === "parcel") {
                url = `${baseUrl}/tracking/${searchValue.trim()}`;
            }

            // =========================
            // SEARCH BY TRACKING ID
            // =========================
            else {
                url = `${baseUrl}/tracking/${encodeURIComponent(
                    searchValue.trim()
                )}/get`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            // =========================
            // API ERROR
            // =========================
            if (!response.ok) {
                const message =
                    data?.detail ||
                    "Tracking information not found.";

                setError(message);
                toast.error(message);

                // VERY IMPORTANT
                // Don't process error response as tracking data
                return;
            }

            // =========================
            // HANDLE API RESPONSE
            // =========================

            if (Array.isArray(data)) {
                // Remove null / undefined items
                const validTracking = data.filter(
                    (item) => item !== null && item !== undefined
                );

                setTracking(validTracking);

                if (validTracking.length === 0) {
                    setError(
                        "No tracking information found."
                    );
                }
            }

            else if (
                data?.tracking &&
                Array.isArray(data.tracking)
            ) {
                const validTracking = data.tracking.filter(
                    (item) => item !== null && item !== undefined
                );

                setTracking(validTracking);

                if (validTracking.length === 0) {
                    setError(
                        "No tracking information found."
                    );
                }
            }

            else if (
                data?.tracking_history &&
                Array.isArray(data.tracking_history)
            ) {
                const validTracking =
                    data.tracking_history.filter(
                        (item) =>
                            item !== null &&
                            item !== undefined
                    );

                setTracking(validTracking);

                if (validTracking.length === 0) {
                    setError(
                        "No tracking information found."
                    );
                }
            }

            else if (
                data &&
                typeof data === "object" &&
                !Array.isArray(data)
            ) {
                // Single tracking object
                setTracking([data]);
            }

            else {
                setTracking([]);
                setError(
                    "No tracking information found."
                );
            }
        } catch (err) {
            console.error("Tracking error:", err);

            const message =
                err?.message ||
                "Something went wrong while tracking the parcel.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FORMAT STATUS
    // =========================
    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return String(status)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    // =========================
    // STATUS STYLE
    // =========================
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "badge-warning";

            case "picked_up":
                return "badge-info";

            case "in_transit":
                return "badge-primary";

            case "out_for_delivery":
                return "badge-secondary";

            case "delivered":
                return "badge-success";

            case "cancelled":
                return "badge-error";

            default:
                return "badge-neutral";
        }
    };

    // =========================
    // FORMAT DATE
    // =========================
    const formatDate = (date) => {
        if (!date) {
            return "Date not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date not available";
        }

        return parsedDate.toLocaleString("en-BD", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // =========================
    // GET LOCATION
    // =========================
    const getLocation = (item) => {
        if (!item) {
            return "Location not available";
        }

        return (
            item.location ||
            item.current_location ||
            "Location not available"
        );
    };

    // =========================
    // GET DESCRIPTION
    // =========================
    const getDescription = (item) => {
        if (!item) {
            return "No description available";
        }

        return (
            item.description ||
            item.message ||
            "No description available"
        );
    };

    return (
        <div className="min-h-screen bg-base-200 px-4 py-10">

            <div className="max-w-5xl mx-auto">

                {/* ================= HEADER ================= */}
                <div className="text-center mb-10">

                    <div className="text-5xl mb-4">
                        📦
                    </div>

                    <h1 className="text-4xl font-bold">
                        Track Your Parcel
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Search your parcel using Parcel ID or
                        Tracking ID.
                    </p>

                </div>


                {/* ================= SEARCH BOX ================= */}
                <div className="card bg-base-100 shadow-xl mb-8">

                    <div className="card-body">

                        <form onSubmit={handleTrack}>

                            {/* SEARCH TYPE */}
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Search By
                                </span>
                            </label>

                            <div className="flex flex-col sm:flex-row gap-3 mb-4">

                                {/* PARCEL ID */}
                                <label
                                    className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition ${
                                        searchType === "parcel"
                                            ? "border-primary bg-primary/10"
                                            : "border-base-300"
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="searchType"
                                        value="parcel"
                                        checked={
                                            searchType === "parcel"
                                        }
                                        onChange={(e) => {
                                            setSearchType(
                                                e.target.value
                                            );
                                            setSearchValue("");
                                            setError("");
                                            setTracking([]);
                                        }}
                                        className="radio radio-primary"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Parcel ID
                                        </p>

                                        <p className="text-xs text-base-content/60">
                                            Example: 2
                                        </p>
                                    </div>

                                </label>


                                {/* TRACKING ID */}
                                <label
                                    className={`flex-1 cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition ${
                                        searchType === "tracking"
                                            ? "border-primary bg-primary/10"
                                            : "border-base-300"
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="searchType"
                                        value="tracking"
                                        checked={
                                            searchType === "tracking"
                                        }
                                        onChange={(e) => {
                                            setSearchType(
                                                e.target.value
                                            );
                                            setSearchValue("");
                                            setError("");
                                            setTracking([]);
                                        }}
                                        className="radio radio-primary"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Tracking ID
                                        </p>

                                        <p className="text-xs text-base-content/60">
                                            Example:
                                            CR-A8F91B23CD
                                        </p>
                                    </div>

                                </label>

                            </div>


                            {/* INPUT */}
                            <label className="label">
                                <span className="label-text font-semibold">
                                    {searchType === "parcel"
                                        ? "Parcel ID"
                                        : "Tracking ID"}
                                </span>
                            </label>


                            <div className="flex flex-col sm:flex-row gap-3">

                                <input
                                    type={
                                        searchType === "parcel"
                                            ? "number"
                                            : "text"
                                    }
                                    placeholder={
                                        searchType === "parcel"
                                            ? "Enter Parcel ID e.g. 2"
                                            : "Enter Tracking ID e.g. CR-A8F91B23CD"
                                    }
                                    value={searchValue}
                                    onChange={(e) =>
                                        setSearchValue(
                                            e.target.value
                                        )
                                    }
                                    className="input input-bordered w-full"
                                />


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary sm:w-40"
                                >

                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Searching...
                                        </>
                                    ) : (
                                        "Track Parcel"
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>


                {/* ================= ERROR ================= */}
                {error && (
                    <div className="alert alert-error mb-8">

                        <span>
                            {error}
                        </span>

                    </div>
                )}


                {/* ================= RESULT ================= */}
                {tracking.length > 0 && (

                    <div className="card bg-base-100 shadow-xl">

                        <div className="card-body">

                            {/* RESULT HEADER */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        Tracking History
                                    </h2>

                                    <p className="text-base-content/60 break-all">

                                        {searchType === "parcel"
                                            ? `Parcel #${searchValue}`
                                            : `Tracking ID: ${searchValue}`}

                                    </p>

                                </div>


                                <div className="badge badge-primary badge-lg">

                                    {tracking.length} Update
                                    {tracking.length > 1
                                        ? "s"
                                        : ""}

                                </div>

                            </div>


                            {/* ================= TIMELINE ================= */}
                            <div>

                                {tracking.map(
                                    (item, index) => {

                                        // =========================
                                        // NULL SAFETY
                                        // =========================
                                        if (!item) {
                                            return null;
                                        }

                                        return (

                                            <div
                                                key={
                                                    item.id ||
                                                    `tracking-${index}`
                                                }
                                                className="flex gap-4"
                                            >

                                                {/* TIMELINE */}
                                                <div className="flex flex-col items-center">

                                                    <div
                                                        className={`w-5 h-5 rounded-full ring-4 ring-base-100 ${
                                                            index === 0
                                                                ? "bg-primary"
                                                                : "bg-base-300"
                                                        }`}
                                                    ></div>


                                                    {index !==
                                                        tracking.length -
                                                            1 && (
                                                        <div className="w-0.5 flex-1 bg-base-300 min-h-37.5"></div>
                                                    )}

                                                </div>


                                                {/* TRACKING CARD */}
                                                <div className="flex-1 pb-8">

                                                    <div className="bg-base-200 rounded-2xl p-5">

                                                        {/* STATUS + DATE */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                                                            <span
                                                                className={`badge ${getStatusStyle(
                                                                    item.status
                                                                )} font-semibold`}
                                                            >
                                                                {formatStatus(
                                                                    item.status
                                                                )}
                                                            </span>


                                                            <span className="text-sm text-base-content/60">

                                                                {formatDate(
                                                                    item.created_at
                                                                )}

                                                            </span>

                                                        </div>


                                                        {/* LOCATION */}
                                                        <div className="flex gap-3 mb-4">

                                                            <div className="text-2xl">
                                                                📍
                                                            </div>


                                                            <div>

                                                                <p className="text-xs uppercase font-bold text-base-content/50">
                                                                    Location
                                                                </p>


                                                                <p className="font-medium">
                                                                    {getLocation(
                                                                        item
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        {/* DESCRIPTION */}
                                                        <div className="flex gap-3">

                                                            <div className="text-2xl">
                                                                📝
                                                            </div>


                                                            <div>

                                                                <p className="text-xs uppercase font-bold text-base-content/50">
                                                                    Description
                                                                </p>


                                                                <p className="text-base-content/80">
                                                                    {getDescription(
                                                                        item
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </div>

                    </div>

                )}


                {/* ================= NO RESULT ================= */}
                {!loading &&
                    !error &&
                    searchValue &&
                    tracking.length === 0 && (

                        <div className="text-center py-10">

                            <div className="text-5xl mb-3">
                                📦
                            </div>

                            <h3 className="text-xl font-bold">
                                No Tracking Information
                            </h3>

                            <p className="text-base-content/60">
                                No tracking history found for
                                this search.
                            </p>

                        </div>
                    )}

            </div>

        </div>
    );
};

export default TrackingByIdUsers;
