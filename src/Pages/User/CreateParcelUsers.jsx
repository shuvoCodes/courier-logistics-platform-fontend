import { useState } from "react";
import { baseUrl } from "../../services/BaseUrl";

const CreateParcelUsers = () => {
    const [formData, setFormData] = useState({
        receiver_name: "",
        receiver_phone: "",
        pickup_address: "",
        delivery_address: "",
        category: "",
        weight: "",
        delivery_fee: 0,
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        const token = localStorage.getItem("lm_token");

        const parcelData = {
            receiver_name: formData.receiver_name,
            receiver_phone: formData.receiver_phone,
            pickup_address: formData.pickup_address,
            delivery_address: formData.delivery_address,
            category: formData.category,
            weight: Number(formData.weight),
            delivery_fee: Number(formData.delivery_fee),
        };

        try {
            const res = await fetch(`${baseUrl}/parcels/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(parcelData),
            });

            const data = await res.json();
            console.log('data',data);
            if (!res.ok) {
                throw new Error(
                    data.detail || "Failed to create parcel"
                );
            }

            setMessage("Parcel created successfully!");

            setFormData({
                receiver_name: "",
                receiver_phone: "",
                pickup_address: "",
                delivery_address: "",
                category: "",
                weight: "",
                delivery_fee: 0,
            });

            console.log("Created Parcel:", data);

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">

            <div className="max-w-4xl mx-auto">

                {/* ================= HEADER ================= */}
                <div className="mb-6">

                    <h1 className="text-3xl md:text-4xl font-bold">
                        Create Parcel
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Enter the parcel information below to create a
                        new delivery.
                    </p>

                </div>

                {/* ================= FORM CARD ================= */}
                <div className="card bg-base-100 shadow-xl">

                    <div className="card-body">

                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-6">

                            <div className="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center text-2xl">
                                📦
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    Parcel Information
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    Fill in all required information
                                </p>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* ================= RECEIVER ================= */}
                            <div className="mb-8">

                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    👤 Receiver Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Receiver Name */}
                                    <div className="form-control">

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
                                            placeholder="John Doe"
                                            className="input input-bordered w-full"
                                            required
                                        />

                                    </div>

                                    {/* Receiver Phone */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Receiver Phone
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="receiver_phone"
                                            value={formData.receiver_phone}
                                            onChange={handleChange}
                                            placeholder="01XXXXXXXXXX"
                                            className="input input-bordered w-full"
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="divider"></div>

                            {/* ================= ADDRESS ================= */}
                            <div className="my-8">

                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    📍 Delivery Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Pickup Address */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Pickup Address
                                            </span>
                                        </label>

                                        <textarea
                                            name="pickup_address"
                                            value={formData.pickup_address}
                                            onChange={handleChange}
                                            placeholder="Enter pickup address"
                                            className="textarea textarea-bordered w-full h-28"
                                            required
                                        />

                                    </div>

                                    {/* Delivery Address */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Delivery Address
                                            </span>
                                        </label>

                                        <textarea
                                            name="delivery_address"
                                            value={formData.delivery_address}
                                            onChange={handleChange}
                                            placeholder="Enter delivery address"
                                            className="textarea textarea-bordered w-full h-28"
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="divider"></div>

                            {/* ================= PARCEL DETAILS ================= */}
                            <div className="my-8">

                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    📦 Parcel Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                    {/* Category */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Category
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="Books"
                                            className="input input-bordered w-full"
                                            required
                                        />

                                    </div>

                                    {/* Weight */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Weight
                                            </span>
                                        </label>

                                        <div className="join w-full">

                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                placeholder="1"
                                                min="0"
                                                step="0.1"
                                                className="input input-bordered join-item w-full"
                                                required
                                            />

                                            <span className="btn btn-neutral join-item pointer-events-none">
                                                KG
                                            </span>

                                        </div>

                                    </div>

                                    {/* Delivery Fee */}
                                    <div className="form-control">

                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Delivery Fee
                                            </span>
                                        </label>

                                        <div className="join w-full">

                                            <span className="btn btn-neutral join-item pointer-events-none">
                                                ৳
                                            </span>

                                            <input
                                                type="number"
                                                name="delivery_fee"
                                                value={formData.weight * 60}
                                                onChange={(e)=> e.target.value}
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                                className="input input-bordered join-item w-full"
                                                formNoValidate
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* ================= MESSAGE ================= */}
                            {message && (
                                <div
                                    className={`alert mb-6 ${
                                        message.toLowerCase().includes("success")
                                            ? "alert-success"
                                            : "alert-error"
                                    }`}
                                >
                                    <span>
                                        {message.toLowerCase().includes("success")
                                            ? "✓"
                                            : "⚠️"}
                                    </span>

                                    <span>{message}</span>
                                </div>
                            )}

                            {/* ================= BUTTON ================= */}
                            <div className="flex justify-end pt-4 border-t">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full md:w-auto min-w-48"
                                >

                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            📦 Create Parcel
                                        </>
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

export default CreateParcelUsers;