import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';


import { useAuth } from './hooks/useAuth';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Example: optionally hide Navbar on home page
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        
        

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-4 mt-auto">
          <div className="container-custom text-center">
            <p>&copy; 2024 CodeQuest. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
