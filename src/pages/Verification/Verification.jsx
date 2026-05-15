import React, { useState, useEffect } from 'react';
import './Verification.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiEye, FiCheck, FiX, FiImage, FiInfo, FiActivity, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { authApi } from '../../api/api';
import toast, { Toaster } from 'react-hot-toast';

const Verification = ({ onNavigate, onLogout }) => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const response = await authApi.get('/auth/get-all-users');
            // Map to flat user objects first
            const formattedUsers = response.data.map(item => ({
                ...item.user,
                verificationStatus: item.profile?.verificationStatus,
                profile: item.profile
            }));
            // Filter only pending users, exclude admins, and ensure they HAVE a profile
            const pending = formattedUsers.filter(u => 
                u.role?.toUpperCase() !== 'ADMIN' && 
                u.profile && // Must have a profile to be verified
                (!u.verificationStatus || u.verificationStatus === 'pending')
            );
            setPendingUsers(pending);
        } catch (error) {
            console.error('Error fetching pending users:', error);
            if (error.response?.status === 401) {
                // Token refresh should handle this, but just in case
                return;
            }
            toast.error('Failed to load pending verifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const openViewModal = async (userId) => {
        setIsViewModalOpen(true);
        setUserDetails(null);
        try {
            const response = await authApi.get(`/auth/get-user/${userId}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching details:', error);
            toast.error('Failed to load user details');
            setIsViewModalOpen(false);
        }
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setUserDetails(null);
    };

    const handleVerificationAction = async (userId, status) => {
        setIsActionLoading(true);
        try {
            await authApi.post(`/auth/verify-user/${userId}`, { verificationStatus: status });
            toast.success(`User verification ${status}`);
            closeViewModal();
            fetchPendingUsers(); // Refresh the list
        } catch (error) {
            // BACKEND FALLBACK: If 500 occurs, wait a moment and check if the change was actually saved
            if (error.response?.status === 500 || error.message === 'Network Error') {
                try {
                    // Small delay to allow DB consistency
                    await new Promise(resolve => setTimeout(resolve, 800));
                    const checkResponse = await authApi.get(`/auth/get-user/${userId}`);
                    
                    // Check both profile and root user object for the status
                    const currentStatus = checkResponse.data?.profile?.verificationStatus || checkResponse.data?.user?.verificationStatus;
                    
                    if (currentStatus === status) {
                        toast.success(`User verification ${status} (Synced)`, {
                            icon: '🔄',
                            style: { background: '#10b981', color: '#fff' }
                        });
                        closeViewModal();
                        fetchPendingUsers();
                        return;
                    }
                } catch (checkError) {
                    console.error('Fallback check failed:', checkError);
                }
            }
            console.error('Verification error:', error);
            toast.error('Failed to update verification status. Please try again.');
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="verification">
            <Toaster position="top-right" />
            <div className="dashboard-header">
                <h1>Verification Queue</h1>
                <p>Review and process pending verification submissions from new users</p>
            </div>

            <div className="verification-table-card glass-panel">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Scanning for pending verifications...</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="users-table neat-table">
                            <thead>
                                <tr>
                                    <th>User Info</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th align="right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td>
                                            <div className="user-identity">
                                                <div className="user-avatar" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
                                                    {user.fullName?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div className="user-details-stacked">
                                                    <span className="user-name">{user.fullName}</span>
                                                    <span className="user-email text-secondary">ID: {user.userId?.substring(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-pill ${user.role?.toLowerCase()}-role`}>{user.role}</span>
                                        </td>
                                        <td className="text-secondary font-mono">{user.email}</td>
                                        <td>
                                            <span className="status-pill pending">Pending Review</span>
                                        </td>
                                        <td>
                                            <div className="action-buttons-group justify-end">
                                                <button 
                                                    className="v-btn view-btn"
                                                    onClick={() => openViewModal(user.userId)}
                                                >
                                                    <FiEye /> Review Documents
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pendingUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="empty-row">Great job! No pending verifications at the moment.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Modal Overlay */}
            {isViewModalOpen && (
                <div className="modal-overlay" onClick={closeViewModal}>
                    <div className="modal-content admin-modal verification-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Review Documents</h2>
                            <button className="close-modal-btn" onClick={closeViewModal}>
                                <FiX />
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            {!userDetails ? (
                                <div className="modal-loading">
                                    <div className="spinner"></div>
                                    <p>Loading documents...</p>
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
                                                <span className="status-badge-outline pending">PENDING REVIEW</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <div className="section-header"><FiInfo /> Applicant Identity</div>
                                        <div className="info-grid">
                                            <div className="info-item"><label>Email Address</label><span>{userDetails.user.email}</span></div>
                                            <div className="info-item"><label>Phone Number</label><span>{userDetails.user.phoneNumber || 'N/A'}</span></div>
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

                                    <div className="detail-section">
                                        <div className="section-header"><FiImage /> Document Gallery</div>
                                        <div className="documents-gallery">
                                            {userDetails.user?.role?.toLowerCase() === 'client' ? (
                                                <>
                                                    <div className="doc-item">
                                                        <label>ID Card</label>
                                                        {userDetails.profile?.idCardImage ? (
                                                            <img src={userDetails.profile.idCardImage} alt="ID" className="doc-preview" onClick={() => window.open(userDetails.profile.idCardImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>Selfie</label>
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
                                                        <label>ID Front</label>
                                                        {userDetails.profile?.idFrontCardImage ? (
                                                            <img src={userDetails.profile.idFrontCardImage} alt="Front" className="doc-preview" onClick={() => window.open(userDetails.profile.idFrontCardImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>ID Back</label>
                                                        {userDetails.profile?.idBackCardImage ? (
                                                            <img src={userDetails.profile.idBackCardImage} alt="Back" className="doc-preview" onClick={() => window.open(userDetails.profile.idBackCardImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>Selfie</label>
                                                        {userDetails.profile?.selfieImage ? (
                                                            <img src={userDetails.profile.selfieImage} alt="Selfie" className="doc-preview" onClick={() => window.open(userDetails.profile.selfieImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>License</label>
                                                        {userDetails.profile?.licenseImage ? (
                                                            <img src={userDetails.profile.licenseImage} alt="License" className="doc-preview" onClick={() => window.open(userDetails.profile.licenseImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                    <div className="doc-item">
                                                        <label>Commerce Reg.</label>
                                                        {userDetails.profile?.registerCommerceImage ? (
                                                            <img src={userDetails.profile.registerCommerceImage} alt="Reg" className="doc-preview" onClick={() => window.open(userDetails.profile.registerCommerceImage)} />
                                                        ) : (
                                                            <div className="doc-placeholder"><FiImage /><span>No Image</span></div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <div className="section-header"><FiActivity /> Decision</div>
                                        <div className="verification-decision-btns">
                                            <button 
                                                className="btn-action approve-card" 
                                                disabled={isActionLoading}
                                                onClick={() => handleVerificationAction(userDetails.user.userId, 'approved')}
                                            >
                                                <div className="btn-glow"></div>
                                                <FiCheckCircle /> 
                                                <span>Approve Profile</span>
                                            </button>
                                            <button 
                                                className="btn-action reject-card" 
                                                disabled={isActionLoading}
                                                onClick={() => handleVerificationAction(userDetails.user.userId, 'rejected')}
                                            >
                                                <div className="btn-glow"></div>
                                                <FiXCircle /> 
                                                <span>Reject Submission</span>
                                            </button>
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

export default Verification;
