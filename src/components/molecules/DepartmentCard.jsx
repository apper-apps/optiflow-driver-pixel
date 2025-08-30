import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DepartmentCard = ({ 
  name, 
  description, 
  icon, 
  color = "primary", 
  onClick,
  className 
}) => {
  const colorClasses = {
    primary: "bg-gradient-to-br from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 text-primary-700 border-primary-200",
    accent: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200",
    success: "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200",
    warning: "bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-700 border-yellow-200",
    error: "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-200",
    info: "bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200",
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-lg border-2",
        colorClasses[color],
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 rounded-full bg-white/50 backdrop-blur-sm">
            <ApperIcon name={icon} className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <p className="text-sm opacity-80 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;