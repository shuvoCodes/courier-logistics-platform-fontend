
const steps = [
    ["Book online", "Fill in the receiver, pickup and delivery address, category and weight."],
    ["We collect it", "A rider collects the parcel. The status moves from pending to picked up."],
    ["Follow it home", "Open your dashboard to see where it is and when it was last scanned."],
];


const HowItWorks = () => {
    return <section className="bg-white py-20" id="how">

        <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold md:text-4xl">
                Three steps from your door to theirs</h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
                {steps.map(([title, text], i) =>

                    <div className="rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6 text-center" key={title}>

                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white">
                            {i + 1}</span>

                        <h3 className="mt-6 text-xl font-bold">
                            {title}</h3>
                        <p className="mt-3 leading-relaxed text-gray-600">
                            {text}</p>

                    </div>
                )}
            </div>

        </div>

    </section>
        ;
};

export default HowItWorks;