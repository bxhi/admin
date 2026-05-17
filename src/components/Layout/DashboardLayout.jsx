import React, { useState } from 'react';
import { 
    FiHome, FiUsers, FiCheckCircle, FiDollarSign, 
    FiClipboard, FiBarChart2, FiSettings, FiServer, FiLogOut, FiMenu, FiPackage, FiHelpCircle
} from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import authService from '../../api/authService';
import './DashboardLayout.css';

const DashboardLayout = ({ children, activePage, onNavigate, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await authService.logout();
        if (onLogout) onLogout();
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
        { id: 'users', label: 'User Management', icon: <FiUsers /> },
        { id: 'verification', label: 'Verification', icon: <FiCheckCircle /> },
        { id: 'escrow', label: 'Escrow & Payments', icon: <FiDollarSign /> },
        { id: 'inspection', label: 'Inspection Review', icon: <FiClipboard /> },
        { id: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
        { id: 'packs', label: 'Manage Packs', icon: <FiPackage /> },
        { id: 'support', label: 'Support', icon: <FiHelpCircle /> },
        { id: 'logs', label: 'System Logs', icon: <FiServer /> },
    ];

    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const adminName = user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.username || user.email)) : 'Admin User';
    const adminRole = user ? (user.role || 'Super Admin') : 'Super Admin';
    const initials = adminName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="layout-root">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon"></div>
                        <h2>Admin Portal</h2>
                    </div>
                </div>

                <div className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate && onNavigate(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <span className="nav-icon"><FiLogOut /></span>
                        <span className="nav-label">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <FiMenu size={24} />
                        </button>
                        <h2 className="topbar-title">ADMIN DASHBOARD</h2>
                    </div>
                    
                    <div className="topbar-right">
                        <div className="notification-bell">
                            <FaBell />
                            <span className="badge">5</span>
                        </div>
                        <div className="user-profile">
                            <div className="avatar">{initials}</div>
                            <div className="user-info">
                                <span className="name">{adminName}</span>
                                <span className="role">{adminRole}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content-wrapper">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
