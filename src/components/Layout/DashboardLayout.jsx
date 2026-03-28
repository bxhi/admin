import React, { useState } from 'react';
import { 
    FiHome, FiUsers, FiCheckCircle, FiDollarSign, 
    FiClipboard, FiBarChart2, FiSettings, FiServer, FiLogOut, FiMenu 
} from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import './DashboardLayout.css';

const DashboardLayout = ({ children, activePage, onNavigate }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
        { id: 'users', label: 'User Management', icon: <FiUsers /> },
        { id: 'verification', label: 'Verification', icon: <FiCheckCircle /> },
        { id: 'escrow', label: 'Escrow & Payments', icon: <FiDollarSign /> },
        { id: 'inspection', label: 'Inspection Review', icon: <FiClipboard /> },
        { id: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
        { id: 'logs', label: 'System Logs', icon: <FiServer /> },
    ];

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
                    <button className="nav-item logout-btn">
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
                        <h2 className="topbar-title">ADMIN DASHBOARD</h2>
                    </div>
                    
                    <div className="topbar-right">
                        <div className="notification-bell">
                            <FaBell />
                            <span className="badge">5</span>
                        </div>
                        <div className="user-profile">
                            <div className="avatar">AD</div>
                            <div className="user-info">
                                <span className="name">Admin User</span>
                                <span className="role">Super Admin</span>
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
