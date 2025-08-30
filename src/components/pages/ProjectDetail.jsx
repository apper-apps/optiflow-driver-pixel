import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getById(parseInt(id));
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const getStatusVariant = (status) => {
    const variants = {
      "En cours": "info",
      "Terminé": "success", 
      "En retard": "destructive",
      "En attente": "warning"
    };
    return variants[status] || "default";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", { 
      style: "currency", 
      currency: "EUR",
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateRemaining = () => {
    if (!project) return 0;
    return (project.budget || 0) - (project.expenses || 0) + (project.advances || 0);
  };

  const getProgressColor = () => {
    if (!project) return "primary";
    if (project.status === "En retard") return "error";
    if (project.status === "Terminé") return "success";
    return "primary";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProject} />;
  if (!project) return <Error message="Projet introuvable" onRetry={() => navigate("/projects")} />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/projects")}
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Géré par {project.responsible}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusVariant(project.status)} className="text-sm px-3 py-1">
            {project.status}
          </Badge>
          <Button variant="outline">
            <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Info" className="h-5 w-5 text-primary-500" />
                <span>Détails du projet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Date de début</h3>
                  <div className="flex items-center text-gray-700">
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-2 text-gray-500" />
                    {format(new Date(project.startDate), "dd MMMM yyyy", { locale: fr })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Date de fin prévue</h3>
                  <div className="flex items-center text-gray-700">
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-2 text-gray-500" />
                    {format(new Date(project.endDate), "dd MMMM yyyy", { locale: fr })}
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Avancement du projet</h3>
                  <span className="text-2xl font-bold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      project.status === "En retard" 
                        ? "bg-gradient-to-r from-red-500 to-red-600" 
                        : project.status === "Terminé"
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gradient-to-r from-primary-500 to-primary-600"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="DollarSign" className="h-5 w-5 text-green-500" />
                <span>Suivi financier</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {formatCurrency(project.budget)}
                  </div>
                  <div className="text-sm text-blue-600">Budget initial</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <div className="text-2xl font-bold text-red-700 mb-1">
                    {formatCurrency(project.expenses)}
                  </div>
                  <div className="text-sm text-red-600">Dépenses engagées</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700 mb-1">
                    {formatCurrency(project.advances)}
                  </div>
                  <div className="text-sm text-yellow-600">Avances reçues</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {formatCurrency(calculateRemaining())}
                  </div>
                  <div className="text-sm text-green-600">Restant dû</div>
                </div>
              </div>

              {/* Spending Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Utilisation du budget</span>
                  <span>{Math.round((project.expenses / project.budget) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      (project.expenses / project.budget) > 0.9 
                        ? "bg-gradient-to-r from-red-500 to-red-600" 
                        : (project.expenses / project.budget) > 0.7
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                    style={{ width: `${Math.min((project.expenses / project.budget) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Paperclip" className="h-5 w-5 text-gray-500" />
                <span>Pièces jointes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.attachments && project.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.attachments.map((attachment, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="FileText" className="h-8 w-8 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">{attachment.size}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ApperIcon name="Download" className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Upload" className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune pièce jointe</p>
                  <Button variant="outline" className="mt-4">
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Ajouter des fichiers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Ring */}
          <Card>
            <CardContent className="p-6 text-center">
              <ProgressRing 
                percentage={project.progress} 
                size="xl" 
                color={getProgressColor()}
                className="mb-4"
              />
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                Progression
              </h3>
              <p className="text-gray-600 text-sm">
                {project.status === "Terminé" ? "Projet terminé" : `${100 - project.progress}% restant`}
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Ajouter une dépense
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
                Télécharger un fichier
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                Gérer l'équipe
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                Planifier une tâche
              </Button>
            </CardContent>
          </Card>

          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Durée totale</span>
                <span className="font-medium">
                  {Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} jours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget/jour</span>
                <span className="font-medium">
                  {formatCurrency(project.budget / Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24)))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Efficacité budget</span>
                <span className={`font-medium ${
                  (project.expenses / project.budget) < 0.8 ? 'text-green-600' : 
                  (project.expenses / project.budget) < 0.95 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(project.expenses / project.budget) < 0.8 ? 'Excellent' : 
                   (project.expenses / project.budget) < 0.95 ? 'Correct' : 'À surveiller'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;