import { Truck } from "lucide-react";

const Footer = ({ onLogin, onRegister }) => {
    return <footer className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">

                <div>
                    <a href="#top" className="flex items-center gap-3">
                        <span className="rounded-lg bg-amber-500 p-3">
                            <Truck />
                        </span>
                        <span className="text-lg font-bold">
                            Courier & Logistics<small className="block text-xs font-normal text-gray-400">
                                Management Platform</small>
                        </span>
                    </a>
                    <p className="mt-5 text-gray-400">
                        Book, track and manage deliveries from one place.</p>
                </div>

                <div>
                    <h4 className="mb-5 font-semibold">
                        Platform</h4>
                    <ul className="space-y-3 text-gray-400">
                        <li>
                            <a href="#services">
                                Services</a>
                        </li>
                        <li>
                            <a href="#how">
                                How it works</a>
                        </li>
                        <li>
                            <a href="#fees">
                                Fees</a>
                        </li>
                        <li>
                            <a href="#track">
                                Track a parcel</a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-5 font-semibold">
                        Account</h4>
                    <ul className="space-y-3 text-gray-400">
                        <li>
                            <button onClick={onLogin}>
                                Log in</button>
                        </li>
                        <li>
                            <button onClick={onRegister}>
                                Create an account</button>
                        </li>
                        <li>
                            <a href="/dashboard">
                                My dashboard</a>
                        </li>
                    </ul>
                </div>

            </div>
            <div className="border-t border-slate-700 py-6 text-center text-sm text-gray-400">
                © 2026 Courier & Logistics Management Platform</div>
        </div>
    </footer>
        ;
};

export default Footer;
