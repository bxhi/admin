import React, { useState } from 'react';
import './EscrowPayments.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiDollarSign, FiRefreshCw, FiAlertCircle, FiEye, FiX, FiClock } from 'react-icons/fi';

const EscrowPayments = ({ onNavigate, onLogout }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedEscrow, setSelectedEscrow] = useState(null);

    const openDetailsModal = (tx) => {
        setSelectedEscrow(tx);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedEscrow(null);
    };

    const escrowTransactions = [
        {
            escrowId: 'ESC-2024-001',
            orderId: 'ORD-1234',
            client: 'John Smith',
            importator: 'Sarah Johnson',
            totalHeld: '$5 000',
            released: '$0',
            remaining: '$5 000',
            status: 'Held',
            statusClass: 'held',
            date: '2024-02-10',
            timeline: [
                { icon: <FiClock />, title: 'Escrow Created', time: '2024-02-10 10:00', amount: '$5 000' },
                { icon: <FiDollarSign />, title: 'Payment Received', time: '2024-02-11 14:30', amount: '$5 000' }
            ],
            auditLogs: [
                { title: 'Escrow Created', time: '2024-02-10 10:05', user: 'Admin User', desc: 'Escrow account opened for order' },
                { title: 'Payment Confirmed', time: '2024-02-11 14:35', user: 'System', desc: 'Payment received and verified' }
            ]
        },
        {
            escrowId: 'ESC-2024-002',
            orderId: 'ORD-1235',
            client: 'Mike Wilson',
            importator: 'Emily Davis',
            totalHeld: '$8 500',
            released: '$8 500',
            remaining: '$0',
            status: 'Released',
            statusClass: 'released',
            date: '2024-02-08',
            timeline: [],
            auditLogs: []
        },
        {
            escrowId: 'ESC-2024-003',
            orderId: 'ORD-1236',
            client: 'Robert Brown',
            importator: 'Lisa Anderson',
            totalHeld: '$12 000',
            released: '$6 000',
            remaining: '$6 000',
            status: 'Partial',
            statusClass: 'partial',
            date: '2024-02-12',
            timeline: [],
            auditLogs: []
        },
        {
            escrowId: 'ESC-2024-004',
            orderId: 'ORD-1237',
            client: 'Alice Martinez',
            importator: 'James Wilson',
            totalHeld: '$3 500',
            released: '$0',
            remaining: '$3 500',
            status: 'Held',
            statusClass: 'held',
            date: '2024-02-14',
            timeline: [],
            auditLogs: []
        }
    ];

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="escrow">
            <div className="dashboard-header">
                <h1>Escrow & Payments</h1>
                <p>Manage escrow transactions and fund releases</p>
            </div>

            {/* Escrow Stat Cards */}
            <div className="escrow-stats-grid">
                <div className="escrow-stat-card glass-panel">
                    <div className="stat-icon-wrapper yellow-tint">
                        <FiDollarSign />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Held</span>
                        <h3 className="stat-value">$14 500</h3>
                    </div>
                </div>

                <div className="escrow-stat-card glass-panel">
                    <div className="stat-icon-wrapper green-tint">
                        <FiDollarSign />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Released</span>
                        <h3 className="stat-value">$8 500</h3>
                    </div>
                </div>

                <div className="escrow-stat-card glass-panel">
                    <div className="stat-icon-wrapper red-tint">
                        <FiRefreshCw />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Refunded</span>
                        <h3 className="stat-value">$7 200</h3>
                    </div>
                </div>
            </div>

            {/* Ledger Table Section */}
            <div className="escrow-ledger-card glass-panel">
                <div className="ledger-header">
                    <h2>Escrow Ledger</h2>
                    <div className="ledger-alert yellow-alert">
                        <FiAlertCircle />
                        <span>2 pending releases</span>
                    </div>
                </div>
                
                <div className="table-container">
                    <table className="users-table neat-table escrow-table">
                        <thead>
                            <tr>
                                <th>Escrow ID</th>
                                <th>Order ID</th>
                                <th>Client</th>
                                <th>Importator</th>
                                <th>Total Held</th>
                                <th>Released</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th align="center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {escrowTransactions.map((tx, idx) => (
                                <tr key={idx}>
                                    <td className="font-mono text-secondary">{tx.escrowId}</td>
                                    <td>
                                        <a href="#" className="order-link">{tx.orderId}</a>
                                    </td>
                                    <td>{tx.client}</td>
                                    <td>{tx.importator}</td>
                                    <td className="font-bold">{tx.totalHeld}</td>
                                    <td className="font-bold text-secondary">{tx.released}</td>
                                    <td>
                                        <span className={`ledger-status-pill ${tx.statusClass}`}>{tx.status}</span>
                                    </td>
                                    <td className="font-mono text-secondary">{tx.date}</td>
                                    <td>
                                        <button 
                                            className="details-btn"
                                            onClick={() => openDetailsModal(tx)}
                                        >
                                            <FiEye /> Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Escrow Details Modal */}
            {isDetailsModalOpen && selectedEscrow && (
                <div className="modal-overlay" onClick={closeDetailsModal}>
                    <div className="escrow-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Escrow Details - {selectedEscrow.escrowId}</h2>
                            <button className="close-modal-btn" onClick={closeDetailsModal}><FiX size={20} /></button>
                        </div>
                        
                        <div className="modal-body escrow-columns">
                            {/* Left Column */}
                            <div className="escrow-left-col">
                                <div className="modal-section summary-card">
                                    <h3 className="section-title">Escrow Summary</h3>
                                    <div className="summary-grid">
                                        <div className="info-item">
                                            <span className="info-label">Order ID</span>
                                            <span className="info-value text-blue">{selectedEscrow.orderId}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Status</span>
                                            <span className={`ledger-status-pill ${selectedEscrow.statusClass} w-fit`}>{selectedEscrow.status}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Client</span>
                                            <span className="info-value">{selectedEscrow.client}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Importator</span>
                                            <span className="info-value">{selectedEscrow.importator}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Total Held</span>
                                            <span className="info-value text-xl">{selectedEscrow.totalHeld}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Released Amount</span>
                                            <span className="info-value text-xl">{selectedEscrow.released}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Remaining Balance</span>
                                            <span className="info-value text-xl text-green">{selectedEscrow.remaining}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Created At</span>
                                            <span className="info-value font-mono">{selectedEscrow.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h3 className="section-title">Transaction Timeline</h3>
                                    <div className="timeline-container">
                                        {selectedEscrow.timeline.length > 0 ? (
                                            selectedEscrow.timeline.map((item, idx) => (
                                                <div key={idx} className="timeline-item">
                                                    <div className="timeline-icon">
                                                        {item.icon}
                                                    </div>
                                                    <div className="timeline-content">
                                                        <div className="tl-header">
                                                            <span className="tl-title">{item.title}</span>
                                                            <span className="tl-amount">{item.amount}</span>
                                                        </div>
                                                        <span className="tl-time text-secondary">{item.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-secondary text-sm">No timeline available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="escrow-right-col">
                                <div className="modal-section audit-card">
                                    <h3 className="section-title">Audit Log</h3>
                                    <div className="audit-log-container">
                                        {selectedEscrow.auditLogs.length > 0 ? (
                                            selectedEscrow.auditLogs.map((log, idx) => (
                                                <div key={idx} className="audit-item">
                                                    <h4 className="audit-title">{log.title}</h4>
                                                    <div className="audit-meta text-secondary">
                                                        <span>{log.time}</span>
                                                        <span>By: {log.user}</span>
                                                    </div>
                                                    <p className="audit-desc">{log.desc}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-secondary text-sm">No audit logs.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bottom-left-actions">
                            <button className="modal-btn approve-solid-btn">
                                <FiDollarSign /> Release Funds
                            </button>
                            <button className="modal-btn reject-outline-btn">
                                <FiRefreshCw /> Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default EscrowPayments;
