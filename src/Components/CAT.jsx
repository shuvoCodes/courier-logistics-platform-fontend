import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../Content/AuthProvider";

const CTA = () => {

  const {authUser}  = useContext(AuthContext);
  return <section className="bg-yellow-400 py-16">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 md:flex-row">

      <h2 className="text-center text-3xl font-bold md:text-left md:text-4xl">
        Your first parcel is a few minutes away.</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {authUser ? <a href="/dashboard" className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white">
          Open dashboard</a>
          : <>

            <Link to={'/registration'} className="rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.50)] bg-gray-900 px-6 py-3 font-semibold text-white">
              Create an account</Link>

            <Link to={'/login'} className="rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.50)] px-6 py-3 font-semibold">
              Log in</Link>

          </>
        }</div>

    </div>
  </section>
    ;
};

export default CTA;