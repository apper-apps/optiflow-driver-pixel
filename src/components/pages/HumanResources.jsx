import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { employeeService } from "@/services/api/employeeService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const HumanResources = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = [
    { value: "all", label: "Tous les services" },
    { value: "Direction", label: "Direction" },
    { value: "Administration", label: "Administration" },
    { value: "Opérations", label: "Opérations" },
    { value: "Logistique", label: "Logistique" },
    { value: "Finance", label: "Finance" }
  ];

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    let filtered = employees;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(employee => employee.department === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, selectedDepartment]);

  const getStatusVariant = (status) => {
    const variants = {
      "Actif": "success",
      "Congé": "warning",
      "Absent": "destructive",
      "Formation": "info"
    };
    return variants[status] || "default";
  };

  const calculateStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === "Actif").length;
    const onLeave = employees.filter(emp => emp.status === "Congé").length;
    const absent = employees.filter(emp => emp.status === "Absent").length;
    const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    
    return { total, active, onLeave, absent, totalSalary };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", { 
      style: "currency", 
      currency: "EUR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAddEmployee = () => {
    toast.info("Fonctionnalité d'ajout en développement");
  };

  const handleViewProfile = (employeeId) => {
    toast.info("Consultation du profil en développement");
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadEmployees} />;

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ressources Humaines
          </h1>
          <p className="text-gray-600">
            Gestion du personnel, présences et informations salariales
          </p>
        </div>
        <Button
          onClick={handleAddEmployee}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100">Total employés</div>
            </div>
            <ApperIcon name="Users" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-green-100">Présents</div>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.onLeave}</div>
              <div className="text-yellow-100">En congé</div>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSalary)}</div>
              <div className="text-purple-100">Masse salariale</div>
            </div>
            <ApperIcon name="DollarSign" className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Rechercher par nom ou poste..."
          />
        </div>
        <div className="min-w-48">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          >
            {departments.map(dept => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees List */}
      {filteredEmployees.length === 0 && searchQuery ? (
        <Empty 
          title="Aucun employé trouvé"
          description="Aucun employé ne correspond à votre recherche."
          icon="Search"
        />
      ) : filteredEmployees.length === 0 ? (
        <Empty 
          title="Aucun employé"
          description="Commencez par ajouter vos premiers employés."
          actionLabel="Ajouter un employé"
          onAction={handleAddEmployee}
          icon="UserPlus"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card 
              key={employee.Id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
              onClick={() => handleViewProfile(employee.Id)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {employee.photo ? (
                      <img 
                        src={employee.photo}
                        alt={employee.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <ApperIcon name="User" className="h-8 w-8 text-primary-600" />
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      employee.status === "Actif" ? "bg-green-500" :
                      employee.status === "Congé" ? "bg-yellow-500" :
                      employee.status === "Absent" ? "bg-red-500" : "bg-blue-500"
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <p className="text-gray-600 text-sm">{employee.position}</p>
                    <p className="text-gray-500 text-xs">{employee.department}</p>
                  </div>
                  <Badge variant={getStatusVariant(employee.status)}>
                    {employee.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Embauche:</span>
                    <div className="font-medium">
                      {format(new Date(employee.startDate), "MMM yyyy", { locale: fr })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Salaire:</span>
                    <div className="font-medium">{formatCurrency(employee.salary)}</div>
                  </div>
                </div>

                {employee.skills && employee.skills.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Compétences:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {employee.skills.slice(0, 3).map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{employee.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {employee.lastTraining && (
                  <div className="text-sm">
                    <span className="text-gray-500">Dernière formation:</span>
                    <div className="font-medium">{employee.lastTraining}</div>
                  </div>
                )}

                {employee.performance && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Performance</span>
                      <span>{employee.performance}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${(employee.performance / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Fonctionnalité en développement");
                    }}
                  >
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                    Présence
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Fonctionnalité en développement");
                    }}
                  >
                    <ApperIcon name="FileText" className="h-4 w-4 mr-1" />
                    Dossier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HumanResources;