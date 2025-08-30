import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { documentService } from "@/services/api/documentService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const AdminDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const documentTypes = [
    { value: "all", label: "Tous les types" },
    { value: "Contrat", label: "Contrats" },
    { value: "Convention", label: "Conventions" },
    { value: "Statut", label: "Statuts" },
    { value: "Procédure", label: "Procédures" },
    { value: "Certificat", label: "Certificats" },
    { value: "Autre", label: "Autres" }
  ];

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentService.getAll();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    let filtered = documents;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedType]);

  const getTypeVariant = (type) => {
    const variants = {
      "Contrat": "info",
      "Convention": "success",
      "Statut": "warning", 
      "Procédure": "secondary",
      "Certificat": "default",
      "Autre": "outline"
    };
    return variants[type] || "outline";
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf": return "FileText";
      case "doc":
      case "docx": return "FileText";
      case "xls":
      case "xlsx": return "Sheet";
      case "jpg":
      case "jpeg":
      case "png": return "Image";
      default: return "File";
    }
  };

  const handleUploadDocument = () => {
    toast.info("Fonctionnalité d'upload en développement");
  };

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadDocuments} />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Documentation Administrative
          </h1>
          <p className="text-gray-600">
            Archivage et recherche de documents administratifs
          </p>
        </div>
        <Button
          onClick={handleUploadDocument}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
          Télécharger un document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{documents.length}</div>
              <div className="text-blue-100">Total documents</div>
            </div>
            <ApperIcon name="FileText" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {documents.filter(d => d.type === "Contrat").length}
              </div>
              <div className="text-green-100">Contrats</div>
            </div>
            <ApperIcon name="FileContract" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {documents.filter(d => d.type === "Certificat").length}
              </div>
              <div className="text-yellow-100">Certificats</div>
            </div>
            <ApperIcon name="Award" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {documents.filter(d => 
                  new Date(d.date).getFullYear() === new Date().getFullYear()
                ).length}
              </div>
              <div className="text-purple-100">Cette année</div>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Rechercher par titre ou mot-clé..."
          />
        </div>
        <div className="min-w-48">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 && searchQuery ? (
        <Empty 
          title="Aucun document trouvé"
          description="Aucun document ne correspond à votre recherche."
          icon="Search"
        />
      ) : filteredDocuments.length === 0 ? (
        <Empty 
          title="Aucun document"
          description="Commencez par télécharger vos premiers documents administratifs."
          actionLabel="Télécharger un document"
          onAction={handleUploadDocument}
          icon="Upload"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc) => (
            <Card 
              key={doc.Id}
              className="hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <ApperIcon 
                        name={getFileIcon(doc.fileUrl)} 
                        className="h-6 w-6 text-gray-600" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {doc.title}
                        </h3>
                        <Badge variant={getTypeVariant(doc.type)}>
                          {doc.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                          {format(new Date(doc.date), "dd MMM yyyy", { locale: fr })}
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Building2" className="h-4 w-4 mr-1" />
                          {doc.department}
                        </div>
                      </div>
                      
                      {doc.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.keywords.slice(0, 3).map((keyword, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                          {doc.keywords.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{doc.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="icon">
                      <ApperIcon name="Eye" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ApperIcon name="Download" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ApperIcon name="Share" className="h-4 w-4" />
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

export default AdminDocs;