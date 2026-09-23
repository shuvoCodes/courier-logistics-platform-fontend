
import { Box, Coins, MapPin, Lock } from "lucide-react";

const items = [
    ["Book in minutes", "Receiver, two addresses and a weight. That is the whole form.", Box],
    ["Fee before you commit", "The delivery fee updates as you fill the booking form.", Coins],
    ["Every stop recorded", "Status, place and time for each step from pickup to door.", MapPin],
    ["One secure account", "All your parcels, past and present, behind one login.", Lock],
];
const Capabilities = () => {

    return <section aria-label="Highlights" className="shadow-[0_4px_6px_-1px_rgba(0,0,0,0.50)] bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">

            {items.map(([title, text, Icon]) =>
                <div className="flex gap-4" key={title}>

                    <Icon className="shrink-0 text-blue-600" size={30} />

                    <div>
                        <h3 className="font-bold text-gray-900">
                            {title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                            {text}</p>
                    </div>

                </div>
            )}
        </div>

    </section>
        ;
};

export default Capabilities;