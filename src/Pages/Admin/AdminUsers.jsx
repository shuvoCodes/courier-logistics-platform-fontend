import { useCallback, useEffect, useState } from "react";
import { baseUrl } from "../../services/BaseUrl";
import { useNavigate } from "react-router";

const AdminUsers = () => {
    const navigate = useNavigate();

    // =========================
    // State
    // =========================
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [isActive, setIsActive] = useState("");

    const [sortBy, setSortBy] = useState("create_at");
    const [sortOrder, setSortOrder] = useState("desc");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [totalUsers, setTotalUsers] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Action loading
    const [actionLoading, setActionLoading] = useState(null);

    // =========================
    // Open User Profile
    // =========================
    const handleUserClick = (user) => {
        navigate(`/admin/users/${user.id}/update`, {
            state: {
                user: user,
            },
        });
    };

    // =========================
    // Fetch Users
    // =========================
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (role) {
                params.append("role", role);
            }

            if (isActive !== "") {
                params.append("is_active", isActive);
            }

            params.append("sort_by", sortBy);
            params.append("sort_order", sortOrder);

            params.append("page", page);
            params.append("page_size", pageSize);

            const token = localStorage.getItem("lm_token");

            const response = await fetch(
                `${baseUrl}/Admin/users?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to fetch users"
                );
            }

            console.log("Users API Response:", data);

            if (Array.isArray(data)) {
                setUsers(data);
                setTotalUsers(data.length);
            } else {
                setUsers(
                    data.items ||
                    data.users ||
                    data.data ||
                    []
                );

                setTotalUsers(
                    data.total ||
                    data.total_users ||
                    data.count ||
                    0
                );
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [
        search,
        role,
        isActive,
        sortBy,
        sortOrder,
        page,
        pageSize,
    ]);

    // =========================
    // Fetch when filters change
    // =========================
    useEffect(() => {
        const fetchTimeout = setTimeout(() => {
            fetchUsers();
        }, 0);

        return () => clearTimeout(fetchTimeout);
    }, [fetchUsers]);

    // =========================
    // Change Role
    // =========================
    const handleRoleChange = async (userId, newRole) => {
        try {
            setActionLoading(`role-${userId}`);
            setError("");

            const token = localStorage.getItem("lm_token");

            const response = await fetch(
                `${baseUrl}/Admin/users/${userId}/role`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        role: newRole,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to change user role"
                );
            }

            // Update current table data
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? {
                            ...user,
                            role: newRole,
                        }
                        : user
                )
            );

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // =========================
    // Change Status
    // =========================
    const handleStatusChange = async (userId, newStatus) => {
        try {
            setActionLoading(`status-${userId}`);
            setError("");

            const token = localStorage.getItem("lm_token");

            const response = await fetch(
                `${baseUrl}/Admin/users/${userId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        is_active: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to change user status"
                );
            }

            // Update current table data
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? {
                            ...user,
                            is_active: newStatus,
                        }
                        : user
                )
            );

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // =========================
    // Delete User
    // =========================
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setActionLoading(`delete-${userId}`);
            setError("");

            const token = localStorage.getItem("lm_token");

            const response = await fetch(
                `${baseUrl}/Admin/users/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to delete user"
                );
            }

            // Remove deleted user from table
            setUsers((prevUsers) =>
                prevUsers.filter(
                    (user) => user.id !== userId
                )
            );

            setTotalUsers((prev) =>
                Math.max(prev - 1, 0)
            );

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // =========================
    // Search with Enter
    // =========================
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setPage(1);
        }
    };

    // =========================
    // Reset
    // =========================
    const handleReset = () => {
        setSearch("");
        setRole("");
        setIsActive("");
        setSortBy("create_at");
        setSortOrder("desc");
        setPage(1);
    };

    // =========================
    // Pagination
    // =========================
    const totalPages = Math.ceil(totalUsers / pageSize);

    const startUser =
        totalUsers === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const endUser = Math.min(
        page * pageSize,
        totalUsers
    );

    // =========================
    // UI
    // =========================
    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">

            {/* ================= HEADER ================= */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">
                    User Management
                </h1>

                <p className="text-sm text-base-content/60 mt-1">
                    Search, filter and manage all system users.
                </p>
            </div>

            {/* ================= FILTER CARD ================= */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        {/* Search */}
                        <div className="form-control lg:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Search User
                                </span>
                            </label>

                            <input
                                type="text"
                                placeholder="Search by username, email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                onKeyDown={handleSearch}
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Role */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Role
                                </span>
                            </label>

                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered"
                            >
                                <option value="">
                                    All Roles
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="user">
                                    User
                                </option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Status
                                </span>
                            </label>

                            <select
                                value={isActive}
                                onChange={(e) => {
                                    setIsActive(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered"
                            >
                                <option value="">
                                    All Status
                                </option>

                                <option value="true">
                                    Active
                                </option>

                                <option value="false">
                                    Inactive
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* SECOND ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                        {/* Sort By */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Sort By
                                </span>
                            </label>

                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered"
                            >
                                <option value="create_at">
                                    Created Date
                                </option>

                                <option value="username">
                                    Username
                                </option>

                                <option value="email">
                                    Email
                                </option>

                                <option value="role">
                                    Role
                                </option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Sort Order
                                </span>
                            </label>

                            <select
                                value={sortOrder}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    setPage(1);
                                }}
                                className="select select-bordered"
                            >
                                <option value="desc">
                                    Descending
                                </option>

                                <option value="asc">
                                    Ascending
                                </option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-end gap-2">

                            <button
                                onClick={() => {
                                    setPage(1);
                                    fetchUsers();
                                }}
                                className="btn btn-primary flex-1"
                            >
                                🔍 Search
                            </button>

                            <button
                                onClick={handleReset}
                                className="btn btn-outline"
                            >
                                Reset
                            </button>

                        </div>

                    </div>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="alert alert-error mb-6">
                    <span>{error}</span>
                </div>
            )}

            {/* ================= USERS ================= */}
            <div className="card bg-base-100 shadow-md">

                <div className="card-body p-0">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 p-5 border-b">

                        <div>
                            <h2 className="text-xl font-bold">
                                Users
                            </h2>

                            <p className="text-sm text-base-content/60">
                                {totalUsers} total users
                            </p>
                        </div>

                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="select select-bordered select-sm w-full sm:w-auto"
                        >
                            <option value="5">
                                5 per page
                            </option>

                            <option value="10">
                                10 per page
                            </option>

                            <option value="20">
                                20 per page
                            </option>

                            <option value="50">
                                50 per page
                            </option>

                            <option value="100">
                                100 per page
                            </option>
                        </select>

                    </div>

                    {/* Loading */}
                    {loading ? (

                        <div className="flex justify-center items-center py-20">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>

                    ) : users.length === 0 ? (

                        <div className="text-center py-20">
                            <div className="text-5xl mb-3">
                                👤
                            </div>

                            <h3 className="text-lg font-semibold">
                                No Users Found
                            </h3>

                            <p className="text-sm text-base-content/60">
                                Try changing your search or filters.
                            </p>
                        </div>

                    ) : (

                        <>
                            {/* ================= DESKTOP ================= */}
                            <div className="hidden md:block overflow-x-auto">

                                <table className="table table-zebra">

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.map((user, index) => (

                                            <tr
                                                key={user.id}
                                                onClick={() =>
                                                    handleUserClick(user)
                                                }
                                                className="cursor-pointer hover:bg-base-200 transition"
                                            >

                                                <td>
                                                    {(page - 1) * pageSize +
                                                        index +
                                                        1}
                                                </td>

                                                <td>
                                                    <div className="flex items-center gap-3">

                                                        <div className="avatar placeholder">
                                                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                                <span>
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

                                                        <div>
                                                            <div className="font-bold">
                                                                {user.username ||
                                                                    user.fullname ||
                                                                    "N/A"}
                                                            </div>

                                                            <div className="text-xs opacity-50">
                                                                ID: {user.id}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    {user.email || "N/A"}
                                                </td>

                                                {/* ================= ROLE ================= */}
                                                <td
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <select
                                                        value={
                                                            user.role ||
                                                            "user"
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            `role-${user.id}`
                                                        }
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                user.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="select select-bordered select-sm"
                                                    >
                                                        <option value="admin">
                                                            Admin
                                                        </option>

                                                        <option value="user">
                                                            User
                                                        </option>
                                                    </select>
                                                </td>

                                                {/* ================= STATUS ================= */}
                                                <td
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <select
                                                        value={
                                                            user.is_active
                                                                ? "true"
                                                                : "false"
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            `status-${user.id}`
                                                        }
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                user.id,
                                                                e.target.value ===
                                                                    "true"
                                                            )
                                                        }
                                                        className={`select select-bordered select-sm ${
                                                            user.is_active
                                                                ? "select-success"
                                                                : "select-error"
                                                        }`}
                                                    >
                                                        <option value="true">
                                                            Active
                                                        </option>

                                                        <option value="false">
                                                            Inactive
                                                        </option>
                                                    </select>
                                                </td>

                                                <td>
                                                    {user.create_at
                                                        ? new Date(
                                                            user.create_at
                                                        ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>

                                                {/* ================= ACTIONS ================= */}
                                                <td
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading ===
                                                            `delete-${user.id}`
                                                        }
                                                        className="btn btn-error btn-sm"
                                                    >
                                                        {actionLoading ===
                                                        `delete-${user.id}` ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            "Delete"
                                                        )}
                                                    </button>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                            {/* ================= MOBILE ================= */}
                            <div className="md:hidden divide-y">

                                {users.map((user) => (

                                    <div
                                        key={user.id}
                                        onClick={() =>
                                            handleUserClick(user)
                                        }
                                        className="p-4 cursor-pointer hover:bg-base-200 transition"
                                    >

                                        <div className="flex items-start justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-11">
                                                        <span>
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

                                                <div>

                                                    <h3 className="font-bold">
                                                        {user.username ||
                                                            user.fullname ||
                                                            "N/A"}
                                                    </h3>

                                                    <p className="text-xs text-base-content/60">
                                                        ID: {user.id}
                                                    </p>

                                                </div>

                                            </div>

                                            <span
                                                className={`badge badge-sm ${
                                                    user.is_active
                                                        ? "badge-success"
                                                        : "badge-error"
                                                }`}
                                            >
                                                {user.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </div>

                                        <div className="mt-3 space-y-3 text-sm">

                                            <div className="flex justify-between items-center">
                                                <span className="text-base-content/60">
                                                    Email
                                                </span>

                                                <span>
                                                    {user.email || "N/A"}
                                                </span>
                                            </div>

                                            {/* Role */}
                                            <div
                                                className="flex justify-between items-center"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <span className="text-base-content/60">
                                                    Role
                                                </span>

                                                <select
                                                    value={
                                                        user.role ||
                                                        "user"
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        `role-${user.id}`
                                                    }
                                                    onChange={(e) =>
                                                        handleRoleChange(
                                                            user.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="select select-bordered select-sm"
                                                >
                                                    <option value="admin">
                                                        Admin
                                                    </option>

                                                    <option value="user">
                                                        User
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Status */}
                                            <div
                                                className="flex justify-between items-center"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <span className="text-base-content/60">
                                                    Status
                                                </span>

                                                <select
                                                    value={
                                                        user.is_active
                                                            ? "true"
                                                            : "false"
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        `status-${user.id}`
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            user.id,
                                                            e.target.value ===
                                                                "true"
                                                        )
                                                    }
                                                    className="select select-bordered select-sm"
                                                >
                                                    <option value="true">
                                                        Active
                                                    </option>

                                                    <option value="false">
                                                        Inactive
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-base-content/60">
                                                    Created
                                                </span>

                                                <span>
                                                    {user.create_at
                                                        ? new Date(
                                                            user.create_at
                                                        ).toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Delete */}
                                        <div
                                            className="mt-4"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >
                                            <button
                                                onClick={() =>
                                                    handleDeleteUser(
                                                        user.id
                                                    )
                                                }
                                                disabled={
                                                    actionLoading ===
                                                    `delete-${user.id}`
                                                }
                                                className="btn btn-error btn-sm w-full"
                                            >
                                                {actionLoading ===
                                                `delete-${user.id}` ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    "Delete Account"
                                                )}
                                            </button>
                                        </div>

                                        <div className="text-center mt-3">
                                            <span className="text-primary text-sm font-semibold">
                                                Click user to view / update →
                                            </span>
                                        </div>

                                    </div>

                                ))}

                            </div>
                        </>
                    )}

                    {/* ================= PAGINATION ================= */}
                    {totalUsers > 0 && (

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-t">

                            <div className="text-sm text-base-content/60">
                                Showing{" "}
                                <span className="font-semibold">
                                    {startUser}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold">
                                    {endUser}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold">
                                    {totalUsers}
                                </span>{" "}
                                users
                            </div>

                            <div className="join">

                                <button
                                    className="join-item btn btn-sm"
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((prev) => prev - 1)
                                    }
                                >
                                    «
                                </button>

                                <button className="join-item btn btn-sm">
                                    Page {page} / {totalPages}
                                </button>

                                <button
                                    className="join-item btn btn-sm"
                                    disabled={page >= totalPages}
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
            </div>

        </div>
    );
};

export default AdminUsers;
