import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { baseUrl } from "../../services/BaseUrl";

const AllParcels = () => {
    const navigate = useNavigate();

    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Search & Filter
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("newest");

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch parcels
    const fetchParcels = useCallback(async () => {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("lm_token");

        try {
            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (status) {
                params.append("status", status);
            }

            if (category) {
                params.append("category", category);
            }

            params.append("sort", sort);
            params.append("page", page);
            params.append("page_size", pageSize);

            const response = await fetch(
                `${baseUrl}/parcels/search?${params.toString()}`,
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
                    data.detail ||
                    data.message ||
                    "Failed to fetch parcels"
                );
            }

            setParcels(data.items || []);
            setTotalPages(data.total_pages || 1);
            setTotalItems(data.total_items || 0);
        } catch (error) {
            console.error(error);
            setError(error.message || "Something went wrong");
            setParcels([]);
        } finally {
            setLoading(false);
        }
    }, [search, status, category, sort, page, pageSize]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchParcels();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [fetchParcels]);

    // Search button
    const handleSearch = (e) => {
        e.preventDefault();

        setPage(1);
        fetchParcels();
    };

    // Delete parcel
    const handleDelete = async (parcelId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this parcel?"
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("lm_token");

        try {
            const response = await fetch(
                `${baseUrl}/parcels/delete/${parcelId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    data.message ||
                    "Failed to delete parcel"
                );
            }

            setParcels((prev) =>
                prev.filter((parcel) => parcel.id !== parcelId)
            );

            setTotalItems((prev) => prev - 1);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to delete parcel");
        }
    };

    // Clear filters
    const handleClear = () => {
        setSearch("");
        setStatus("");
        setCategory("");
        setSort("newest");
        setPage(1);
    };

    // Go to update page
    const handleUpdate = (parcelId) => {
        navigate(`parcels/update/${parcelId}`);
    };

    // Go to tracking page
    const handleTracking = (parcelId) => {
        navigate(`tracking/${parcelId}`);
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Parcel Management
                </h1>

                <p className="text-base-content/60 mt-1">
                    Search, filter, update and manage your parcels
                </p>
            </div>

            {/* Search & Filter Card */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">

                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                    >

                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Search Parcel
                                </span>
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by ID or tracking number..."
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Status
                                </span>
                            </label>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
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

                        {/* Category */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Category
                                </span>
                            </label>

                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="">
                                    All Categories
                                </option>
                                <option value="Books">Books</option>
                                <option value="Documents">
                                    Documents
                                </option>
                                <option value="Electronics">
                                    Electronics
                                </option>
                                <option value="Clothing">
                                    Clothing
                                </option>
                                <option value="Food">Food</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Sort
                                </span>
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered w-full"
                            >
                                <option value="newest">
                                    Newest
                                </option>

                                <option value="oldest">
                                    Oldest
                                </option>

                                <option value="alphabetical">
                                    Alphabetical
                                </option>

                                <option value="price">
                                    Price
                                </option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 lg:col-span-5 flex flex-wrap gap-2 justify-end mt-2">

                            <button
                                type="button"
                                onClick={handleClear}
                                className="btn btn-outline"
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Search
                            </button>

                        </div>
                    </form>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-error mb-5">
                    <span>{error}</span>
                </div>
            )}

            {/* Result Info */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
                <div>
                    <span className="font-semibold">
                        Total Parcels:
                    </span>{" "}
                    {totalItems}
                </div>

                <div className="text-sm text-base-content/60">
                    Page {page} of {totalPages}
                </div>
            </div>

            {/* Table */}
            <div className="card bg-base-100 shadow-md">
                <div className="card-body p-0">

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tracking Number</th>
                                    <th>Receiver</th>
                                    <th>Phone</th>
                                    <th>Category</th>
                                    <th>Weight</th>
                                    <th>Delivery Fee</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="text-center py-10"
                                        >
                                            <span className="loading loading-spinner loading-lg"></span>
                                        </td>
                                    </tr>
                                ) : parcels.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="text-center py-10"
                                        >
                                            No parcels found
                                        </td>
                                    </tr>
                                ) : (
                                    parcels.map((parcel) => (
                                        <tr
                                            key={parcel.id}
                                            className="hover"
                                        >

                                            {/* ID */}
                                            <td className="font-bold">
                                                #{parcel.id}
                                            </td>

                                            {/* Tracking Number */}
                                            <td>
                                                <span className="font-mono text-sm">
                                                    {parcel.tracking_number}
                                                </span>
                                            </td>

                                            {/* Receiver */}
                                            <td>
                                                <div className="font-semibold">
                                                    {parcel.receiver_name}
                                                </div>

                                                <div className="text-xs opacity-60">
                                                    {parcel.delivery_address}
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td>
                                                {parcel.receiver_phone}
                                            </td>

                                            {/* Category */}
                                            <td>
                                                <span className="badge badge-outline">
                                                    {parcel.category}
                                                </span>
                                            </td>

                                            {/* Weight */}
                                            <td>
                                                {parcel.weight} kg
                                            </td>

                                            {/* Delivery Fee */}
                                            <td className="font-semibold">
                                                ৳{parcel.delivery_fee}
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span className="badge badge-info">
                                                    {parcel.status}
                                                </span>
                                            </td>

                                            {/* Created At */}
                                            <td className="text-sm">
                                                {parcel.created_at
                                                    ? new Date(
                                                        parcel.created_at
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="flex gap-2">

                                                    {/* Update Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleUpdate(
                                                                parcel.id
                                                            )
                                                        }
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        Update
                                                    </button>

                                                    {/* Tracking Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleTracking(
                                                                parcel.id
                                                            )
                                                        }
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        Tracking
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                parcel.id
                                                            )
                                                        }
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">

                    <div className="join">

                        <button
                            className="join-item btn"
                            disabled={page === 1}
                            onClick={() =>
                                setPage((prev) => prev - 1)
                            }
                        >
                            «
                        </button>

                        <button className="join-item btn">
                            Page {page}
                        </button>

                        <button
                            className="join-item btn"
                            disabled={page === totalPages}
                            onClick={() =>
                                setPage((prev) => prev + 1)
                            }
                        >
                            »
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AllParcels;

