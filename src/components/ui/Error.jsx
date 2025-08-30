import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Une erreur s'est produite", onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  );
};

export default Error;