import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import UserLayout from "./layout/UserLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import UserLogin from "./pages/AuthPages/UserLogin";
import Blank from "./pages/Blank";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import RequestList from "./pages/Clients/ClientList";
import UserDataTableRes from "./pages/UserDataTable/UserDataTableRes";
import CreateRequest from "./pages/Clients/CreateRequest";
import { useEffect } from "react";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import HealthReportForm from "./pages/ClientPages/HealthReportForm";
import ClientProfile from "./pages/ClientProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDetails from "./components/UserProfile/ClientDetails";
import HealthLifestyleForm from "./pages/HealthLifestyleForm";
import SugarInputForm from "./pages/ClientPages/SugarInputForm";
import WeightInputForm from "./pages/ClientPages/WeightInputForm";
import SignUp from "./pages/AuthPages/SignUp";
import GymList from "./pages/Gym/GymList";
import TrainerList from "./pages/Trainer/TrainerList";
import GYMForm from "./components/Forms/GYMForm";
import { Toaster } from "react-hot-toast";
import DeleteGym from "./components/Forms/DeleteGym";
import TrainerForm from "./components/Forms/TrainerForm";
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
            <Route path="/" element={<UserLogin />} />
            <Route path="/admin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/health-form" element={<HealthLifestyleForm />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="user"><AppLayout /></ProtectedRoute>}>
            <Route path="/user-dashboard" element={<Blank />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/clients" element={<RequestList />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/coaches" element={<UserDataTableRes />} />
            <Route path="/client-details/:userId" element={<ClientDetails />} />

            <Route path="/gyms" element={<GymList />} />
            <Route path="/add-gym" element={<GYMForm />} />
            <Route path="/edit-gym/:gymId" element={<GYMForm />} />
            <Route path="/delete-gym/:gymId" element={<DeleteGym />} />

            <Route path="/trainers" element={<TrainerList />} />
            <Route path="/add-trainer" element={<TrainerForm />} />
            <Route path="/edit-trainer/:trainerId" element={<TrainerForm />} />
          </Route>

          <Route element={<ProtectedRoute allowedRole="patient"><UserLayout /></ProtectedRoute>}>
            <Route path="/patient-dashboard" element={<WeightInputForm />} />
            <Route path="/add-report" element={<HealthReportForm />} />
            <Route path="/view-reports" element={<UserDashboard />} />
            <Route path="/view-profile" element={<ClientProfile />} />
            <Route path="/sugar-input" element={<SugarInputForm />} />
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
