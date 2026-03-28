import React, { useState } from 'react';
import './Verification.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiEye, FiCheck, FiX, FiImage, FiZoomIn, FiMessageSquare } from 'react-icons/fi';

const Verification = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('clients');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const openViewModal = (record) => {
        setSelectedRecord(record);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedRecord(null);
    };

    const pendingVerifications = [
        {
            id: 1,
            name: 'Alice Martinez',
            email: 'alice.m@example.com',
            documents: ['ID Front', 'ID Back', 'Selfie'],
            submittedAt: '2024-02-14 10:30',
            type: 'client'
        },
        {
            id: 2,
            name: 'David Chen',
            email: 'david.c@example.com',
            documents: ['ID Front', 'ID Back', 'Selfie'],
            submittedAt: '2024-02-14 14:15',
            type: 'client'
        },
        {
            id: 3,
            name: 'Maria Garcia',
            email: 'maria.g@example.com',
            documents: ['ID Front', 'ID Back', 'Selfie'],
            submittedAt: '2024-02-15 09:45',
            type: 'client'
        },
        {
            id: 4,
            name: 'Global Traders LLC',
            email: 'compliance@globaltraders.com',
            documents: ['Business License', 'Tax ID', 'Director ID'],
            submittedAt: '2024-02-12 11:00',
            type: 'importator'
        },
        {
            id: 5,
            name: 'Supply Chain Co.',
            email: 'verify@supplychain.net',
            documents: ['Company Reg', 'Bank Statement', 'Owner ID'],
            submittedAt: '2024-02-13 16:20',
            type: 'importator'
        }
    ];

    const displayedRecords = pendingVerifications.filter(v => 
        activeTab === 'clients' ? v.type === 'client' : v.type === 'importator'
    );

    return (
        <DashboardLayout onNavigate={onNavigate} activePage="verification">
            <div className="dashboard-header">
                <h1>Verification Management</h1>
                <p>Review and approve user verification submissions</p>
            </div>

            <div className="verification-tabs glass-panel">
                <button 
                    className={`nav-tab ${activeTab === 'clients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('clients')}
                >
                    Pending Clients (3)
                </button>
                <div className="tab-divider"></div>
                <button 
                    className={`nav-tab ${activeTab === 'importators' ? 'active' : ''}`}
                    onClick={() => setActiveTab('importators')}
                >
                    Pending Importators (2)
                </button>
            </div>

            <div className="verification-table-card glass-panel">
                <div className="table-container">
                    <table className="users-table neat-table">
                        <thead>
                            <tr>
                                <th>User Info</th>
                                <th>Documents</th>
                                <th>Submitted At</th>
                                <th align="right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRecords.map((record) => (
                                <tr key={record.id}>
                                    <td>
                                        <div className="user-details-stacked">
                                            <span className="user-name">{record.name}</span>
                                            <span className="user-email text-secondary">{record.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="document-pills">
                                            {record.documents.map((doc, idx) => (
                                                <span key={idx} className="doc-pill">{doc}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-secondary font-mono">{record.submittedAt}</td>
                                    <td>
                                        <div className="action-buttons-group">
                                            <button 
                                                className="v-btn view-btn"
                                                onClick={() => openViewModal(record)}
                                            >
                                                <FiEye /> View
                                            </button>
                                            <button className="v-btn approve-btn">
                                                <FiCheck /> Approve
                                            </button>
                                            <button className="v-btn reject-btn">
                                                <FiX /> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal Overlay */}
            {isViewModalOpen && selectedRecord && (
                <div className="modal-overlay" onClick={closeViewModal}>
                    <div className="verification-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Uploaded Documents</h2>
                            <button className="close-modal-btn" onClick={closeViewModal}><FiX size={20} /></button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="modal-section">
                                <h3 className="section-title">User Information</h3>
                                <div className="user-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">{selectedRecord.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email Address</span>
                                        <span className="info-value">{selectedRecord.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Account Role</span>
                                        <span className="info-value capitalize">{selectedRecord.type}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Submission Date</span>
                                        <span className="info-value">{selectedRecord.submittedAt}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3 className="section-title">Uploaded Documents</h3>
                                <div className="documents-grid">
                                    {selectedRecord.documents.map((doc, idx) => (
                                        <div key={idx} className="document-card">
                                            <div className="doc-icon-area">
                                                <FiImage size={32} className="main-doc-icon" />
                                                <FiZoomIn size={16} className="zoom-icon" />
                                            </div>
                                            <span className="doc-label">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="doc-hint">Click on any document to view full resolution</p>
                            </div>

                            <div className="admin-comment-section">
                                <label>Admin Comment *</label>
                                <textarea 
                                    className="dark-textarea" 
                                    placeholder="Enter your review notes or reasons for approval/rejection..."
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="footer-left">
                                <button className="modal-btn reject-outline-btn">
                                    <FiX /> Reject
                                </button>
                            </div>
                            <div className="footer-right">
                                <button className="modal-btn request-info-btn">
                                    <FiMessageSquare /> Request More Info
                                </button>
                                <button className="modal-btn approve-solid-btn">
                                    <FiCheck /> Approve Verification
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Verification;
