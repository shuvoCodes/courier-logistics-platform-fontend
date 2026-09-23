import { Truck, Menu, X } from "lucide-react";
// import { Link } from "react-router-dom";

import { useContext, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../Content/AuthProvider";

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const {authUser,logout} = useContext(AuthContext);
    const links = [["Services", "#services"], ["How it works", "#how"], ["Fees", "#fees"], ["Track a parcel", "#track"]];
    
    // console.log('nav', authUser);
    

return <nav className="sticky top-0 z-50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

            <a href="#top" className="flex items-center gap-3">
                <span className="rounded-lg bg-amber-500 p-3 text-white">
                    <Truck />
                </span>
                <span className="font-bold">
                    Courier & Logistics<small className="block text-xs font-normal text-gray-500">
                        Management Platform</small>
                </span>
            </a>

            <div className={`${open ? "absolute left-0 top-full flex w-full flex-col bg-white p-4 shadow-md" : "hidden"} gap-6 md:static md:flex md:flex-row md:items-center md:bg-transparent md:p-0 md:shadow-none`}>
                {links.map(([name, href]) =>
                    <a onClick={() =>
                        setOpen(false)} href={href} key={name} className="text-gray-600 hover:text-blue-600">
                        {name}</a>
                )}</div>

            <div className="flex items-center gap-3">
                {authUser ? <div><Link to={ authUser.role == 'admin' ? '/admin' : '/user'} className="rounded-lg bg-amber-500 px-4 py-2 text-white">
                    Open dashboard</Link>
                    <a onClick={logout} className="rounded-lg bg-amber-500 px-4 py-2 ml-4 text-white">
                    Logout </a>
                    </div>
                    : <>
                        <Link to="/login" className="rounded-lg bg-amber-500 px-4 py-2 text-white">
                            Login</Link>
                        <Link to="/login" className="rounded-lg bg-amber-500 px-4 py-2 text-white">
                            Send a parcel</Link>
                    </>
                }<button className="md:hidden" onClick={() =>
                    setOpen(!open)}>
                    {open ? <X />
                        : <Menu />
                    }</button>
            </div>

        </div>
    </nav>
        ;;
};

export default Navbar;
