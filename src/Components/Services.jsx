const notes = {
  Documents: "Letters, certificates and contracts",
  Books: "Books and stationery",
  Clothing: "Folded and bagged",
  Electronics: "Phones, chargers and small devices",
  Food: "Sealed, non-perishable items",
  Fragile: "Glass, ceramics and decor, packed with care",
  Other: "Anything else that fits in a parcel",
};

const Services = () => {
  return (
    <section className="bg-gray-50 py-20" id="services">
      <div className="mx-auto max-w-7xl px-4">

        {/* Left Content */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-3xl font-bold md:text-4xl">
            What you can send
          </h2>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600 text-center">
            Pick a category when you book. Most parcels ship at the
            standard rate; a few need extra handling.
          </p>
        </div>

        {/* Right Cards */}
        <div className="grid gap-4 sm:grid-cols-4 grid-cols-2 mt-10">

          {Object.entries(notes).map(([category, description]) => (
            <div
              key={category}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">
                {category}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Services;