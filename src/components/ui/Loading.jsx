import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-md bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-500"></div>
        <p className="text-gray-500 text-sm">Chargement en cours...</p>
      </div>
    </div>
  );
};

export default Loading;