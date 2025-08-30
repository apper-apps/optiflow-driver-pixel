import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200",
    destructive: "bg-gradient-to-r from-error to-red-600 text-white shadow hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200",
    outline: "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transform hover:scale-105 transition-all duration-200",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow hover:from-secondary-600 hover:to-secondary-700 transform hover:scale-105 transition-all duration-200",
    ghost: "hover:bg-gray-100 hover:text-gray-900 transform hover:scale-105 transition-all duration-200",
    link: "text-primary-500 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;