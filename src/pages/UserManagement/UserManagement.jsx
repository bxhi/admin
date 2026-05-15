import React, { useState, useEffect } from 'react';
import './UserManagement.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiSearch, FiFilter, FiEye, FiSlash, FiCheckCircle, FiXCircle, FiInfo, FiActivity, FiImage, FiX } from 'react-icons/fi';
import { authApi } from '../../api/api';
import toast, { Toaster } from 'react-hot-toast';

const UserManagement = ({ onNavigate, onLogout }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    
    // Modal states
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await authApi.get('/auth/get-all-users');
            const formattedUsers = response.data.map(item => ({
                ...item.user,
                verificationStatus: item.profile?.verificationStatus,
                profile: item.profile
            }));
            setUsers(formattedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewUser = async (userId) => {
        setIsDetailModalOpen(true);
        setUserDetails(null);
        try {
            const response = await authApi.get(`/auth/get-user/${userId}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            toast.error('Failed to load user details');
            setIsDetailModalOpen(false);
        }
    };



    const handleChangeAccountStatus = async (userId, status) => {
        setIsActionLoading(true);
        try {
            await authApi.post(`/auth/change-account-status/${userId}`, { accountStatus: status });
            toast.success(`Account status changed to ${status}`);
            fetchUsers();
            if (userDetails && userDetails.user.userId === userId) {
                setUserDetails({
                    ...userDetails,
                    user: { ...userDetails.user, accountStatus: status }
                });
            }
        } catch (error) {
            if (error.response?.status === 500 || error.message === 'Network Error') {
                try {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    const checkRes = await authApi.get(`/auth/get-user/${userId}`);
                    if (checkRes.data?.user?.accountStatus === status) {
                        toast.success(`Account status ${status} (Synced)`, { icon: '🔄' });
                        fetchUsers();
                        if (userDetails?.user?.userId === userId) {
                            setUserDetails({ ...userDetails, user: { ...userDetails.user, accountStatus: status } });
                        }
                        return;
                    }
                } catch (e) {}
            }
            console.error('Error changing status:', error);
            toast.error('Failed to change account status');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleVerificationAction = async (userId, status) => {
        setIsActionLoading(true);
        try {
            await authApi.post(`/auth/verify-user/${userId}`, { verificationStatus: status });
            toast.success(`User verification ${status}`);
            fetchUsers(); // Refresh the list
            if (userDetails && userDetails.user.userId === userId) {
                setUserDetails({
                    ...userDetails,
                    profile: { ...userDetails.profile, verificationStatus: status }
                });
            }
        } catch (error) {
            if (error.response?.status === 500 || error.message === 'Network Error') {
                try {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    const checkResponse = await authApi.get(`/auth/get-user/${userId}`);
                    const currentStatus = checkResponse.data?.profile?.verificationStatus || checkResponse.data?.user?.verificationStatus;
                    
                    if (currentStatus === status) {
                        toast.success(`User verification ${status} (Synced)`, { icon: '🔄' });
                        fetchUsers();
                        if (userDetails?.user?.userId === userId) {
                            setUserDetails({ ...userDetails, profile: { ...userDetails.profile, verificationStatus: status } });
                        }
                        return;
                    }
                } catch (checkError) {}
            }
            console.error('Verification error:', error);
            toast.error('Failed to update verification status');
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = !search || 
            user.fullName?.toLowerCase().includes(search) || 
            user.email?.toLowerCase().includes(search);
        
        // Exclude Admins
        if (user.role?.toUpperCase() === 'ADMIN') return false;

        const matchesFilter = activeFilter === 'All' || user.role?.toLowerCase() === activeFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const getStatusClass = (status) => {
        if (!status) return 'pending';
        switch (status.toLowerCase()) {
            case 'active': case 'approved': case 'verified': return 'verified';
            case 'suspended': case 'rejected': return 'rejected';
            case 'pending': return 'pending';
            default: return 'pending';
        }
    };

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="users">
            <Toaster position="top-right" />
            <div className="dashboard-header">
                <h1>User Management</h1>
                <p>Manage and oversee all platform users</p>
            </div>

            <div className="users-controls-card glass-panel">
                <div className="search-bar-wrapper">
                    <FiSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="users-search-input" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-group">
                    {['All', 'Client', 'Importator'].map(filter => (
                        <button 
                            key={filter}
                            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="users-table-card glass-panel">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Fetching users...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="users-table neat-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Verification</th>
                                    <th>Account Status</th>
                                    <th align="center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td>
                                            <div className="user-identity">
                                                <div className="user-avatar" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
                                                    {user.fullName?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div className="user-details">
                                                    <span className="user-name">{user.fullName || 'No Name'}</span>
                                                    <span className="user-joined">ID: {user.userId?.substring(0, 8)}...</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-pill ${user.role?.toLowerCase()}-role`}>{user.role}</span>
                                        </td>
                                        <td className="text-secondary">{user.email}</td>
                                        <td>
                                            <span className={`status-pill ${getStatusClass(user.verificationStatus)}`}>
                                                {user.verificationStatus || 'PENDING'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${getStatusClass(user.accountStatus)}`}>
                                                {user.accountStatus || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="action-icon view-action" title="View & Verify" onClick={() => handleViewUser(user.userId)}>
                                                    <FiEye />
                                                </button>
                                                <button 
                                                    className="action-icon block-action" 
                                                    title={user.accountStatus === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                                                    onClick={() => handleChangeAccountStatus(user.userId, user.accountStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')}
                                                >
                                                    <FiSlash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-row">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail & Verification Modal */}
            {isDetailModalOpen && (
                <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
                    <div className="modal-content admin-modal user-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details & Verification</h2>
                            <button className="close-btn" onClick={() => setIsDetailModalOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            {!userDetails ? (
                                <div className="modal-loading">
                                    <div className="spinner"></div>
                                    <p>Loading user details...</p>
                                </div>
                            ) : (
                                <div className="user-full-details">
                                    <div className="modal-profile-header">
                                        <div className="profile-avatar-large">
                                            {userDetails.user.fullName?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="profile-main-meta">
                                            <h3>{userDetails.user.fullName}</h3>
                                            <div className="meta-badges">
                                                <span className={`role-badge ${userDetails.user.role?.toLowerCase()}`}>{userDetails.user.role}</span>
                                                <span className={`status-badge-outline ${getStatusClass(userDetails.user.accountStatus)}`}>{userDetails.user.accountStatus}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section main-info">
                                        <div className="section-header"><FiInfo /> Profile Information</div>
                                        <div className="info-grid">
                                            <div className="info-item"><label>Email Address</label><span>{userDetails.user.email}</span></div>
                                            <div className="info-item"><label>Phone Number</label><span>{userDetails.user.phoneNumber || 'N/A'}</span></div>
                                            <div className="info-item"><label>Verification</label><span className={`status-text ${getStatusClass(userDetails.profile?.verificationStatus)}`}>{userDetails.profile?.verificationStatus || 'PENDING'}</span></div>
                                            
                                            {userDetails.user?.role?.toLowerCase() === 'importator' && (
                                                <>
                                                    <div className="info-item"><label>Register Commerce #</label><span>{userDetails.profile?.registerCommerceNumber || 'N/A'}</span></div>
                                                    <div className="info-item"><label>License ID</label><span>{userDetails.profile?.licenseId || 'N/A'}</span></div>
                                                </>
                                            )}
                                            <div className="info-item"><label>Wilaya / Region</label><span>{userDetails.profile?.wilaya || 'N/A'}</span></div>
                                            <div className="info-item"><label>Physical Address</label><span>{userDetails.profile?.address || userDetails.profile?.adress || 'N/A'}</span></div>
                                        </div>
                                    </div>

                                    <div className="detail-section docs-info">
                                        <div className="section-header"><FiImage /> Registered Documentation</div>
                                        <div className="documents-gallery">
                                            {userDetails.user?.role?.toLowerCase() === 'client' ? (
                                                <>
                                                    <div className="doc-item">
                                                        <label>ID Card Image</label>
                                                        {userDetails.profile?.idCardImage ? (
                                                            <img src={userDetails.profile.idCardImage} alt="ID Card" className="doc-preview" onClick={() => window.open(userDetails.profile.idCardImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>Selfie with ID</label>
                                                        {userDetails.profile?.selfieImage ? (
                                                            <img src={userDetails.profile.selfieImage} alt="Selfie" className="doc-preview" onClick={() => window.open(userDetails.profile.selfieImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="doc-item">
                                                        <label>ID Card Front</label>
                                                        {userDetails.profile?.idFrontCardImage ? (
                                                            <img src={userDetails.profile.idFrontCardImage} alt="ID Front" className="doc-preview" onClick={() => window.open(userDetails.profile.idFrontCardImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>ID Card Back</label>
                                                        {userDetails.profile?.idBackCardImage ? (
                                                            <img src={userDetails.profile.idBackCardImage} alt="ID Back" className="doc-preview" onClick={() => window.open(userDetails.profile.idBackCardImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>Selfie with ID</label>
                                                        {userDetails.profile?.selfieImage ? (
                                                            <img src={userDetails.profile.selfieImage} alt="Selfie" className="doc-preview" onClick={() => window.open(userDetails.profile.selfieImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>License Image</label>
                                                        {userDetails.profile?.licenseImage ? (
                                                            <img src={userDetails.profile.licenseImage} alt="License" className="doc-preview" onClick={() => window.open(userDetails.profile.licenseImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>Register Commerce</label>
                                                        {userDetails.profile?.registerCommerceImage ? (
                                                            <img src={userDetails.profile.registerCommerceImage} alt="Register" className="doc-preview" onClick={() => window.open(userDetails.profile.registerCommerceImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="detail-section actions-section">
                                        <div className="section-header"><FiActivity /> Account Management</div>
                                        <div className="admin-actions-group">
                                            
                                            {/* Account Status Actions */}
                                            <div className="action-category">
                                                <label>Account Status</label>
                                                <div className="button-row">
                                                    <button 
                                                        className={`btn-action status-btn ${userDetails.user.accountStatus === 'active' ? 'active-state' : ''}`}
                                                        onClick={() => handleChangeAccountStatus(userDetails.user.userId, 'active')}
                                                        disabled={isActionLoading || userDetails.user.accountStatus === 'active'}
                                                    >
                                                        <FiCheckCircle /> Active
                                                    </button>
                                                    <button 
                                                        className={`btn-action status-btn suspend ${userDetails.user.accountStatus === 'suspended' ? 'active-state' : ''}`}
                                                        onClick={() => handleChangeAccountStatus(userDetails.user.userId, 'suspended')}
                                                        disabled={isActionLoading || userDetails.user.accountStatus === 'suspended'}
                                                    >
                                                        <FiSlash /> Suspend
                                                    </button>
                                                    <button 
                                                        className={`btn-action status-btn block ${userDetails.user.accountStatus === 'blocked' ? 'active-state' : ''}`}
                                                        onClick={() => handleChangeAccountStatus(userDetails.user.userId, 'blocked')}
                                                        disabled={isActionLoading || userDetails.user.accountStatus === 'blocked'}
                                                    >
                                                        <FiXCircle /> Block
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Verification Status Actions */}
                                            <div className="action-category mt-4">
                                                <label>Verification Status</label>
                                                <div className="button-row">
                                                    <button 
                                                        className={`btn-action status-btn approve ${userDetails.profile?.verificationStatus === 'approved' ? 'active-state' : ''}`}
                                                        onClick={() => handleVerificationAction(userDetails.user.userId, 'approved')}
                                                        disabled={isActionLoading || userDetails.profile?.verificationStatus === 'approved'}
                                                    >
                                                        <FiCheckCircle /> Approve
                                                    </button>
                                                    <button 
                                                        className={`btn-action status-btn ${userDetails.profile?.verificationStatus === 'pending' || !userDetails.profile?.verificationStatus ? 'active-state' : ''}`}
                                                        onClick={() => handleVerificationAction(userDetails.user.userId, 'pending')}
                                                        disabled={isActionLoading || userDetails.profile?.verificationStatus === 'pending' || !userDetails.profile?.verificationStatus}
                                                        style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                                                    >
                                                        <FiActivity /> Pending
                                                    </button>
                                                    <button 
                                                        className={`btn-action status-btn reject ${userDetails.profile?.verificationStatus === 'rejected' ? 'active-state' : ''}`}
                                                        onClick={() => handleVerificationAction(userDetails.user.userId, 'rejected')}
                                                        disabled={isActionLoading || userDetails.profile?.verificationStatus === 'rejected'}
                                                    >
                                                        <FiXCircle /> Reject
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default UserManagement;
