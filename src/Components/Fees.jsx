import { useMemo, useState } from "react";


const Fees = () => {
  const categories = [];
  const fee = {};
  const currency = "৳";
  const [weight, setWeight] = useState(1);
  const [category, setCategory] = useState(categories[0] || "Documents");
  const base = Number(fee.base ?? 60);
  const perExtraKg = Number(fee.perExtraKg ?? 20);
  const surcharge = fee.surcharge || {};
  const extraKg = Math.max(0, Math.ceil(weight - 1));
  const handling = Number(surcharge[category] || 0);
  const total = useMemo(() =>
    base + extraKg * perExtraKg + handling, [base, extraKg, perExtraKg, handling]);
  return <section className="bg-gray-50 py-20" id="fees">

    <div className="relative mx-auto max-w-7xl px-4 grid sm:grid-cols-2 grid-cols-1 items-center text-center">

      <div className="mb-12 sticky">
        <h2 className="text-3xl font-bold md:text-4xl">
          Know the fee before you book</h2>

        <p className="mt-4 text-lg text-gray-600">
          The first kilogram costs {currency}{base}. Every extra started kilogram adds {currency}{perExtraKg}. Fragile, food and electronics carry a small handling charge.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2 md:p-8">

        <div>
          <div className="flex justify-between">
            <label className="font-semibold">
              Weight</label>
            <output className="font-bold text-blue-600">
              {weight} kg</output>
          </div>

          <input className="mt-4 w-full accent-blue-600" type="range" min="0.5" max="30" step="0.5" value={weight} onChange={e =>
            setWeight(Number(e.target.value))} />

          <div className="mt-2 flex justify-between text-sm text-gray-400">
            <span>
              0.5 kg</span>
            <span>
              30 kg</span>
          </div>



          <div className="rounded-xl bg-gray-50 p-6 mt-4">
            <div className="flex justify-between border-b pb-5">
              <span>
                Estimated delivery fee</span>
              <strong className="text-3xl">
                {currency}{total}</strong>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li className="flex justify-between">
                <span>
                  First kilogram</span>
                <span>
                  {currency}{base}</span>
              </li>
              <li className="flex justify-between">
                <span>
                  Extra weight ({extraKg} kg)</span>
                <span>
                  {currency}{extraKg * perExtraKg}</span>
              </li>
              <li className="flex justify-between">
                <span>
                  Handling ({category})</span>
                <span>
                  {currency}{handling}</span>
              </li>
            </ul>

            <button onClick={(e) => e} className="mt-6 w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Book this parcel</button>

          </div>
        </div>

      </div>

    </div>

  </section>

};

export default Fees;
