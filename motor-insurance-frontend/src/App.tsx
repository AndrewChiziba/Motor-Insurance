import { Routes, Route, Navigate } from "react-router-dom";
import { ProgressProvider } from "./contexts/ProgressContext";
import Login from "./pages/Login";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Quote from "./pages/Quote";
import CoverType from "./pages/CoverType";
import CreatePolicy from "./pages/CreatePolicy";
import Payment from "./pages/Payment";
import AdminVehicles from "./pages/AdminVehicles";
import AdminInsuranceRates from "./pages/AdminInsuranceRates";
import AdminUsers from "./pages/AdminUsers";
import ClientDashboard from "./pages/ClientDashBoard";

function App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Client Routes */}
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["Client", ""]}>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/covertype"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <CoverType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quote"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <Quote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createpolicy"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <CreatePolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected Admin Routes with Dashboard Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/vehicles" />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="insurance-rates" element={<AdminInsuranceRates />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </ProgressProvider>
  );
}

export default App;