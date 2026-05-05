import React, { useState, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import authService from '../../api/authService';
import toast, { Toaster } from 'react-hot-toast';
import '../AdminLogin/AdminLogin.css';
import './Admin2FA.css';

const Admin2FA = ({ user, onBack, onVerify }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isRTL, setIsRTL] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const toggleRTL = () => {
        setIsRTL(!isRTL);
        document.body.dir = isRTL ? 'ltr' : 'rtl';
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        
        // Take only the last character if multiple are entered (fallback)
        const singleValue = value.slice(-1);

        const newCode = [...code];
        newCode[index] = singleValue;
        setCode(newCode);

        if (singleValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (index, e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6 - index);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = [...code];
        const digits = pastedData.split('');
        
        digits.forEach((digit, idx) => {
            if (index + idx < 6) newCode[index + idx] = digit;
        });

        setCode(newCode);
        
        // Focus the last filled or next empty
        const nextIndex = Math.min(index + digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const [showSupportModal, setShowSupportModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = code.join('');
        
        if (otpCode.length < 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await authService.verifyOtp(user.userId, otpCode);
            toast.success('Verification successful!');
            if (onVerify) onVerify(user);
        } catch (error) {
            console.error('Verification error:', error);
            const message = error.response?.data?.message || 'Invalid verification code';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`admin-login-wrapper ${isRTL ? 'rtl' : ''}`}>
            <Toaster position="top-right" />

            {showSupportModal && (
                <div className="support-modal-overlay" onClick={() => setShowSupportModal(false)}>
                    <div className="support-alert-card glass-panel" onClick={e => e.stopPropagation()}>
                        <h2>Contact Support</h2>
                        <p>If you're having trouble with the verification code, please contact administration:</p>
                        <div className="support-contact-info">
                            <div className="contact-item">
                                <strong>Email:</strong> support@importlink.com
                            </div>
                            <div className="contact-item">
                                <strong>Phone:</strong> +213 (0) 555 12 34 56
                            </div>
                        </div>
                        <button className="close-alert-btn" onClick={() => setShowSupportModal(false)}>Close</button>
                    </div>
                </div>
            )}
            <div className="dark-theme-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            <form className="login-card-form two-factor-card glass-panel" onSubmit={handleSubmit}>
                <div className="lock-icon-badge green-badge">
                    <FiLock size={32} color="#fff" />
                </div>
                
                <h1>Two-Factor<br/>Authentication</h1>
                <p className="desc subtitle-2fa">Enter the 6-digit code from your email</p>

                <div className="otp-container">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={(e) => handlePaste(index, e)}
                        />
                    ))}
                </div>

                <div className="btn-group">
                    <button type="submit" className="submit-btn verify-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                    
                    <button type="button" className="back-btn" onClick={onBack} disabled={loading}>
                        Back to Login
                    </button>
                </div>

                <button type="button" className="help-link-btn" onClick={() => setShowSupportModal(true)}>
                    Need help signing in?
                </button>
            </form>
        </div>
    );
};

export default Admin2FA;
