import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { operationService } from "@/services/api/operationService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const Operations = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const loadOperations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await operationService.getAll();
      setOperations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperations();
  }, []);

  const getFilteredOperations = () => {
    return operations.filter(op => op.date === selectedDate);
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Planifiée": "info",
      "En cours": "warning",
      "Terminée": "success",
      "Annulée": "destructive"
    };
    return variants[status] || "default";
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      "Haute": "destructive",
      "Moyenne": "warning", 
      "Basse": "success"
    };
    return variants[priority] || "default";
  };

  const getTodayStats = () => {
    const todayOps = getFilteredOperations();
    const total = todayOps.length;
    const completed = todayOps.filter(op => op.status === "Terminée").length;
    const inProgress = todayOps.filter(op => op.status === "En cours").length;
    const planned = todayOps.filter(op => op.status === "Planifiée").length;
    
    return { total, completed, inProgress, planned };
  };

  const handleAddOperation = () => {
    toast.info("Fonctionnalité d'ajout en développement");
  };

  const handleViewReport = (operationId) => {
    toast.info("Consultation du rapport en développement");
  };

  const handleAddReport = (operationId) => {
    toast.info("Fonctionnalité de rapport en développement");
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadOperations} />;

  const filteredOperations = getFilteredOperations();
  const stats = getTodayStats();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Opérations
          </h1>
          <p className="text-gray-600">
            Suivi des activités terrain et rapports journaliers
          </p>
        </div>
        <Button
          onClick={handleAddOperation}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Planifier une activité
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100">Activités du jour</div>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-green-100">Terminées</div>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-yellow-100">En cours</div>
            </div>
            <ApperIcon name="Play" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.planned}</div>
              <div className="text-purple-100">Planifiées</div>
            </div>
            <ApperIcon name="Clock" className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <ApperIcon name="Calendar" className="h-5 w-5 text-gray-500" />
          <label className="font-medium text-gray-700">Date sélectionnée:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
          <span className="text-gray-600">
            ({filteredOperations.length} activité{filteredOperations.length !== 1 ? "s" : ""})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Operations List */}
          {filteredOperations.length === 0 ? (
            <Empty 
              title="Aucune activité planifiée"
              description="Aucune activité n'est planifiée pour cette date."
              actionLabel="Planifier une activité"
              onAction={handleAddOperation}
              icon="Calendar"
            />
          ) : (
            <div className="space-y-4">
              {filteredOperations.map((operation) => (
                <Card 
                  key={operation.Id}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-lg">{operation.title}</CardTitle>
                          <Badge variant={getStatusVariant(operation.status)}>
                            {operation.status}
                          </Badge>
                          <Badge variant={getPriorityVariant(operation.priority)}>
                            {operation.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{operation.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                            {operation.location}
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Users" className="h-4 w-4 mr-1" />
                            {operation.team}
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                            {operation.startTime} - {operation.endTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddReport(operation.Id)}
                        >
                          <ApperIcon name="FileText" className="h-4 w-4 mr-1" />
                          Rapport
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Equipment */}
                      {operation.equipment && operation.equipment.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Équipement requis</h4>
                          <div className="flex flex-wrap gap-2">
                            {operation.equipment.map((item, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Progress */}
                      {operation.progress !== undefined && (
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Avancement</span>
                            <span>{operation.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${operation.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Reports */}
                      {operation.reports && operation.reports.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Rapports ({operation.reports.length})
                          </h4>
                          <div className="space-y-2">
                            {operation.reports.slice(0, 2).map((report, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-2">
                                  <ApperIcon name="FileText" className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{report.title}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewReport(report.id)}
                                >
                                  <ApperIcon name="Eye" className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {operation.reports.length > 2 && (
                              <p className="text-xs text-gray-500">
                                +{operation.reports.length - 2} autre{operation.reports.length - 2 > 1 ? "s" : ""} rapport{operation.reports.length - 2 > 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleAddOperation}
                className="w-full justify-start bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Planifier une activité
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                Nouveau rapport
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="Camera" className="h-4 w-4 mr-2" />
                Ajouter des photos
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                Exporter planning
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Vue hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => {
                  const dayCount = Math.floor(Math.random() * 5) + 1;
                  const isToday = index === new Date().getDay() - 1;
                  
                  return (
                    <div 
                      key={day}
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                        isToday ? "bg-primary-50 border border-primary-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        isToday ? "text-primary-700" : "text-gray-700"
                      }`}>
                        {day}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {dayCount} activité{dayCount > 1 ? "s" : ""}
                        </span>
                        <div className={`h-2 w-8 rounded-full ${
                          isToday ? "bg-primary-500" : "bg-gray-300"
                        }`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Status */}
          <Card>
            <CardHeader>
              <CardTitle>État des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">Équipe A</span>
                  </div>
                  <span className="text-xs text-green-600">Disponible</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-800">Équipe B</span>
                  </div>
                  <span className="text-xs text-yellow-600">En mission</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">Équipe C</span>
                  </div>
                  <span className="text-xs text-blue-600">Maintenance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Operations;