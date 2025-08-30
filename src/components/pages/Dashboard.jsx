import { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useNavigate } from "react-router-dom";
import { projectService } from "@/services/api/projectService";
import { cashEntryService } from "@/services/api/cashEntryService";
import { employeeService } from "@/services/api/employeeService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projects, cashEntries, employees] = await Promise.all([
        projectService.getAll(),
        cashEntryService.getAll(),
        employeeService.getAll()
      ]);

      // Calculate metrics
      const activeProjects = projects.filter(p => p.status === "En cours");
      const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
      const totalExpenses = projects.reduce((sum, p) => sum + (p.expenses || 0), 0);
      
      const cashBalance = cashEntries.reduce((sum, entry) => {
        return entry.type === "Entrée" ? sum + entry.amount : sum - entry.amount;
      }, 0);

      const unpaidInvoices = Math.floor(Math.random() * 15) + 5; // Mock data
      const activeEmployees = employees.filter(e => e.status === "Actif");

      setDashboardData({
        activeProjects: activeProjects.length,
        cashBalance,
        unpaidInvoices,
        activeEmployees: activeEmployees.length,
        recentProjects: projects.slice(0, 5),
        totalBudget,
        totalExpenses
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre entreprise et de vos projets en cours
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Projets actifs"
          value={dashboardData.activeProjects}
          icon="FolderOpen"
          color="primary"
        />
        <MetricCard
          title="Solde de caisse"
          value={dashboardData.cashBalance}
          icon="DollarSign"
          color="success"
          format="currency"
        />
        <MetricCard
          title="Factures impayées"
          value={dashboardData.unpaidInvoices}
          icon="AlertTriangle"
          color="warning"
        />
        <MetricCard
          title="Agents actifs"
          value={dashboardData.activeEmployees}
          icon="Users"
          color="info"
        />
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Projects Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="FolderOpen" className="h-5 w-5 text-primary-500" />
                <span>Projets récents</span>
              </CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/projects")}
            >
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentProjects.map((project) => (
                <div 
                  key={project.Id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project.Id}`)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-500">{project.responsible}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="h-5 w-5 text-accent-500" />
              <span>Actions rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate("/projects")}
                className="h-24 flex-col space-y-2 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 border-primary-200 hover:from-primary-100 hover:to-primary-200"
                variant="outline"
              >
                <ApperIcon name="Plus" className="h-6 w-6" />
                <span className="text-sm">Nouveau projet</span>
              </Button>
              
              <Button
                onClick={() => navigate("/enterprise/finance")}
                className="h-24 flex-col space-y-2 bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200 hover:from-green-100 hover:to-green-200"
                variant="outline"
              >
                <ApperIcon name="DollarSign" className="h-6 w-6" />
                <span className="text-sm">Caisse</span>
              </Button>
              
              <Button
                onClick={() => navigate("/enterprise/hr")}
                className="h-24 flex-col space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200"
                variant="outline"
              >
                <ApperIcon name="Users" className="h-6 w-6" />
                <span className="text-sm">Personnel</span>
              </Button>
              
              <Button
                onClick={() => navigate("/enterprise")}
                className="h-24 flex-col space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200 hover:from-purple-100 hover:to-purple-200"
                variant="outline"
              >
                <ApperIcon name="Building2" className="h-6 w-6" />
                <span className="text-sm">Entreprise</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-success" />
            <span>Résumé financier</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-700 mb-1">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(dashboardData.totalBudget)}
              </div>
              <div className="text-sm text-blue-600">Budget total projets</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-700 mb-1">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(dashboardData.totalExpenses)}
              </div>
              <div className="text-sm text-red-600">Dépenses engagées</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-700 mb-1">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(dashboardData.totalBudget - dashboardData.totalExpenses)}
              </div>
              <div className="text-sm text-green-600">Solde disponible</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;