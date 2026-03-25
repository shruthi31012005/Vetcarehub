import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import api,{setAuthToken} from "../services/api";

/* ================= LAYOUTS ================= */
import VetLayout from "../layouts/VetLayout";
import AdminLayout from "../layouts/AdminLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import Logout from "../pages/Logout";

/* ================= OWNER PAGES ================= */
import OwnerDashboard from "../pages/owner/Dashboard";
import OwnerMyAnimals from "../pages/owner/MyAnimals";
import OwnerAddAnimal from "../pages/owner/AddAnimal";
import OwnerDiseasePrediction from "../pages/owner/DiseasePrediction";
import OwnerRiskPrediction from "../pages/owner/RiskPrediction";
import OwnerHealthRecords from "../pages/owner/HealthRecords";
import OwnerVaccinations from "../pages/owner/Vaccinations";
import OwnerAppointments from "../pages/owner/Appointments";
import OwnerAIAssistant from "../pages/owner/AIAssistant";
import ProfileSettings from "../pages/ProfileSettings";
import AnimalDetails from "../pages/owner/AnimalDetails";
import PredictionResult from "../pages/owner/PredictionResult";
import PredictionDetail from "../pages/owner/PredictionDetail";
import EditAnimal from "../pages/owner/EditAnimal";
import OwnerReport from "../pages/owner/report/report";


/* ================= VET PAGES ================= */
import VetOverview from "../pages/vet/Overview";
import VetDashboard from "../pages/vet/Dashboard";
import VetCases from "../pages/vet/Cases";
import VetAppointments from "../pages/vet/Appointments";
import VetAIAssistant from "../pages/vet/AIAssistant";
import VetAddAnimal from "../pages/vet/AddAnimal";
import VetHealthRecords from "../pages/vet/HealthRecords";
import VetDiseasePrediction from "../pages/vet/DiseasePrediction";
import VetRiskPrediction from "../pages/vet/RiskPrediction";
import VetVaccinations from "../pages/vet/Vaccinations";
import GlobalOutbreakDashboard from "../pages/vet/GlobalOutbreakDashboard";
import CaseDetail from "../pages/vet/CaseDetail";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminAnimals from "../pages/admin/Animals";
import AdminDiseases from "../pages/admin/Diseases";
import AdminAppointments from "../pages/admin/Appointments";
import AdminReports from "../pages/admin/Reports";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PublicHome from "../pages/PublicHome";

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("access");

  if (!token) {
    setLoading(false);
    return;
  }

  setAuthToken(token);

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/profile/");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);
  if (loading) return <div>Loading...</div>;

  return (
    
      <Routes>

        {/* ================= OWNER ROUTES ================= */}

        <Route
          path="/owner"
          element={
            <OwnerLayout>
              <OwnerDashboard />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/report/:animal_id"
          element={<report/>
          }
        />
        <Route
          path="/owner/prediction-result"
          element={<PredictionResult />}
        />
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/owner/animals"
          element={
            <OwnerLayout>
              <OwnerMyAnimals />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/add-animal"
          element={
            <OwnerLayout>
              <OwnerAddAnimal />
            </OwnerLayout>
          }
        />
        <Route
          path="/owner/edit-animal/:id"
          element={<OwnerLayout><EditAnimal /></OwnerLayout>}
        />

        <Route
          path="/owner/disease-prediction"
          element={
            <OwnerLayout>
              <OwnerDiseasePrediction />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/risk-prediction"
          element={
            <OwnerLayout>
              <OwnerRiskPrediction />
            </OwnerLayout>
          }
        />
        <Route path="/owner/health-records/:id" element={<PredictionDetail /> } />

        <Route
          path="/owner/health-records"
          element={
            <OwnerLayout>
              <OwnerHealthRecords />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/vaccinations"
          element={
            <OwnerLayout>
              <OwnerVaccinations />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/appointments"
          element={
            <OwnerLayout>
              <OwnerAppointments />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/ai-assistant"
          element={
            <OwnerLayout>
              <OwnerAIAssistant />
            </OwnerLayout>
          }
        />

        <Route
          path="/owner/profile"
          element={
            <OwnerLayout>
              <ProfileSettings />
            </OwnerLayout>
          }
        />

        <Route
          path="/vet/profile"
          element={
            <VetLayout>
              <ProfileSettings />
            </VetLayout>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <ProfileSettings />
            </AdminLayout>
          }
        />

        {/* ================= VET ROUTES ================= */}

        <Route
          path="/vet"
          element={
            <VetLayout>
              <VetOverview />
            </VetLayout>
          }
        />

        <Route 
        path="/vet/cases/:id" 
        element={<CaseDetail />}
        />

        <Route
          path="/vet/outbreak-dashboard"
          element={<GlobalOutbreakDashboard />}
        />


        <Route
          path="/vet/prediction-result"
          element={<PredictionResult />}
        />
        
        <Route path="/vet/health-records/:id" element={<PredictionDetail /> } />

        <Route
          path="/vet/health-records"
          element={
            <VetLayout>
              <VetHealthRecords />
            </VetLayout>
          }
        />
        <Route
          path="/vet/vaccinations"
          element={
            <VetLayout>
              <VetVaccinations />
            </VetLayout>
          }
        />

        <Route
          path="/vet/dashboard"
          element={
            <VetLayout>
              <VetDashboard />
            </VetLayout>
          }
        />

        <Route
          path="/vet/cases"
          element={
            <VetLayout>
              <VetCases />
            </VetLayout>
          }
        />
        <Route
          path="/vet/appointments"
          element={
            <VetLayout>
              <VetAppointments />
            </VetLayout>
          }
        />

        <Route
          path="/vet/ai"
          element={
            <VetLayout>
              <VetAIAssistant />
            </VetLayout>
          }
        />

        <Route
          path="/vet/add-animal"
          element={
            <VetLayout>
              <VetAddAnimal />
            </VetLayout>
          }
        />

        <Route
          path="/vet/disease-prediction"
          element={
            <VetLayout>
              <VetDiseasePrediction />
            </VetLayout>
          }
        />

        <Route
          path="/vet/risk-prediction"
          element={
            <VetLayout>
              <VetRiskPrediction />
            </VetLayout>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/animals"
          element={
            <AdminLayout>
              <AdminAnimals />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/diseases"
          element={
            <AdminLayout>
              <AdminDiseases />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <AdminLayout>
              <AdminAppointments />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminLayout>
              <AdminReports />
            </AdminLayout>
          }
        />
        <Route
          path="/owner/book-appointment"
          element={
            <OwnerLayout>
              <OwnerAppointments />
            </OwnerLayout>
          }
        />
        <Route
          path="/owner/animal/:id"
          element={
            <OwnerLayout>
              <AnimalDetails />
            </OwnerLayout>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    
  );
};

export default AppRoutes;