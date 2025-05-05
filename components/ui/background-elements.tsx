const BackgroundElements = () => {
  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* <div className="absolute inset-0 bg-slate-900/[0.03] dark:bg-slate-50/[0.0] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px]" /> */}

        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/2" />

        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/2" />

        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl -z-10 transform -translate-x-1/2 -translate-y-1/2" />

        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-full blur-2xl -z-10" />

        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gradient-to-l from-blue-500/15 to-indigo-500/15 rounded-full blur-2xl -z-10" />

        <div className="absolute top-3/4 right-1/3 w-40 h-40 bg-gradient-to-bl from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl -z-10" />

        <div className="absolute top-1/3 right-1/5 w-32 h-32 bg-gradient-to-tr from-blue-400/10 to-indigo-500/10 rounded-full blur-xl -z-10" />

        <div className="absolute bottom-1/5 left-1/3 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl -z-10" />
      </div>
    </>
  );
};

export default BackgroundElements;
