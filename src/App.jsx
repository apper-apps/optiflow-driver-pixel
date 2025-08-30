import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import ProjectsList from "@/components/pages/ProjectsList";
import ProjectDetail from "@/components/pages/ProjectDetail";
import EnterpriseHub from "@/components/pages/EnterpriseHub";
import AdminDocs from "@/components/pages/AdminDocs";
import Finance from "@/components/pages/Finance";
import Logistics from "@/components/pages/Logistics";
import Operations from "@/components/pages/Operations";
import HumanResources from "@/components/pages/HumanResources";
import Secretariat from "@/components/pages/Secretariat";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/enterprise" element={<EnterpriseHub />} />
            <Route path="/enterprise/admin" element={<AdminDocs />} />
            <Route path="/enterprise/finance" element={<Finance />} />
            <Route path="/enterprise/logistics" element={<Logistics />} />
            <Route path="/enterprise/operations" element={<Operations />} />
            <Route path="/enterprise/hr" element={<HumanResources />} />
            <Route path="/enterprise/secretariat" element={<Secretariat />} />
          </Routes>
        </Layout>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;