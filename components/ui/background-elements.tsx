const BackgroundElements = () => {
  return (
    <>
      <div className="fixed inset-0 w-full h-full bg-slate-950 -z-20" />
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 blur-3xl">
        <div className="absolute top-0 right-0 w-[25vw] h-[25vw] bg-gradient-to-bl from-blue-500 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/2 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]" />
        <div className="absolute top-1 left-1/8 w-[15vw] h-[15vw] bg-gradient-to-r from-purple-500/15 to-blue-500/20 rounded-full drop-shadow-[0_0_30px_rgba(147,51,234,0.8)]" />
        <div className="absolute top-1/2 left-1/2 w-[20vw] h-[20vw] bg-gradient-to-r from-purple-500/15 to-blue-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_50px_rgba(59,130,246,0.8)]" />
        <div className="absolute bottom-1 right-4 w-[18vw] h-[18vw] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full drop-shadow-[0_0_35px_rgba(147,51,234,0.8)]" />
        <div className="absolute bottom-0 left-0 w-[25vw] h-[25vw] bg-gradient-to-tr from-blue-500 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/2 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]" />
      </div>
    </>
  );
};

export default BackgroundElements;
