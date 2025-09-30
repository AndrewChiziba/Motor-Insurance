// import React from "react";
// import { Navigate } from "react-router-dom";

// interface Props {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }

// const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token) return <Navigate to="/login" replace />;

//   if (!allowedRoles.includes(role || "")) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
  useLayout?: boolean; // New prop to control layout usage
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles, useLayout = true }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role || '')) {
    return <Navigate to="/login" replace />;
  }

  // Wrap with MainLayout for Client routes, render directly for Admin
  if (useLayout && role === 'Client') {
    return <MainLayout>{children}</MainLayout>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;