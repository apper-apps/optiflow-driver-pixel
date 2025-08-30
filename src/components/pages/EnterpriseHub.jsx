import { useNavigate } from "react-router-dom";
import DepartmentCard from "@/components/molecules/DepartmentCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const EnterpriseHub = () => {
  const navigate = useNavigate();

  const departments = [
    {
      name: "Documentation Admin",
      description: "Archivage des documents administratifs, contrats, conventions et statuts",
      icon: "FileText",
      color: "primary",
      path: "/enterprise/admin"
    },
    {
      name: "Finance",
      description: "Gestion de la caisse, factures, comptes d'exploitation et génération de reçus",
      icon: "DollarSign", 
      color: "success",
      path: "/enterprise/finance"
    },
    {
      name: "Logistique",
      description: "Inventaire du matériel, suivi des véhicules et alertes de maintenance",
      icon: "Truck",
      color: "warning",
      path: "/enterprise/logistics"
    },
    {
      name: "Opérations",
      description: "Suivi des activités terrain, plannings et rapports journaliers",
      icon: "Cog",
      color: "info",
      path: "/enterprise/operations"
    },
    {
      name: "Ressources Humaines", 
      description: "Gestion du personnel, présences, paie et formations",
      icon: "Users",
      color: "accent",
      path: "/enterprise/hr"
    },
    {
      name: "Secrétariat",
      description: "Gestion du courrier, agenda des réunions et notes internes",
      icon: "Mail",
      color: "error",
      path: "/enterprise/secretariat"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion Globale de l'Entreprise
        </h1>
        <p className="text-gray-600">
          Accédez aux différents modules de gestion par service
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-primary-100">Modules actifs</div>
              </div>
              <ApperIcon name="Building2" className="h-8 w-8 text-primary-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-green-100">Disponibilité</div>
              </div>
              <ApperIcon name="Clock" className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-blue-100">Intégration</div>
              </div>
              <ApperIcon name="Zap" className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Modules Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Modules par service
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.path}
              name={dept.name}
              description={dept.description}
              icon={dept.icon}
              color={dept.color}
              onClick={() => navigate(dept.path)}
            />
          ))}
        </div>
      </div>

      {/* Quick Access Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Zap" className="h-5 w-5 text-accent-500" />
            <span>Accès rapide</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate("/enterprise/finance")}
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 text-left group"
            >
              <ApperIcon name="DollarSign" className="h-6 w-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-green-700">Caisse du jour</div>
              <div className="text-sm text-green-600">Gérer les entrées/sorties</div>
            </button>
            
            <button 
              onClick={() => navigate("/enterprise/hr")}
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-left group"
            >
              <ApperIcon name="Users" className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-blue-700">Présences</div>
              <div className="text-sm text-blue-600">Suivi du personnel</div>
            </button>
            
            <button 
              onClick={() => navigate("/enterprise/logistics")}
              className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 text-left group"
            >
              <ApperIcon name="Truck" className="h-6 w-6 text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-yellow-700">Inventaire</div>
              <div className="text-sm text-yellow-600">Matériel et véhicules</div>
            </button>
            
            <button 
              onClick={() => navigate("/enterprise/operations")}
              className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-left group"
            >
              <ApperIcon name="Calendar" className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-medium text-purple-700">Planning</div>
              <div className="text-sm text-purple-600">Activités terrain</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseHub;