import React, { useState } from 'react';
import './Settings.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiShield, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const mockRoles = [
    { id: 'super_admin', name: 'Super Admin', users: 2, isSuper: true },
    { id: 'admin', name: 'Admin', users: 5, isSuper: false },
    { id: 'support', name: 'Support Agent', users: 12, isSuper: false },
    { id: 'finance', name: 'Finance Manager', users: 3, isSuper: false }
];

const mockPermissions = [
    { id: 1, name: 'View Dashboard', category: 'general', enabled: true },
    { id: 2, name: 'Manage Users', category: 'users', enabled: true },
    { id: 3, name: 'Approve Verification', category: 'verification', enabled: true },
    { id: 4, name: 'Reject Verification', category: 'verification', enabled: true },
    { id: 5, name: 'Release Escrow', category: 'finance', enabled: true },
    { id: 6, name: 'Refund Escrow', category: 'finance', enabled: true },
    { id: 7, name: 'Approve Inspections', category: 'inspections', enabled: true },
    { id: 8, name: 'Generate Reports', category: 'reports', enabled: true },
    { id: 9, name: 'Manage Settings', category: 'settings', enabled: true },
    { id: 10, name: 'View Audit Logs', category: 'audit', enabled: true },
    { id: 11, name: 'Suspend Users', category: 'users', enabled: true },
    { id: 12, name: 'System Configuration', category: 'settings', enabled: true }
];

const Settings = ({ onNavigate, onLogout }) => {
    const [selectedRole, setSelectedRole] = useState(mockRoles[0]);
    const [platformSettings, setPlatformSettings] = useState({
        name: 'Import Platform',
        escrowPercentage: 5,
        defaultLanguage: 'en',
        paymentMethods: {
            creditCard: true,
            bankTransfer: true,
            paypal: false,
            crypto: false
        }
    });

    const handlePlatformChange = (field, value) => {
        setPlatformSettings(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentToggle = (method) => {
        setPlatformSettings(prev => ({
            ...prev,
            paymentMethods: {
                ...prev.paymentMethods,
                [method]: !prev.paymentMethods[method]
            }
        }));
    };

    const handleSaveSettings = () => {
        toast.success('Platform settings updated successfully');
        console.log('Saving platform settings:', platformSettings);
    };

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="settings">
            <div className="dashboard-header">
                <h1>Settings</h1>
                <p>Manage platform configuration and role permissions</p>
            </div>

            <div className="settings-grid">
                {/* Platform Settings Space */}
                <div className="settings-card glass-panel flex-col">
                    <h2 className="card-title">Platform Settings</h2>
                    
                    <div className="form-group config-input">
                        <label>Platform Name</label>
                        <input 
                            type="text" 
                            className="dark-input" 
                            value={platformSettings.name} 
                            onChange={(e) => handlePlatformChange('name', e.target.value)}
                        />
                    </div>

                    <div className="form-group config-input">
                        <label>Default Escrow Percentage</label>
                        <div className="input-with-icon">
                            <input 
                                type="number" 
                                className="dark-input" 
                                value={platformSettings.escrowPercentage} 
                                onChange={(e) => handlePlatformChange('escrowPercentage', e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="form-group config-input">
                        <label>Default Language</label>
                        <select 
                            className="dark-input dark-select"
                            value={platformSettings.defaultLanguage}
                            onChange={(e) => handlePlatformChange('defaultLanguage', e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="ar">Arabic</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <div className="payment-methods-box">
                        <label className="section-label">Supported Payment Methods</label>
                        <div className="payment-toggles">
                            <div className="toggle-row inline">
                                <span>Credit Card</span>
                                <label className="glass-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={platformSettings.paymentMethods.creditCard} 
                                        onChange={() => handlePaymentToggle('creditCard')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="toggle-row inline">
                                <span>Bank Transfer</span>
                                <label className="glass-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={platformSettings.paymentMethods.bankTransfer} 
                                        onChange={() => handlePaymentToggle('bankTransfer')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="toggle-row inline">
                                <span>Paypal</span>
                                <label className="glass-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={platformSettings.paymentMethods.paypal} 
                                        onChange={() => handlePaymentToggle('paypal')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="toggle-row inline">
                                <span>Crypto</span>
                                <label className="glass-toggle">
                                    <input 
                                        type="checkbox" 
                                        checked={platformSettings.paymentMethods.crypto} 
                                        onChange={() => handlePaymentToggle('crypto')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button className="run-btn save-btn mt-auto" onClick={handleSaveSettings}>
                        <FiSave /> Save Settings
                    </button>
                </div>

                {/* Role Management Space */}
                <div className="settings-card glass-panel flex-col">
                    <div className="flex-between card-header">
                        <h2 className="card-title">Role Management</h2>
                        <button className="add-role-btn">
                            <FiPlus /> Add Role
                        </button>
                    </div>

                    <div className="roles-list">
                        {mockRoles.map((role) => (
                            <div 
                                key={role.id} 
                                className={`role-item ${selectedRole.id === role.id ? 'active' : ''}`}
                                onClick={() => setSelectedRole(role)}
                            >
                                <div className={`role-icon-box ${role.isSuper ? 'blue-shield' : 'grey-shield'}`}>
                                    <FiShield />
                                </div>
                                <div className="role-info flex-grow">
                                    <h4>{role.name}</h4>
                                    <span>{role.users} users</span>
                                </div>
                                <button className="delete-role-btn">
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Permissions Table Space */}
                <div className="settings-card glass-panel full-width">
                    <div className="flex-between card-header">
                        <h2 className="card-title">Permissions for {selectedRole.name}</h2>
                    </div>

                    <div className="permissions-table-wrapper">
                        <table className="dark-table permissions-table">
                            <thead>
                                <tr>
                                    <th>Permission</th>
                                    <th>Category</th>
                                    <th className="text-center">Enabled</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockPermissions.map((perm) => (
                                    <tr key={perm.id}>
                                        <td className="text-white font-semibold">{perm.name}</td>
                                        <td>
                                            <span className="category-pill">{perm.category}</span>
                                        </td>
                                        <td className="text-center">
                                            <label className="custom-checkbox">
                                                <input type="checkbox" defaultChecked={perm.enabled} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex-end mt-20">
                        <button className="run-btn save-btn fixed-width">
                            <FiSave /> Save Permissions
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
