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
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'users':
        return <UserManagement onNavigate={setCurrentPage} />;
      case 'verification':
        return <Verification onNavigate={setCurrentPage} />;
      case 'escrow':
        return <EscrowPayments onNavigate={setCurrentPage} />;
      case 'inspection':
        return <InspectionReview onNavigate={setCurrentPage} />;
      case 'reports':
        return <Reports onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'logs':
        return <SystemLogs onNavigate={setCurrentPage} />;
      case '2fa':
        return <Admin2FA onBack={() => setCurrentPage('login')} onVerify={() => setCurrentPage('dashboard')} />;
      case 'login':
      default:
        return <AdminLogin onLogin={() => setCurrentPage('2fa')} />;
    }
  };

  return (
    <LanguageProvider>
      {renderPage()}
    </LanguageProvider>
  );
}

export default App;
