import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  icon, 
  color = "primary",
  format = "number",
  className 
}) => {
  const formatValue = (val) => {
    if (format === "currency") {
      return new Intl.NumberFormat("fr-FR", { 
        style: "currency", 
        currency: "EUR" 
      }).format(val);
    }
    if (format === "percentage") {
      return `${val}%`;
    }
    return val?.toLocaleString("fr-FR") || "0";
  };

  const colorClasses = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-600 text-white",
    accent: "bg-gradient-to-br from-accent-500 to-accent-600 text-white",
    success: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white",
    error: "bg-gradient-to-br from-red-500 to-red-600 text-white",
    info: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
  };

  return (
    <Card className={cn("overflow-hidden transform hover:scale-105 transition-all duration-300", className)}>
      <CardContent className="p-0">
        <div className={cn("p-6", colorClasses[color])}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium opacity-90">
                {title}
              </p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">
                  {formatValue(value)}
                </span>
                {trend && (
                  <div className={cn(
                    "flex items-center text-xs",
                    trend > 0 ? "text-green-200" : trend < 0 ? "text-red-200" : "text-gray-200"
                  )}>
                    <ApperIcon 
                      name={trend > 0 ? "TrendingUp" : trend < 0 ? "TrendingDown" : "Minus"} 
                      className="h-3 w-3 mr-1" 
                    />
                    {Math.abs(trend)}%
                  </div>
                )}
              </div>
            </div>
            <div className="opacity-80">
              <ApperIcon name={icon} className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;