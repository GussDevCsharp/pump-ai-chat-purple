
const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-pump-purple rounded-full animate-[bounce_1s_infinite_100ms]"></div>
      <div className="w-2 h-2 bg-pump-purple rounded-full animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-2 h-2 bg-pump-purple rounded-full animate-[bounce_1s_infinite_300ms]"></div>
    </div>
  );
};

export default LoadingDots;
