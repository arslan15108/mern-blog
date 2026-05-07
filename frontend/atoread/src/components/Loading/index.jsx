const SkeletonCard = () => {
  return (
    <div className="border border-gray-300/20 rounded-lg shadow animate-pulse max-w-4xl mx-auto mt-8 p-3">
      {/* Image */}
      <div className="w-full h-40 bg-gray-300 rounded-md mb-4"></div>

      {/* Title */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

      {/* Text lines */}
      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  );
};

export default SkeletonCard;