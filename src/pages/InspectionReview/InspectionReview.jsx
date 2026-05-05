import React, { useState } from 'react';
import './InspectionReview.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiEye, FiPlayCircle, FiCheck, FiX, FiAlertCircle, FiClock, FiVideo } from 'react-icons/fi';

const InspectionReview = ({ onNavigate, onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState(null);

    const openModal = (inspection) => {
        setSelectedInspection(inspection);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInspection(null);
    };

    const pendingInspections = [
        {
            id: 1,
            title: 'Vehicle Inspection - Toyota Camry 2023',
            orderId: 'ORD-1234',
            client: 'John Smith',
            importator: 'Sarah Johnson',
            escrowAmount: '$5 000',
            date: '2024-02-14 15:30',
            status: 'Pending'
        },
        {
            id: 2,
            title: 'Machinery Inspection - Industrial Press',
            orderId: 'ORD-1235',
            client: 'Mike Wilson',
            importator: 'Emily Davis',
            escrowAmount: '$8 500',
            date: '2024-02-14 10:20',
            status: 'Pending'
        },
        {
            id: 3,
            title: 'Electronics Inspection - Server Equipment',
            orderId: 'ORD-1236',
            client: 'Robert Brown',
            importator: 'Lisa Anderson',
            escrowAmount: '$12 000',
            date: '2024-02-13 16:45',
            status: 'Pending'
        },
        {
            id: 4,
            title: 'Furniture Inspection - Office Set',
            orderId: 'ORD-1237',
            client: 'Alice Martinez',
            importator: 'James Wilson',
            escrowAmount: '$3 500',
            date: '2024-02-13 14:00',
            status: 'Pending'
        },
        {
            id: 5,
            title: 'Textile Inspection - Fabric Rolls',
            orderId: 'ORD-1238',
            client: 'David Chen',
            importator: 'Sarah Johnson',
            escrowAmount: '$7 200',
            date: '2024-02-12 11:30',
            status: 'Pending'
        },
        {
            id: 6,
            title: 'Automotive Parts Inspection',
            orderId: 'ORD-1239',
            client: 'Maria Garcia',
            importator: 'James Wilson',
            escrowAmount: '$4 800',
            date: '2024-02-12 09:15',
            status: 'Pending'
        }
    ];

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="inspection">
            <div className="dashboard-header">
                <h1>Inspection Review</h1>
                <p>Review and approve inspection videos ({pendingInspections.length} pending)</p>
            </div>

            <div className="inspection-grid">
                {pendingInspections.map((inspection) => (
                    <div key={inspection.id} className="inspection-card glass-panel">
                        
                        <div className="video-preview-area">
                            <span className="status-pill status-pending">{inspection.status}</span>
                            <div className="play-button-overlay">
                                <FiPlayCircle />
                            </div>
                        </div>

                        <div className="inspection-card-body">
                            <h3 className="inspection-title truncate" title={inspection.title}>
                                {inspection.title}
                            </h3>

                            <div className="inspection-details-grid">
                                <div className="detail-row">
                                    <span className="detail-label">Order ID:</span>
                                    <a href="#" className="detail-value text-blue order-link">{inspection.orderId}</a>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Client:</span>
                                    <span className="detail-value text-white">{inspection.client}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Importator:</span>
                                    <span className="detail-value text-white">{inspection.importator}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Escrow Amount:</span>
                                    <span className="detail-value text-green font-bold text-lg">{inspection.escrowAmount}</span>
                                </div>
                            </div>

                            <span className="inspection-date font-mono text-secondary">
                                {inspection.date}
                            </span>
                        </div>

                        <button 
                            className="review-btn full-width"
                            onClick={() => openModal(inspection)}
                        >
                            <FiEye /> Review Inspection
                        </button>

                    </div>
                ))}
            </div>

            {/* Inspection Detail Modal */}
            {isModalOpen && selectedInspection && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="inspection-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Inspection Review - {selectedInspection.orderId}</h2>
                            <button className="close-modal-btn" onClick={closeModal}><FiX size={20} /></button>
                        </div>
                        
                        <div className="modal-body inspection-columns">
                            {/* Left Column: Video & Action */}
                            <div className="inspection-left-col">
                                <div className="video-player-container">
                                    <div className="video-player-mock">
                                        <div className="play-button-overlay">
                                            <FiPlayCircle />
                                        </div>
                                        <div className="video-scrubber-bar">
                                            <span className="timestamp">2:15</span>
                                            <div className="scrubber-track">
                                                <div className="scrubber-fill" style={{ width: '30%' }}></div>
                                                <div className="scrubber-head"></div>
                                            </div>
                                            <span className="timestamp">6:30</span>
                                        </div>
                                    </div>
                                    <div className="video-meta">
                                        <h3 className="video-title">{selectedInspection.title}</h3>
                                        <span className="upload-date"><FiClock /> Uploaded: {selectedInspection.date}</span>
                                    </div>
                                </div>

                                <div className="admin-action-section">
                                    <div className="admin-comment-section">
                                        <label>Admin Note *</label>
                                        <textarea 
                                            className="dark-textarea" 
                                            placeholder="Enter your review notes (required for all actions)..."
                                            rows="4"
                                        ></textarea>
                                        <p className="note-hint">Note: Approving this inspection will trigger the escrow release flow</p>
                                    </div>

                                    <div className="action-buttons-stack">
                                        <button className="modal-btn approve-solid-btn full-width justify-center">
                                            <FiCheck /> Approve (Release Escrow)
                                        </button>
                                        <button className="modal-btn reject-outline-btn full-width justify-center">
                                            <FiX /> Reject
                                        </button>
                                        <button className="modal-btn flag-outline-btn full-width justify-center">
                                            <FiAlertCircle /> Flag for Investigation
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Summary & Guidelines */}
                            <div className="inspection-right-col">
                                <div className="summary-card">
                                    <h3 className="sidebar-title">Order Summary</h3>
                                    <div className="summary-list">
                                        <div className="summary-item">
                                            <span className="s-label">Order ID</span>
                                            <span className="s-value text-blue">{selectedInspection.orderId}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="s-label">Client</span>
                                            <span className="s-value">{selectedInspection.client}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="s-label">Importator</span>
                                            <span className="s-value">{selectedInspection.importator}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="s-label">Escrow Amount</span>
                                            <span className="s-value text-green font-bold text-lg">{selectedInspection.escrowAmount}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="s-label">Video Uploaded</span>
                                            <span className="s-value font-mono text-sm">{selectedInspection.date}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="s-label">Status</span>
                                            <span className="status-pill status-pending w-fit">Pending Review</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="important-notice-card">
                                    <div className="important-header">
                                        <FiAlertCircle className="yellow-icon" />
                                        <h3>Important</h3>
                                    </div>
                                    <ul className="guidelines-list">
                                        <li>Verify item condition matches description</li>
                                        <li>Check for any damage or defects</li>
                                        <li>Ensure video is clear and comprehensive</li>
                                        <li>Approval will release funds to importator</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default InspectionReview;
