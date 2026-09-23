import { useState } from "react";
import { ScanLine } from "lucide-react";
import { baseUrl } from "../services/BaseUrl";



const Hero = ({ onLoginRequired }) => {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);


  const handleTrack = async (event) => {
    event.preventDefault();
    const trackingNumber = number.trim();
    console.log(trackingNumber);
    if (!trackingNumber) {
      setError("Please enter a tracking number.");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${baseUrl}/tracking/${trackingNumber}/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
      },
        },
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message || "Unable to find this parcel.");
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  

  return <header className="relative overflow-hidden bg-slate-900 py-20 text-white" id="top">
    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Book a pickup.<br />Follow it to the door.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          Send parcels from one account. Add the receiver,
          see the fee up front, and follow every stop until
          it is delivered.
        </p>
        <div className="mt-8 flex gap-4">
          <button onClick={() => onLoginRequired()} className="rounded-lg bg-amber-500 px-6 py-3 font-semibold">
            Send a parcel
          </button>
          <a href="#fees" className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-900">
            See the fees
          </a>
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Already have a parcel on the way? Type its tracking number on the label.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl bg-linear-to-r from-blue-500 to-purple-500 shadow-2xl " id="track">
        <div className="flex justify-between border-b px-6 py-5 font-bold">
          <span>Track a parcel</span>
          <ScanLine className="text-blue-600" />
        </div>
        {
          !result ? <div className="p-6">
            <form onSubmit={handleTrack}>
              <label className="block font-semibold">
                Tracking number
              </label>
              <input value={number} onChange={e => setNumber(e.target.value)} placeholder="CR-XXXXXXXXXX" className="mt-2 w-full rounded-lg border px-4 py-3" />
              <button className="mt-4 w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white">
                Track parcel
              </button>
            </form>
            <p className="mt-5 text-sm text-white">{localStorage.getItem("token") ? "Enter the number printed on your booking confirmation." : "Log in to see the live status of your parcels."}</p>
            {
              error && <p role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            }
          </div> : <div className="p-6"><p className="text-sm text-gray-500">
            Tracking number
          </p>
            <h3 className="text-xl font-bold">
              {
                result?.tracking_number || number
              }
            </h3>
            <p className="mt-4 font-semibold">
              {
                result?.status
              }
            </p>
            <button onClick={() => setResult(null)} className="mt-5 rounded-lg border px-4 py-2">
              Track another
            </button>
          </div>}
        <div className="border-t px-6 py-5 text-center font-mono text-sm">
          CR-7F3A9C21BE
        </div>
      </div>
    </div>
  </header>;
}

export default Hero;