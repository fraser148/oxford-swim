import Wave from "react-wavify";

const LayeredWaves = () => {
  return (
    <div className="relative w-full h-[300px] mt-10">
      <Wave
        fill="url(#gradient)"
        paused={false}
        className="h-1/2 absolute top-0"
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3,
        }}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor="#3982F5" />
            <stop offset="100%" stopColor="#09B5D5" />
          </linearGradient>
        </defs>
      </Wave>
      <Wave
        fill="url(#gradient)"
        paused={false}
        className="h-[252px] absolute top-12"
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3,
        }}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor="#3982F5" />
            <stop offset="100%" stopColor="#09B5D5" />
          </linearGradient>
        </defs>
      </Wave>
      <Wave
        fill="url(#gradient)"
        paused={false}
        className="absolute top-24 h-[204px]"
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3,
        }}
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor="#3982F5" />
            <stop offset="100%" stopColor="#09B5D5" />
          </linearGradient>
        </defs>
      </Wave>
    </div>
  );
};

export default LayeredWaves;

