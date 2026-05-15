import React, { useState, useEffect } from 'react';
import './PacksManagement.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { walletApi } from '../../api/api';
import toast, { Toaster } from 'react-hot-toast';

const PacksManagement = ({ onNavigate, onLogout }) => {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
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
        otherBenefits: ''
    });

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
                otherBenefits: pack.otherBenefits ? pack.otherBenefits.join('\n') : ''
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
                otherBenefits: ''
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
            basicStats: formData.basicStats,
            isActive: formData.isActive,
            otherBenefits: formData.otherBenefits.split('\n').filter(b => b.trim() !== '')
        };

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
                                        <th>Name</th>
                                        <th>Points</th>
                                        <th>Price</th>
                                        <th>Highl.</th>
                                        <th>Orders</th>
                                        <th>Cmds</th>
                                        <th>Unlim.</th>
                                        <th>Stats</th>
                                        <th>Benefits</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packs.map(pack => (
                                        <tr key={pack.id}>
                                            <td className="font-bold">{pack.name}</td>
                                            <td>{pack.points.toLocaleString()} pts</td>
                                            <td>{pack.priceDzd.toLocaleString()} DZD</td>
                                            <td>{pack.highlightedOffers}</td>
                                            <td>{pack.activeOrdersLimit}</td>
                                            <td>{pack.unlimitedClientCommands ? '∞' : pack.clientCommandLimit}</td>
                                            <td>{pack.unlimitedClientCommands ? '✅' : '❌'}</td>
                                            <td>{pack.basicStats ? '✅' : '❌'}</td>
                                            <td>
                                                <span className="benefits-badge" title={pack.otherBenefits?.join('\n')}>
                                                    {pack.otherBenefits?.length || 0} items
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${pack.isActive ? 'active' : 'inactive'}`}>
                                                    {pack.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-cell">
                                                    <button className="action-icon edit-action" onClick={() => handleOpenModal(pack)} title="Edit">
                                                        <FiEdit2 />
                                                    </button>
                                                    <button className="action-icon delete-action" onClick={() => handleDelete(pack.id)} title="Delete">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {packs.length === 0 && (
                                        <tr>
                                            <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>No packs found. Create one to get started.</td>
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
                                            value={formData.clientCommandLimit}
                                            onChange={e => setFormData({ ...formData, clientCommandLimit: e.target.value })}
                                            placeholder="e.g. 20"
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
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.basicStats}
                                            onChange={e => setFormData({ ...formData, basicStats: e.target.checked })}
                                        />
                                        Enable Basic Stats
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        Is Active
                                    </label>
                                </div>

                                <div className="form-group full-width">
                                    <label>Other Benefits (one per line)</label>
                                    <textarea
                                        rows="4"
                                        value={formData.otherBenefits}
                                        onChange={e => setFormData({ ...formData, otherBenefits: e.target.value })}
                                        placeholder="Receive new client requests&#10;Priority offer visibility"
                                    ></textarea>
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
