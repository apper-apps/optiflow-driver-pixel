import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cashEntryService } from "@/services/api/cashEntryService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const Finance = () => {
  const [cashEntries, setCashEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: "Entrée",
    amount: "",
    category: "",
    description: "",
    receipt: ""
  });

  const categories = [
    "Vente", "Achat", "Salaire", "Frais généraux", 
    "Transport", "Maintenance", "Assurance", "Autre"
  ];

  const loadCashEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cashEntryService.getAll();
      setCashEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashEntries();
  }, []);

  const calculateBalance = () => {
    return cashEntries.reduce((sum, entry) => {
      return entry.type === "Entrée" ? sum + entry.amount : sum - entry.amount;
    }, 0);
  };

  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return cashEntries.filter(entry => 
      new Date(entry.date).toDateString() === today
    );
  };

  const getMonthlyTotal = (type) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return cashEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && 
               entryDate.getFullYear() === currentYear &&
               entry.type === type;
      })
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const handleAddEntry = async () => {
    try {
      if (!newEntry.amount || !newEntry.category || !newEntry.description) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const entryData = {
        ...newEntry,
        amount: parseFloat(newEntry.amount),
        date: new Date().toISOString().split("T")[0]
      };

      await cashEntryService.create(entryData);
      toast.success("Écriture ajoutée avec succès");
      setShowAddForm(false);
      setNewEntry({
        type: "Entrée",
        amount: "",
        category: "",
        description: "",
        receipt: ""
      });
      loadCashEntries();
    } catch (err) {
      toast.error("Erreur lors de l'ajout de l'écriture");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadCashEntries} />;

  const todayEntries = getTodayEntries();
  const monthlyIncome = getMonthlyTotal("Entrée");
  const monthlyExpenses = getMonthlyTotal("Sortie");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Financière
          </h1>
          <p className="text-gray-600">
            Suivi de la caisse et des mouvements financiers
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Nouvelle écriture
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Solde de caisse"
          value={calculateBalance()}
          icon="DollarSign"
          color="primary"
          format="currency"
        />
        <MetricCard
          title="Recettes du mois"
          value={monthlyIncome}
          icon="TrendingUp"
          color="success"
          format="currency"
        />
        <MetricCard
          title="Dépenses du mois"
          value={monthlyExpenses}
          icon="TrendingDown"
          color="error"
          format="currency"
        />
        <MetricCard
          title="Écritures aujourd'hui"
          value={todayEntries.length}
          icon="Calendar"
          color="info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calendar" className="h-5 w-5 text-primary-500" />
                <span>Mouvements du jour</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayEntries.length === 0 ? (
                <Empty 
                  title="Aucun mouvement aujourd'hui"
                  description="Aucune écriture n'a été enregistrée aujourd'hui."
                  icon="Calendar"
                />
              ) : (
                <div className="space-y-3">
                  {todayEntries.map((entry) => (
                    <div 
                      key={entry.Id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          entry.type === "Entrée" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-red-100 text-red-600"
                        }`}>
                          <ApperIcon 
                            name={entry.type === "Entrée" ? "ArrowUp" : "ArrowDown"} 
                            className="h-4 w-4" 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {entry.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.category}
                          </div>
                        </div>
                      </div>
                      <div className={`text-right font-semibold ${
                        entry.type === "Entrée" ? "text-green-600" : "text-red-600"
                      }`}>
                        {entry.type === "Entrée" ? "+" : "-"}{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="History" className="h-5 w-5 text-gray-500" />
                <span>Historique des mouvements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cashEntries.length === 0 ? (
                <Empty 
                  title="Aucun mouvement"
                  description="Commencez par ajouter vos premières écritures comptables."
                  actionLabel="Ajouter une écriture"
                  onAction={() => setShowAddForm(true)}
                  icon="DollarSign"
                />
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cashEntries.slice().reverse().map((entry) => (
                    <div 
                      key={entry.Id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          entry.type === "Entrée" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-red-100 text-red-600"
                        }`}>
                          <ApperIcon 
                            name={entry.type === "Entrée" ? "ArrowUp" : "ArrowDown"} 
                            className="h-3 w-3" 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {entry.description}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <span>{entry.category}</span>
                            <span>•</span>
                            <span>{format(new Date(entry.date), "dd MMM yyyy", { locale: fr })}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${
                        entry.type === "Entrée" ? "text-green-600" : "text-red-600"
                      }`}>
                        {entry.type === "Entrée" ? "+" : "-"}{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Entry Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Nouvelle écriture</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowAddForm(false)}
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de mouvement
                  </label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  >
                    <option value="Entrée">Entrée</option>
                    <option value="Sortie">Sortie</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({...newEntry, category: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Input
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    placeholder="Description du mouvement"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    N° reçu (optionnel)
                  </label>
                  <Input
                    value={newEntry.receipt}
                    onChange={(e) => setNewEntry({...newEntry, receipt: e.target.value})}
                    placeholder="Numéro de reçu"
                  />
                </div>
                
                <Button 
                  onClick={handleAddEntry}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                >
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé mensuel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(monthlyIncome)}
                </div>
                <div className="text-sm text-green-600">Recettes du mois</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(monthlyExpenses)}
                </div>
                <div className="text-sm text-red-600">Dépenses du mois</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(monthlyIncome - monthlyExpenses)}
                </div>
                <div className="text-sm text-blue-600">Résultat du mois</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                Générer un reçu
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                Exporter les données
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="Calculator" className="h-4 w-4 mr-2" />
                Bilan comptable
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Finance;