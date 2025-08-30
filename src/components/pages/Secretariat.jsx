import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { secretariatService } from "@/services/api/secretariatService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";

const Secretariat = () => {
  const [correspondence, setCorrespondence] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("correspondence");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    type: "entrant",
    subject: "",
    sender: "",
    content: "",
    priority: "Normale"
  });

  const tabs = [
    { id: "correspondence", label: "Courrier", icon: "Mail" },
    { id: "meetings", label: "Réunions", icon: "Calendar" },
    { id: "notes", label: "Notes internes", icon: "FileText" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await secretariatService.getAll();
      setCorrespondence(data.correspondence || []);
      setMeetings(data.meetings || []);
      setNotes(data.notes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTypeVariant = (type) => {
    const variants = {
      "entrant": "info",
      "sortant": "success",
      "urgent": "destructive",
      "important": "warning"
    };
    return variants[type] || "default";
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      "Haute": "destructive",
      "Moyenne": "warning",
      "Normale": "success"
    };
    return variants[priority] || "default";
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

  const calculateStats = () => {
    const totalCorrespondence = correspondence.length;
    const incomingMail = correspondence.filter(c => c.type === "entrant").length;
    const outgoingMail = correspondence.filter(c => c.type === "sortant").length;
    const upcomingMeetings = meetings.filter(m => m.status === "Planifiée").length;
    
    return { totalCorrespondence, incomingMail, outgoingMail, upcomingMeetings };
  };

  const handleAddItem = async () => {
    try {
      if (activeTab === "correspondence") {
        if (!newItem.subject || !newItem.sender) {
          toast.error("Veuillez remplir tous les champs obligatoires");
          return;
        }
        
        const mailData = {
          ...newItem,
          date: new Date().toISOString().split("T")[0]
        };
        
        await secretariatService.addMail(mailData);
        toast.success("Courrier ajouté avec succès");
      }
      
      setShowAddForm(false);
      setNewItem({
        type: "entrant",
        subject: "",
        sender: "",
        content: "",
        priority: "Normale"
      });
      loadData();
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Secrétariat
          </h1>
          <p className="text-gray-600">
            Gestion du courrier, réunions et notes internes
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Nouveau {activeTab === "correspondence" ? "courrier" : activeTab === "meetings" ? "rendez-vous" : "note"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.totalCorrespondence}</div>
              <div className="text-blue-100">Total courriers</div>
            </div>
            <ApperIcon name="Mail" className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.incomingMail}</div>
              <div className="text-green-100">Entrants</div>
            </div>
            <ApperIcon name="ArrowDown" className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.outgoingMail}</div>
              <div className="text-yellow-100">Sortants</div>
            </div>
            <ApperIcon name="ArrowUp" className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
              <div className="text-purple-100">Réunions prévues</div>
            </div>
            <ApperIcon name="Calendar" className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tabs Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-l-4 border-primary-500"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Add Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Nouveau {activeTab === "correspondence" ? "courrier" : activeTab === "meetings" ? "rendez-vous" : "note"}
                  </CardTitle>
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
                {activeTab === "correspondence" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={newItem.type}
                        onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                        className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      >
                        <option value="entrant">Entrant</option>
                        <option value="sortant">Sortant</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objet
                      </label>
                      <Input
                        value={newItem.subject}
                        onChange={(e) => setNewItem({...newItem, subject: e.target.value})}
                        placeholder="Objet du courrier"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {newItem.type === "entrant" ? "Expéditeur" : "Destinataire"}
                      </label>
                      <Input
                        value={newItem.sender}
                        onChange={(e) => setNewItem({...newItem, sender: e.target.value})}
                        placeholder={newItem.type === "entrant" ? "Nom de l'expéditeur" : "Nom du destinataire"}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={newItem.priority}
                        onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                        className="w-full h-10 px-3 py-2 border border-gray-200 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      >
                        <option value="Normale">Normale</option>
                        <option value="Moyenne">Moyenne</option>
                        <option value="Haute">Haute</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu
                      </label>
                      <textarea
                        value={newItem.content}
                        onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                        placeholder="Résumé du contenu..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </>
                )}
                
                <Button 
                  onClick={handleAddItem}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                >
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          )}

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
                <ApperIcon name="Search" className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="Archive" className="h-4 w-4 mr-2" />
                Archives
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info("Fonctionnalité en développement")}
              >
                <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "correspondence" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Mail" className="h-5 w-5 text-blue-500" />
                  <span>Gestion du courrier</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {correspondence.length === 0 ? (
                  <Empty 
                    title="Aucun courrier"
                    description="Commencez par enregistrer votre premier courrier."
                    actionLabel="Ajouter un courrier"
                    onAction={() => setShowAddForm(true)}
                    icon="Mail"
                  />
                ) : (
                  <div className="space-y-4">
                    {correspondence.map((mail) => (
                      <div 
                        key={mail.Id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`p-2 rounded-full ${
                            mail.type === "entrant" 
                              ? "bg-blue-100 text-blue-600" 
                              : "bg-green-100 text-green-600"
                          }`}>
                            <ApperIcon 
                              name={mail.type === "entrant" ? "ArrowDown" : "ArrowUp"} 
                              className="h-4 w-4" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {mail.subject}
                              </h3>
                              <Badge variant={getTypeVariant(mail.type)}>
                                {mail.type}
                              </Badge>
                              <Badge variant={getPriorityVariant(mail.priority)}>
                                {mail.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{mail.type === "entrant" ? "De:" : "À:"} {mail.sender}</span>
                              <span>•</span>
                              <span>{format(new Date(mail.date), "dd MMM yyyy", { locale: fr })}</span>
                            </div>
                            {mail.content && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {mail.content}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="icon">
                            <ApperIcon name="Eye" className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ApperIcon name="Archive" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "meetings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="h-5 w-5 text-green-500" />
                  <span>Agenda des réunions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meetings.length === 0 ? (
                  <Empty 
                    title="Aucune réunion"
                    description="Planifiez votre première réunion."
                    actionLabel="Planifier une réunion"
                    onAction={() => setShowAddForm(true)}
                    icon="Calendar"
                  />
                ) : (
                  <div className="space-y-4">
                    {meetings.map((meeting) => (
                      <div 
                        key={meeting.Id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                              <Badge variant={getStatusVariant(meeting.status)}>
                                {meeting.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                                {format(new Date(meeting.date), "dd MMM yyyy", { locale: fr })}
                              </div>
                              <div className="flex items-center">
                                <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                                {meeting.time}
                              </div>
                              <div className="flex items-center">
                                <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                                {meeting.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                        
                        {meeting.description && (
                          <p className="text-gray-700 text-sm mb-3">{meeting.description}</p>
                        )}
                        
                        {meeting.participants && meeting.participants.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              Participants ({meeting.participants.length}):
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {meeting.participants.map((participant, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {participant}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "notes" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="FileText" className="h-5 w-5 text-yellow-500" />
                  <span>Notes internes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notes.length === 0 ? (
                  <Empty 
                    title="Aucune note"
                    description="Créez votre première note interne."
                    actionLabel="Nouvelle note"
                    onAction={() => setShowAddForm(true)}
                    icon="FileText"
                  />
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div 
                        key={note.Id}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{note.title}</h3>
                          <div className="text-sm text-gray-500">
                            {format(new Date(note.date), "dd MMM yyyy", { locale: fr })}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            Par {note.author}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="Edit" className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="Share" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Secretariat;