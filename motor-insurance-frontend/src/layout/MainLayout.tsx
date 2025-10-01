import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import InsuranceProgress from '../components/InsuranceProgress';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  //  routes that show progress bar
  const showProgressBar = ['/covertype', '/quote', '/createpolicy', '/payment'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {showProgressBar && <InsuranceProgress />}
      <main className={showProgressBar ? '' : 'py-6'}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;