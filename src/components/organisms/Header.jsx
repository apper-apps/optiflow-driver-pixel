import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Tableau de bord", path: "/", icon: "BarChart3" },
    { name: "Projets", path: "/projects", icon: "FolderOpen" },
    { name: "Entreprise", path: "/enterprise", icon: "Building2" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </button>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
                <ApperIcon name="Building2" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  OptiFlow EMS
                </h1>
                <p className="text-xs text-gray-500">Enterprise Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all duration-200",
                  isActive(item.path) 
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md" 
                    : "hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} className="h-4 w-4 mr-2" />
                {item.name}
              </Button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;