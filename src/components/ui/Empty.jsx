import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Aucune donnée",
  description = "Il n'y a actuellement aucun élément à afficher.",
  actionLabel,
  onAction,
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="bg-gray-50 rounded-full p-6 mb-4">
        <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;