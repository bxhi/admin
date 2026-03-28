import React from 'react';
import './CreateOfferModal.css';

const CreateOfferModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Create Offer</h2>
                <p>This is a stub modal.</p>
                <button onClick={onClose} className="btn-close">Close</button>
            </div>
        </div>
    );
}
export default CreateOfferModal;
