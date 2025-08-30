import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Tableau de bord", path: "/", icon: "BarChart3" },
    { name: "Projets", path: "/projects", icon: "FolderOpen" },
    { name: "Entreprise", path: "/enterprise", icon: "Building2" },
  ];

  const departmentItems = [
    { name: "Documentation Admin", path: "/enterprise/admin", icon: "FileText" },
    { name: "Finance", path: "/enterprise/finance", icon: "DollarSign" },
    { name: "Logistique", path: "/enterprise/logistics", icon: "Truck" },
    { name: "Opérations", path: "/enterprise/operations", icon: "Cog" },
    { name: "Ressources Humaines", path: "/enterprise/hr", icon: "Users" },
    { name: "Secrétariat", path: "/enterprise/secretariat", icon: "Mail" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
              <ApperIcon name="Building2" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary-600">OptiFlow EMS</h2>
              <p className="text-xs text-gray-500">Enterprise Management</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-6 space-y-2">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Navigation principale
            </h3>
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-l-4 border-primary-500"
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Modules entreprise
            </h3>
            {departmentItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                  isActive(item.path)
                    ? "bg-gradient-to-r from-accent-50 to-accent-100 text-accent-700 border-l-4 border-accent-500"
                    : "hover:bg-gray-50 text-gray-600"
                )}
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;