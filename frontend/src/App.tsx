import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import Blank from "./pages/Blank";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import RequestList from "./pages/Clients/ClientList";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import GymList from "./pages/Gym/GymList";
import TrainerList from "./pages/Trainer/TrainerList";
import GYMForm from "./components/Forms/GYMForm";
import { Toaster } from "react-hot-toast";
import DeleteGym from "./components/Forms/DeleteGym";
import TrainerForm from "./components/Forms/TrainerForm";
import DeleteTrainer from "./components/Forms/DeleteTrainer";
import CreateClient from "./pages/Clients/Create-Client";
import PackageList from "./pages/Package/PackageList";
import PackageForm from "./components/Packages/PackageForm";
import DeletePackage from "./components/Packages/DeletePackage";
import HealthDashboard from "./components/UserProfile/HealthDashboard";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/", "/signup", "/admin", "/payment_success", "/health-form"];

    if (publicRoutes.includes(location.pathname)) return;

    if (token) {
      fetch(`${SERVER_URL}/auth/check-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) handleLogout();
        })
        .catch(() => handleLogout());
    } else handleLogout();

    function handleLogout() {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [location.pathname]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<SignIn />} />
            <Route path="/admin" element={<SignIn />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="user"><AppLayout /></ProtectedRoute>}>
            <Route path="/user-dashboard" element={<Blank />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/clients" element={<RequestList />} />
            <Route path="/create-client" element={<CreateClient />} />
            <Route path="/health-dashboard/:clientId" element={<HealthDashboard />} />
            <Route path="/gyms" element={<GymList />} />
            <Route path="/add-gym" element={<GYMForm />} />
            <Route path="/edit-gym/:gymId" element={<GYMForm />} />
            <Route path="/delete-gym/:gymId" element={<DeleteGym />} />

            <Route path="/trainers" element={<TrainerList />} />
            <Route path="/add-trainer" element={<TrainerForm />} />
            <Route path="/edit-trainer/:trainerId" element={<TrainerForm />} />
            <Route path="/delete-trainer/:trainerId" element={<DeleteTrainer />} />

            <Route path="/packages" element={<PackageList />} />
            <Route path='/add-package' element={<PackageForm />} />
            <Route path='/edit-package/:packageId' element={<PackageForm />} />
            <Route path='/delete-package/:packageId' element={<DeletePackage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" containerStyle={{
        zIndex: 99999,
      }} reverseOrder={false} />
    </>
  );
}
