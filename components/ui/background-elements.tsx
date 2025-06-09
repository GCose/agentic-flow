const BackgroundElements = () => {
  return (
    <>
      <div className="-z-10 fixed inset-0 w-full h-full overflow-hidden pointer-events-none blur-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/70 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/2" />

        <div className="absolute top-1 left-1/8 w-48 h-48 bg-gradient-to-r from-purple-500/15 to-blue-500/40 rounded-full" />

        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-blue-500/40 rounded-full transform -translate-x-1/2 -translate-y-1/2" />

        <div className="absolute bottom-1/5 left-1/3 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full" />

        <div className="absolute bottom-1 right-1/8 w-56 h-56 bg-gradient-to-r from-purple-500/15 to-blue-500/40 rounded-full" />

        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/70 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/2" />
      </div>
    </>
  );
};

export default BackgroundElements;
