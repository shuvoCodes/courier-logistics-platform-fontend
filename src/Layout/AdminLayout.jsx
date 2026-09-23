import { useContext } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineLogout, MdOutlineProductionQuantityLimits, MdOutlineSpatialTracking } from "react-icons/md";
import { PiUserListBold } from "react-icons/pi";
import { Link, Outlet } from "react-router";
import { AuthContext } from "../Content/AuthProvider";

const AdminLayout = () => {
    const {logout} = useContext(AuthContext);
    return (
        <div >
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
                <div className="drawer-content">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-base-300">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-Link">
                            {/* Sidebar toggle icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                        </label>
                        <div className="px-4">Admin Dashboard</div>
                    </nav>
                    {/* Page content here */}
                    <div className="p-4">

                        <Outlet />

                    </div>
                </div>

                <div className="drawer-side is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                        {/* Sidebar content here */}
                        <ul className="menu w-full grow">
                            {/* List item */}
                            <li>
                                <Link  to={'/'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                    {/* Home icon */}
                                    <Link>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                    </Link>
                                    <Link  to={'/'} className="is-drawer-close:hidden">Homepage</Link>
                                </Link>
                            </li>
                             {/* List item */}
                            <li>
                                <Link  to={'/admin'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="User List">
                                    {/* Home icon */}
                                        <Link to={'/admin'}><PiUserListBold /></Link>
                                    <Link to={'/admin'} className="is-drawer-close:hidden">User List</Link>
                                </Link>
                            </li>

                            {/* List item */}
                            <li>
                                <Link to={'/admin/createparcel'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Create Parcel">
                                    {/* Settings icon */}
                                    <Link to={'/admin/createparcel'}><IoIosAddCircleOutline /></Link>
                                    <Link to={'/admin/createparcel'} className="is-drawer-close:hidden">Create Parcel</Link>
                                </Link>
                            </li>
                            {/* List item */}
                            <li>
                                <Link to={'/admin/allparcels'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Parcel">
                                    {/* Settings icon */}
                                    <Link to={'/admin/allparcels'}><MdOutlineProductionQuantityLimits /></Link>
                                    <Link to={'/admin/allparcels'} className="is-drawer-close:hidden">All Parcel</Link>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/tracking'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Track Parcel">
                                    {/* Settings icon */}
                                    <Link to={'/admin/tracking'}><MdOutlineSpatialTracking /></Link>
                                    <Link to={'/admin/tracking'} className="is-drawer-close:hidden">Track Parcel</Link>
                                </Link>
                            </li>
                            <li>
                                <Link to={'/admin/profile'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile">
                                    {/* Settings icon */}
                                    <Link to={'/admin/profile'} ><CgProfile /></Link>
                                    <Link to={'/admin/profile'}  className="is-drawer-close:hidden">Profile</Link>
                                </Link>

                            </li>
                            {/* List item */}
                            <li>
                                <Link onClick={logout} to={'/'} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="All Parcel">
                                    <Link><MdOutlineLogout /></Link>
                                    <Link className="is-drawer-close:hidden">Log Out</Link>
                                </Link>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;