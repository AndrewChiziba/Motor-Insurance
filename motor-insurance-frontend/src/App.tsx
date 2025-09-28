import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Quote from "./pages/Quote";
import CoverType from "./pages/CoverType";
import PolicyCreate from "./pages/PolicyCreate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/search"
        element={
          <ProtectedRoute allowedRoles={["Client"]}>
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
            <Quote/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/policycreate"
        element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <PolicyCreate/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
