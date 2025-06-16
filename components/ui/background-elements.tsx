const BackgroundElements = () => {
  const pathwaysConfig = [
    {
      id: 1,
      d: "M-100,60 Q400,40 800,70 Q1200,100 1600,80", // top
      gradient: "pathGradient1",
      strokeWidth: 2.2,
      dashArray: "20 80",
      glowColor: "rgba(0,255,255,0.6)",
      animationDuration: "6s",
      animationDirection: "normal",
    },
    {
      id: 2,
      d: "M1600,140 Q1200,120 800,150 Q400,180 -100,160", // after top
      gradient: "pathGradient2",
      strokeWidth: 1.8,
      dashArray: "15 85",
      glowColor: "rgba(147,51,234,0.5)",
      animationDuration: "18s",
      animationDirection: "reverse",
    },
    {
      id: 3,
      d: "M-100,220 Q400,200 800,230 Q1200,260 1600,240", // above center top
      gradient: "pathGradient3",
      strokeWidth: 1.5,
      dashArray: "25 75",
      glowColor: "rgba(59,130,246,0.4)",
      animationDuration: "12s",
      animationDirection: "normal",
    },
    {
      id: 5,
      d: "M-100,380 Q400,360 800,390 Q1200,420 1600,400", // center
      gradient: "pathGradient2",
      strokeWidth: 2.4,
      dashArray: "30 70",
      glowColor: "rgba(147,51,234,0.7)",
      animationDuration: "22s",
      animationDirection: "normal",
    },
    {
      id: 7,
      d: "M-100,540 Q400,520 800,550 Q1200,580 1600,560", // below center bottom
      gradient: "pathGradient1",
      strokeWidth: 1.4,
      dashArray: "16 84",
      glowColor: "rgba(0,255,255,0.3)",
      animationDuration: "10s",
      animationDirection: "reverse",
    },
    {
      id: 9,
      d: "M-100,700 Q400,680 800,710 Q1200,740 1600,720", // bottom
      gradient: "pathGradient3",
      strokeWidth: 1.9,
      dashArray: "14 86",
      glowColor: "rgba(59,130,246,0.5)",
      animationDuration: "7s",
      animationDirection: "reverse",
    },
    {
      id: 10,
      d: "M1600,780 Q1200,760 800,790 Q400,820 -100,800", // very bottom
      gradient: "pathGradient1",
      strokeWidth: 1.3,
      dashArray: "12 88",
      glowColor: "rgba(0,255,255,0.3)",
      animationDuration: "20s",
      animationDirection: "normal",
    },
    {
      id: 11,
      d: "M-100,860 Q400,840 800,870 Q1200,900 1600,880", // after very bottom
      gradient: "pathGradient3",
      strokeWidth: 1.6,
      dashArray: "18 82",
      glowColor: "rgba(59,130,246,0.4)",
      animationDuration: "14s",
      animationDirection: "normal",
    },
  ];

  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 blur-3xl">
        <div className="absolute top-0 right-0 w-[25vw] h-[25vw] bg-gradient-to-bl from-blue-500 to-transparent rounded-full transform translate-x-1/3 -translate-y-1/2 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]" />
        <div className="absolute top-1 left-1/8 w-[15vw] h-[15vw] bg-gradient-to-r from-purple-500/15 to-blue-500/20 rounded-full drop-shadow-[0_0_30px_rgba(147,51,234,0.8)]" />
        <div className="absolute top-1/2 left-1/2 w-[20vw] h-[20vw] bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_50px_rgba(59,130,246,0.8)]" />
        <div className="absolute bottom-1 right-4 w-[18vw] h-[18vw] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full drop-shadow-[0_0_35px_rgba(147,51,234,0.8)]" />
        <div className="absolute bottom-0 left-0 w-[25vw] h-[25vw] bg-gradient-to-tr from-blue-500 to-transparent rounded-full transform -translate-x-1/3 translate-y-1/2 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]" />
      </div>

      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 blur-xs">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="pathGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="cyan" stopOpacity="0.8" />
              <stop offset="50%" stopColor="blue" stopOpacity="0.6" />
              <stop offset="100%" stopColor="purple" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="pathGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="purple" stopOpacity="0.8" />
              <stop offset="50%" stopColor="blue" stopOpacity="0.6" />
              <stop offset="100%" stopColor="cyan" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="pathGradient3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="blue" stopOpacity="0.8" />
              <stop offset="50%" stopColor="cyan" stopOpacity="0.6" />
              <stop offset="100%" stopColor="purple" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {pathwaysConfig.map((pathway) => (
            <path
              key={pathway.id}
              d={pathway.d}
              stroke={`url(#${pathway.gradient})`}
              strokeWidth={pathway.strokeWidth}
              fill="none"
              style={{
                filter: `drop-shadow(0 0 6px ${pathway.glowColor})`,
                strokeDasharray: pathway.dashArray,
                strokeDashoffset: 0,
                animation: `dash-flow-${pathway.animationDirection} ${pathway.animationDuration} ease-in-out infinite`,
              }}
            />
          ))}
        </svg>
      </div>
    </>
  );
};

export default BackgroundElements;
