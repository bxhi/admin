import React, { useState } from 'react';
import './SystemLogs.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiSearch, FiDownload, FiInfo, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const mockLogs = [
    {
        id: 1,
        date: '2024-02-15',
        time: '10:30:45',
        level: 'info',
        action: 'User Login',
        user: 'admin@example.com',
        details: 'Successful admin login from IP: 192.168.1.100',
        category: 'authentication'
    },
    {
        id: 2,
        date: '2024-02-15',
        time: '10:28:12',
        level: 'success',
        action: 'Escrow Released',
        user: 'Admin User',
        details: 'Released $5,000 to Sarah Johnson for order ORD-1234',
        category: 'finance'
    },
    {
        id: 3,
        date: '2024-02-15',
        time: '10:25:33',
        level: 'warning',
        action: 'Failed Login Attempt',
        user: 'unknown@example.com',
        details: 'Failed login attempt from IP: 45.123.45.67',
        category: 'authentication'
    },
    {
        id: 4,
        date: '2024-02-15',
        time: '10:20:18',
        level: 'success',
        action: 'Verification Approved',
        user: 'Admin User',
        details: 'Approved verification for John Smith (ID: 1234)',
        category: 'verification'
    },
    {
        id: 5,
        date: '2024-02-15',
        time: '10:15:02',
        level: 'error',
        action: 'Payment Processing Error',
        user: 'System',
        details: 'Payment gateway timeout for transaction TXN-5678',
        category: 'finance'
    },
    {
        id: 6,
        date: '2024-02-15',
        time: '10:10:44',
        level: 'info',
        action: 'Inspection Reviewed',
        user: 'Admin User',
        details: 'Approved inspection video for order ORD-1235',
        category: 'inspection'
    },
    {
        id: 7,
        date: '2024-02-15',
        time: '10:05:29',
        level: 'success',
        action: 'User Account Created',
        user: 'System',
        details: 'New user registration: david.chen@example.com',
        category: 'user management'
    },
    {
        id: 8,
        date: '2024-02-15',
        time: '10:00:15',
        level: 'warning',
        action: 'User Suspended',
        user: 'Admin User',
        details: 'Suspended account for Robert Brown (ID: 5678)',
        category: 'user management'
    },
    {
        id: 9,
        date: '2024-02-15',
        time: '09:55:08',
        level: 'info',
        action: 'Report Generated',
        user: 'Admin User',
        details: 'Generated revenue report for period 2024-01-01 to 2024-02-15',
        category: 'reports'
    },
    {
        id: 10,
        date: '2024-02-15',
        time: '09:50:42',
        level: 'error',
        action: 'Database Connection Error',
        user: 'System',
        details: 'Temporary database connection failure - auto-recovered',
        category: 'system'
    }
];

const getLevelIcon = (level) => {
    switch(level) {
        case 'info': return <FiInfo className="log-icon text-info" />;
        case 'success': return <FiCheckCircle className="log-icon text-success" />;
        case 'warning': return <FiAlertCircle className="log-icon text-warning" />;
        case 'error': return <FiXCircle className="log-icon text-error" />;
        default: return <FiInfo className="log-icon" />;
    }
};

const SystemLogs = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('All Levels');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    return (
        <DashboardLayout onNavigate={onNavigate} activePage="logs">
            <div className="dashboard-header">
                <h1>System Logs</h1>
                <p>Monitor and review system activity logs</p>
            </div>

            <div className="logs-container">
                {/* Control Panel */}
                <div className="logs-control-panel glass-panel">
                    <div className="control-row">
                        <div className="search-wrapper flex-grow">
                            <FiSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search logs..." 
                                className="dark-input search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="filters-wrapper">
                            <select 
                                className="dark-input dark-select auto-width"
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                            >
                                <option value="All Levels">All Levels</option>
                                <option value="Info">Info</option>
                                <option value="Success">Success</option>
                                <option value="Warning">Warning</option>
                                <option value="Error">Error</option>
                            </select>

                            <select 
                                className="dark-input dark-select auto-width"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="All Categories">All Categories</option>
                                <option value="Authentication">Authentication</option>
                                <option value="Finance">Finance</option>
                                <option value="Verification">Verification</option>
                                <option value="Inspection">Inspection</option>
                                <option value="System">System</option>
                            </select>

                            <button className="export-btn dark-outline-btn">
                                <FiDownload /> Export
                            </button>
                        </div>
                    </div>

                    <div className="legend-row">
                        <div className="legend-item">
                            <span className="dot dot-success"></span>
                            Success (3)
                        </div>
                        <div className="legend-item">
                            <span className="dot dot-warning"></span>
                            Warning (2)
                        </div>
                        <div className="legend-item">
                            <span className="dot dot-error"></span>
                            Error (2)
                        </div>
                    </div>
                </div>

                {/* Logs Table Area */}
                <div className="logs-table-card glass-panel">
                    <div className="card-header">
                        <h2 className="card-title">Activity Logs ({mockLogs.length} entries)</h2>
                    </div>

                    <div className="table-wrapper">
                        <table className="dark-table logs-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Level</th>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Details</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockLogs.map((log) => (
                                    <tr key={log.id} className="log-row">
                                        <td className="col-timestamp">
                                            <div className="time-block">
                                                <span className="date-str">{log.date}</span>
                                                <span className="time-str">{log.time}</span>
                                            </div>
                                        </td>
                                        <td className="col-level">
                                            <div className={`level-badge level-${log.level}`}>
                                                {getLevelIcon(log.level)}
                                                <span>{log.level}</span>
                                            </div>
                                        </td>
                                        <td className="col-action font-semibold text-white">
                                            {log.action}
                                        </td>
                                        <td className="col-user text-light">
                                            {log.user}
                                        </td>
                                        <td className="col-details text-light">
                                            {log.details}
                                        </td>
                                        <td className="col-category">
                                            <span className="category-pill">
                                                {log.category}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SystemLogs;
