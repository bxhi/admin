import React, { useState } from 'react';
import './UserManagement.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiSearch, FiFilter, FiEye, FiSlash } from 'react-icons/fi';

const UserManagement = ({ onNavigate }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const users = [
        {
            id: 1,
            initials: 'JS',
            name: 'John Smith',
            joined: 'Joined 2024-01-15',
            role: 'Client',
            roleClass: 'client-role',
            email: 'john.smith@example.com',
            phone: '+1 (555) 123-4567',
            verification: 'Verified',
            verificationClass: 'verified',
            status: 'Active',
            statusClass: 'active',
            avatarColors: { bg: '#3b82f6', color: '#fff' }
        },
        {
            id: 2,
            initials: 'SJ',
            name: 'Sarah Johnson',
            joined: 'Joined 2024-02-20',
            role: 'Importator',
            roleClass: 'importator-role',
            email: 'sarah.j@example.com',
            phone: '+1 (555) 234-5678',
            verification: 'Verified',
            verificationClass: 'verified',
            status: 'Active',
            statusClass: 'active',
            avatarColors: { bg: '#1e40af', color: '#fff' }
        },
        {
            id: 3,
            initials: 'MW',
            name: 'Mike Wilson',
            joined: 'Joined 2024-03-10',
            role: 'Client',
            roleClass: 'client-role',
            email: 'mike.w@example.com',
            phone: '+1 (555) 345-6789',
            verification: 'Pending',
            verificationClass: 'pending',
            status: 'Pending',
            statusClass: 'pending',
            avatarColors: { bg: '#3b82f6', color: '#fff' }
        },
        {
            id: 4,
            initials: 'ED',
            name: 'Emily Davis',
            joined: 'Joined 2024-01-25',
            role: 'Importator',
            roleClass: 'importator-role',
            email: 'emily.d@example.com',
            phone: '+1 (555) 456-7890',
            verification: 'Verified',
            verificationClass: 'verified',
            status: 'Active',
            statusClass: 'active',
            avatarColors: { bg: '#1d4ed8', color: '#fff' }
        },
        {
            id: 5,
            initials: 'RB',
            name: 'Robert Brown',
            joined: 'Joined 2024-04-05',
            role: 'Client',
            roleClass: 'client-role',
            email: 'robert.b@example.com',
            phone: '+1 (555) 567-8901',
            verification: 'Pending',
            verificationClass: 'pending',
            status: 'Suspended',
            statusClass: 'suspended',
            avatarColors: { bg: '#3b82f6', color: '#fff' }
        }
    ];

    return (
        <DashboardLayout onNavigate={onNavigate} activePage="users">
            <div className="dashboard-header">
                <h1>User Management</h1>
                <p>Manage and oversee all platform users</p>
            </div>

            <div className="users-controls-card glass-panel">
                <div className="search-bar-wrapper">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search by name or email..." className="users-search-input" />
                </div>
                
                <div className="filter-group">
                    <button 
                        className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'Client' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Client')}
                    >
                        Client
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'Importator' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('Importator')}
                    >
                        Importator
                    </button>
                    
                    <div className="filter-divider"></div>

                    <button className="more-filters-btn">
                        <FiFilter /> More Filters
                    </button>
                </div>
            </div>

            <div className="users-table-card glass-panel">
                <div className="table-container">
                    <table className="users-table neat-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Verification</th>
                                <th>Status</th>
                                <th align="center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-identity">
                                            <div className="user-avatar" style={{ backgroundColor: user.avatarColors.bg, color: user.avatarColors.color }}>
                                                {user.initials}
                                            </div>
                                            <div className="user-details">
                                                <span className="user-name">{user.name}</span>
                                                <span className="user-joined">{user.joined}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-pill ${user.roleClass}`}>{user.role}</span>
                                    </td>
                                    <td className="text-secondary">{user.email}</td>
                                    <td className="text-secondary">{user.phone}</td>
                                    <td>
                                        <span className={`status-pill ${user.verificationClass}`}>{user.verification}</span>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${user.statusClass}`}>{user.status}</span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="action-icon view-action" title="View Details">
                                                <FiEye />
                                            </button>
                                            <button className="action-icon block-action" title="Block/Suspend">
                                                <FiSlash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserManagement;
