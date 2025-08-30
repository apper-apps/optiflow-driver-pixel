import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { inventoryService } from "@/services/api/inventoryService";
import { toast } from "react-toastify";

const Logistics = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "Toutes catégories" },
    { value: "Véhicule", label: "Véhicules" },
    { value: "Équipement", label: "Équipements" },
    { value: "Outil", label: "Outils" },
    { value: "Matériel", label: "Matériel" },
    { value: "Fourniture", label: "Fournitures" }
  ];

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getAll();
      setInventory(data);
      setFilteredInventory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    let filtered = inventory;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchQuery, selectedCategory]);

  const getStatusVariant = (status) => {
    const variants = {
      "Disponible": "success",
      "En maintenance": "warning",
      "En panne": "destructive",
      "En service": "info"
    };
    return variants[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Disponible": "CheckCircle",
      "En maintenance": "Wrench", 
      "En panne": "AlertTriangle",
      "En service": "Play"
    };
    return icons[status] || "Circle";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Véhicule": "Car",
      "Équipement": "HardHat",
      "Outil": "Wrench",
      "Matériel": "Package",
      "Fourniture": "Box"
    };
    return icons[category] || "Package";
  };

  const calculateStats = () => {
    const total = inventory.length;
    const available = inventory.filter(item => item.status === "Disponible").length;
    const inMaintenance = inventory.filter(item => item.status === "En maintenance").length;
    const outOfOrder = inventory.filter(item => item.status === "En panne").length;
    
    return { total, available, inMaintenance, outOfOrder };
  };

  const handleAddItem = () => {
    toast.info("Fonctionnalité d'ajout en développement");
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadInventory} />;

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Logistique
          </h1>
          <p className="text-gray-600">
            Inventaire du matériel, véhicules et suivi de maintenance
          </p>
        </div>
        <Button
          onClick={handleAddItem}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Ajouter un élément
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-blue-100">Total éléments</div>
            </div>
            <ApperIcon name="Package" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.available}</div>
              <div className="text-green-100">Disponibles</div>
            </div>
            <ApperIcon name="CheckCircle" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.inMaintenance}</div>
              <div className="text-yellow-100">En maintenance</div>
            </div>
            <ApperIcon name="Wrench" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.outOfOrder}</div>
              <div className="text-red-100">En panne</div>
            </div>
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Rechercher par nom ou description..."
          />
        </div>
        <div className="min-w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory List */}
      {filteredInventory.length === 0 && searchQuery ? (
        <Empty 
          title="Aucun élément trouvé"
          description="Aucun élément ne correspond à votre recherche."
          icon="Search"
        />
      ) : filteredInventory.length === 0 ? (
        <Empty 
          title="Inventaire vide"
          description="Commencez par ajouter vos premiers éléments d'inventaire."
          actionLabel="Ajouter un élément"
          onAction={handleAddItem}
          icon="Package"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <Card 
              key={item.Id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <ApperIcon 
                        name={getCategoryIcon(item.category)} 
                        className="h-6 w-6 text-gray-600" 
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(item.status)}>
                    <ApperIcon 
                      name={getStatusIcon(item.status)} 
                      className="h-3 w-3 mr-1" 
                    />
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Quantité:</span>
                    <div className="font-medium">{item.quantity}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Localisation:</span>
                    <div className="font-medium">{item.location}</div>
                  </div>
                </div>

                {item.maintenanceDate && (
                  <div className="text-sm">
                    <span className="text-gray-500">Dernière maintenance:</span>
                    <div className="font-medium">{item.maintenanceDate}</div>
                  </div>
                )}

                {item.nextMaintenance && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm">
                      <span className="text-yellow-700 font-medium">Prochaine maintenance</span>
                      <div className="text-yellow-600">{item.nextMaintenance}</div>
                    </div>
                    <ApperIcon name="Calendar" className="h-4 w-4 text-yellow-500" />
                  </div>
                )}

                {item.alerts && item.alerts.length > 0 && (
                  <div className="space-y-2">
                    {item.alerts.map((alert, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 bg-red-50 text-red-700 rounded-lg text-sm"
                      >
                        <ApperIcon name="AlertTriangle" className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                    Maintenance
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

export default Logistics;