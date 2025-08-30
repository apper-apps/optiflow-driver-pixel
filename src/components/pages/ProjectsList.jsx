import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.responsible.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "En cours": return "info";
      case "Terminé": return "success";
      case "En retard": return "destructive";
      case "En attente": return "warning";
      default: return "default";
    }
  };

  const formatBudget = (amount) => {
    return new Intl.NumberFormat("fr-FR", { 
      style: "currency", 
      currency: "EUR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des projets
          </h1>
          <p className="text-gray-600">
            Suivez l'avancement et les finances de vos projets
          </p>
        </div>
        <Button
          onClick={() => navigate("/projects/new")}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Rechercher par nom, description ou responsable..."
          className="max-w-md"
        />
      </div>

      {/* Projects Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{projects.length}</div>
              <div className="text-blue-100">Total projets</div>
            </div>
            <ApperIcon name="FolderOpen" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === "En cours").length}
              </div>
              <div className="text-green-100">En cours</div>
            </div>
            <ApperIcon name="Play" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === "En retard").length}
              </div>
              <div className="text-yellow-100">En retard</div>
            </div>
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === "Terminé").length}
              </div>
              <div className="text-purple-100">Terminés</div>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 && searchQuery ? (
        <Empty 
          title="Aucun projet trouvé"
          description="Aucun projet ne correspond à votre recherche."
          icon="Search"
        />
      ) : filteredProjects.length === 0 ? (
        <Empty 
          title="Aucun projet"
          description="Créez votre premier projet pour commencer."
          actionLabel="Créer un projet"
          onAction={() => navigate("/projects/new")}
          icon="FolderPlus"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.Id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
              onClick={() => navigate(`/projects/${project.Id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ApperIcon name="User" className="h-4 w-4 mr-1" />
                        {project.responsible}
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                        {format(new Date(project.endDate), "dd MMM yyyy", { locale: fr })}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <ProgressRing 
                      percentage={project.progress} 
                      size="md"
                      color={project.status === "En retard" ? "error" : "primary"}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Status and Budget */}
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Budget total</div>
                      <div className="font-semibold">{formatBudget(project.budget)}</div>
                    </div>
                  </div>

                  {/* Financial Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dépensé</span>
                      <span className="font-medium">{formatBudget(project.expenses)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (project.expenses / project.budget) > 0.9 
                            ? "bg-gradient-to-r from-red-500 to-red-600" 
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${Math.min((project.expenses / project.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0€</span>
                      <span>{formatBudget(project.budget)}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
                      Mis à jour récemment
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.Id}`);
                      }}
                    >
                      <ApperIcon name="ExternalLink" className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;