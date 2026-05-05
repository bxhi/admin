import React, { useState } from 'react';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import Admin2FA from './pages/Admin2FA/Admin2FA';
import Dashboard from './pages/Dashboard/Dashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import Verification from './pages/Verification/Verification';
import EscrowPayments from './pages/EscrowPayments/EscrowPayments';
import InspectionReview from './pages/InspectionReview/InspectionReview';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import SystemLogs from './pages/SystemLogs/SystemLogs';
import PacksManagement from './pages/PacksManagement/PacksManagement';
import Support from './pages/Support/Support';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userToVerify, setUserToVerify] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // If already logged in, go to dashboard
  React.useEffect(() => {
    if (user && user.role === 'admin' && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUserToVerify(userData);
    setCurrentPage('2fa');
  };

  const handleVerificationSuccess = (finalUserData) => {
    setUser(finalUserData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'users':
        return <UserManagement onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'verification':
        return <Verification onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'escrow':
        return <EscrowPayments onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'inspection':
        return <InspectionReview onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'reports':
        return <Reports onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'logs':
        return <SystemLogs onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'packs':
        return <PacksManagement onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'support':
        return <Support onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case '2fa':
        return (
          <Admin2FA 
            user={userToVerify} 
            onBack={() => setCurrentPage('login')} 
            onVerify={handleVerificationSuccess} 
          />
        );
      case 'login':
      default:
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <LanguageProvider>
      {renderPage()}
    </LanguageProvider>
  );
}

export default App;
