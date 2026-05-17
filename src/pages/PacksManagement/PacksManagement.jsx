import React, { useState, useEffect } from 'react';
import './PacksManagement.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiPlus, FiEdit2, FiTrash2, FiMinus } from 'react-icons/fi';
import { TbListDetails } from 'react-icons/tb';
import { walletApi } from '../../api/api';
import toast, { Toaster } from 'react-hot-toast';

const PacksManagement = ({ onNavigate, onLogout }) => {
    const [packs, setPacks] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [loading, setLoading] = useState(true);

    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPack, setEditingPack] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        points: '',
        priceDzd: '',
        highlightedOffers: '',
        activeOrdersLimit: '',
        clientCommandLimit: '',
        unlimitedClientCommands: false,
        basicStats: true,
        isActive: true,
        otherBenefits: []
    });

    const benefitOptions = [
        "Priority and visibility",
        "Professional usage",
        "Access to order management system",
        "Monthly reports",
        "Weekly reports",
        "Basic Stats"
    ];

    const fetchPacks = async () => {
        setLoading(true);
        try {
            const response = await walletApi.get('/wallet/admin/pack');
            setPacks(response.data);
        } catch (error) {
            console.error('Error fetching packs:', error);
            toast.error('Failed to load packs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacks();
    }, []);

    const handleOpenModal = (pack = null) => {
        if (pack) {
            setEditingPack(pack);
            setFormData({
                name: pack.name,
                points: pack.points,
                priceDzd: pack.priceDzd,
                highlightedOffers: pack.highlightedOffers || '',
                activeOrdersLimit: pack.activeOrdersLimit || '',
                clientCommandLimit: pack.clientCommandLimit || '',
                unlimitedClientCommands: pack.unlimitedClientCommands || false,
                basicStats: pack.basicStats !== undefined ? pack.basicStats : true,
                isActive: pack.isActive !== undefined ? pack.isActive : true,
                otherBenefits: pack.otherBenefits || []
            });
        } else {
            setEditingPack(null);
            setFormData({
                name: '',
                points: '',
                priceDzd: '',
                highlightedOffers: '',
                activeOrdersLimit: '',
                clientCommandLimit: '',
                unlimitedClientCommands: false,
                basicStats: true,
                isActive: true,
                otherBenefits: []
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPack(null);
        setFormData({ name: '', points: '', priceDzd: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            points: parseInt(formData.points),
            priceDzd: parseFloat(formData.priceDzd),
            highlightedOffers: parseInt(formData.highlightedOffers) || 0,
            activeOrdersLimit: parseInt(formData.activeOrdersLimit) || 0,
            clientCommandLimit: parseInt(formData.clientCommandLimit) || 0,
            unlimitedClientCommands: formData.unlimitedClientCommands,
            basicStats: formData.basicStats || formData.otherBenefits.includes("Basic Stats"),
            isActive: formData.isActive,
            otherBenefits: formData.otherBenefits
        };

        if (formData.unlimitedClientCommands) {
            payload.clientCommandLimit = 9999;
        }

        try {
            if (editingPack) {
                await walletApi.patch(`/wallet/admin/pack/${editingPack.id}`, payload);
                toast.success('Pack updated successfully');
            } else {
                await walletApi.post('/wallet/admin/pack', payload);
                toast.success('Pack created successfully');
            }
            fetchPacks();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving pack:', error);
            toast.error('Failed to save pack');
        }
    };

    const handleToggleActive = async (pack) => {
        try {
            await walletApi.patch(`/wallet/admin/pack/${pack.id}`, { isActive: !pack.isActive });
            toast.success(`Pack marked as ${!pack.isActive ? 'Active' : 'Inactive'}`);
            fetchPacks();
        } catch (error) {
            console.error('Error toggling pack status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pack?')) {
            try {
                await walletApi.delete(`/wallet/admin/pack/${id}`);
                toast.success('Pack deleted successfully');
                fetchPacks();
            } catch (error) {
                console.error('Error deleting pack:', error);
                toast.error('Failed to delete pack');
            }
        }
    };

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="packs">
            <Toaster position="top-right" />
            <div className="packs-management-container">
                <div className="dashboard-header">
                    <h1>Point Packs Management</h1>
                    <p>Create, update, and manage point packs available for users to purchase.</p>
                </div>

                <div className="packs-controls-card glass-panel">
                    <button className="btn-primary" onClick={() => handleOpenModal()}>
                        <FiPlus /> Create New Pack
                    </button>
                </div>

                <div className="packs-table-card glass-panel">
                    {loading ? (
                        <p>Loading packs...</p>
                    ) : (
                        <div className="table-responsive">
                                <table className="neat-table full-data">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '25%' }}>Pack Name</th>
                                            <th style={{ width: '15%' }} className="center-cell">Points</th>
                                            <th style={{ width: '15%' }} className="center-cell">Price (DZD)</th>
                                            <th style={{ width: '15%' }} className="center-cell">Status</th>
                                            <th style={{ width: '30%' }} className="center-cell">See More Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {packs.map(pack => (
                                            <React.Fragment key={pack.id}>
                                                <tr className={expandedRows[pack.id] ? 'expanded-row-parent' : ''}>
                                                    <td className="pack-name-cell">
                                                        <span className="pack-name-text">{pack.name}</span>
                                                    </td>
                                                    <td className="center-cell font-bold">{pack.points.toLocaleString()}</td>
                                                    <td className="center-cell price-text">{pack.priceDzd.toLocaleString()}</td>
                                                    <td className="center-cell">
                                                        <span className={`status-pill ${pack.isActive ? 'active' : 'inactive'}`}>
                                                            {pack.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="center-cell">
                                                        <button 
                                                            className={`btn-icon-detail ${expandedRows[pack.id] ? 'active' : ''}`}
                                                            onClick={() => toggleRow(pack.id)}
                                                        >
                                                            {expandedRows[pack.id] ? <FiMinus /> : <TbListDetails />} 
                                                            <span>{expandedRows[pack.id] ? 'Hide Details' : 'See More Details'}</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedRows[pack.id] && (
                                                    <tr className="expanded-row-child">
                                                        <td colSpan="5">
                                                            <div className="pack-details-panel">
                                                                <div className="details-grid-lite">
                                                                    <div className="detail-box full-width">
                                                                        <span className="label">Pack Benefits & Features</span>
                                                                        <ul className="benefits-list-points">
                                                                            {pack.otherBenefits?.map((b, i) => (
                                                                                <li key={i} className="benefit-point-item">
                                                                                    <span className="bullet"></span>
                                                                                    {b}
                                                                                </li>
                                                                            ))}
                                                                            {pack.basicStats && !pack.otherBenefits?.includes("Basic Stats") && (
                                                                                <li className="benefit-point-item">
                                                                                    <span className="bullet stats-bullet"></span>
                                                                                    Basic Stats included
                                                                                </li>
                                                                            )}
                                                                            {(!pack.otherBenefits || pack.otherBenefits.length === 0) && !pack.basicStats && (
                                                                                <li className="no-data">No additional benefits listed.</li>
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                    
                                                                    <div className="detail-box">
                                                                        <span className="label">Statistics & Limits</span>
                                                                        <div className="stats-inline-grid">
                                                                            <div className="stat-item-small">
                                                                                <label>Offers:</label>
                                                                                <span>{pack.highlightedOffers}</span>
                                                                            </div>
                                                                            <div className="stat-item-small">
                                                                                <label>Orders:</label>
                                                                                <span>{pack.activeOrdersLimit}</span>
                                                                            </div>
                                                                            <div className="stat-item-small">
                                                                                <label>Commands:</label>
                                                                                <span>{pack.unlimitedClientCommands ? 'Unlimited' : pack.clientCommandLimit}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="detail-box">
                                                                        <span className="label">Management</span>
                                                                        <div className="action-buttons-group-row">
                                                                            <div className="status-toggle-compact">
                                                                                <label className="modern-toggle">
                                                                                    <input 
                                                                                        type="checkbox" 
                                                                                        checked={pack.isActive}
                                                                                        onChange={() => handleToggleActive(pack)}
                                                                                    />
                                                                                    <span className="toggle-slider"></span>
                                                                                </label>
                                                                                <span>{pack.isActive ? 'Active' : 'Inactive'}</span>
                                                                            </div>
                                                                            <button className="btn-action edit" onClick={() => handleOpenModal(pack)}>
                                                                                <FiEdit2 /> <span>Edit</span>
                                                                            </button>
                                                                            <button className="btn-action delete" onClick={() => handleDelete(pack.id)}>
                                                                                <FiTrash2 /> <span>Delete</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    {packs.length === 0 && (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No packs found. Create one to get started.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{editingPack ? 'Edit Pack' : 'Create New Pack'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Pack Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Starter Pack"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Points Amount</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.points}
                                            onChange={e => setFormData({ ...formData, points: e.target.value })}
                                            placeholder="e.g. 500"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (DZD)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            step="0.01"
                                            value={formData.priceDzd}
                                            onChange={e => setFormData({ ...formData, priceDzd: e.target.value })}
                                            placeholder="e.g. 2500"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Highlighted Offers</label>
                                        <input
                                            type="number"
                                            value={formData.highlightedOffers}
                                            onChange={e => setFormData({ ...formData, highlightedOffers: e.target.value })}
                                            placeholder="e.g. 5"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Active Orders Limit</label>
                                        <input
                                            type="number"
                                            value={formData.activeOrdersLimit}
                                            onChange={e => setFormData({ ...formData, activeOrdersLimit: e.target.value })}
                                            placeholder="e.g. 10"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Client Command Limit</label>
                                        <input
                                            type="number"
                                            value={formData.unlimitedClientCommands ? 9999 : formData.clientCommandLimit}
                                            onChange={e => setFormData({ ...formData, clientCommandLimit: e.target.value })}
                                            placeholder="e.g. 20"
                                            disabled={formData.unlimitedClientCommands}
                                            className={formData.unlimitedClientCommands ? 'input-disabled' : ''}
                                        />
                                    </div>
                                </div>

                                <div className="form-checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.unlimitedClientCommands}
                                            onChange={e => setFormData({ ...formData, unlimitedClientCommands: e.target.checked })}
                                        />
                                        Unlimited Client Commands
                                    </label>
                                </div>

                                <div className="form-group full-width benefits-checkboxes">
                                    <label>Other Benefits</label>
                                    <div className="benefits-grid">
                                        {benefitOptions.map((benefit, index) => (
                                            <label key={index} className="checkbox-label benefit-item">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.otherBenefits.includes(benefit)}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            otherBenefits: isChecked 
                                                                ? [...prev.otherBenefits, benefit]
                                                                : prev.otherBenefits.filter(b => b !== benefit)
                                                        }));
                                                    }}
                                                />
                                                {benefit}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                    <button type="submit" className="btn-primary">
                                        {editingPack ? 'Update Pack' : 'Create Pack'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PacksManagement;
