import { cn } from "@/utils/cn";

const ProgressRing = ({ 
  percentage, 
  size = "lg", 
  color = "primary",
  showLabel = true,
  className 
}) => {
  const sizes = {
    sm: { width: 60, stroke: 4, radius: 26 },
    md: { width: 80, stroke: 6, radius: 34 },
    lg: { width: 100, stroke: 8, radius: 42 },
    xl: { width: 120, stroke: 10, radius: 50 },
  };

  const colors = {
    primary: "#3498DB",
    success: "#27AE60",
    warning: "#F39C12",
    error: "#E74C3C",
    info: "#3498DB",
  };

  const { width, stroke, radius } = sizes[size];
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={width}
        width={width}
        className="transform -rotate-90"
      >
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={strokeDasharray}
          r={normalizedRadius}
          cx={width / 2}
          cy={width / 2}
        />
        <circle
          stroke={colors[color]}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={width / 2}
          cy={width / 2}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;