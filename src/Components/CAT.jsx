const CTA = ({ onRegister, onLogin, isMember = false }) => {
  return <section className="bg-yellow-400 py-16">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 md:flex-row">

      <h2 className="text-center text-3xl font-bold md:text-left md:text-4xl">
        Your first parcel is a few minutes away.</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {isMember ? <a href="/dashboard" className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white">
          Open dashboard</a>
          : <>

            <button onClick={onRegister} className="rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.50)] bg-gray-900 px-6 py-3 font-semibold text-white">
              Create an account</button>

            <button onClick={onLogin} className="rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.50)] px-6 py-3 font-semibold">
              Log in</button>

          </>
        }</div>

    </div>
  </section>
    ;
};

export default CTA;