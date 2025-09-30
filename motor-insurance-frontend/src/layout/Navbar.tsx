import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const fullname = localStorage.getItem('fullName') || 'User';
  
  // Get user initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Brand */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-blue-600">MotorInsurance</h1>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            {/* <span className="text-gray-700 text-sm font-medium">
              {fullname}
            </span> */}
            
            {/* User avatar */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getInitials(fullname)}
              </div>
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;