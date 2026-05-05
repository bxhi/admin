import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import authService from '../../api/authService';
import toast, { Toaster } from 'react-hot-toast';

const AdminLogin = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRTL, setIsRTL] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleRTL = () => {
        setIsRTL(!isRTL);
        document.body.dir = isRTL ? 'ltr' : 'rtl';
    };

    const [showSupportModal, setShowSupportModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const data = await authService.login(email, password);
            
            // Verify if the role is admin
            if (data.user && data.user.role === 'admin') {
                // Send verification code
                await authService.sendOtp(data.user.userId);
                toast.success('Verification code sent to your email');
                
                // Proceed to 2FA
                if (onLoginSuccess) onLoginSuccess(data.user);
            } else {
                toast.error('Access Denied: Admin role required');
            }
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
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
                        <p>If you're having trouble signing in, please reach out to our administration team:</p>
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
            {/* Subtle Neon Background from Dark Theme */}
            <div className="dark-theme-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            {/* The Form is the Card */}
            <form className="login-card-form glass-panel" onSubmit={handleSubmit}>
                <div className="lock-icon-badge">
                    <FiLock size={32} color="#fff" />
                </div>

                <h1>Admin Login</h1>
                <p className="desc">Enter your credentials to access the admin dashboard</p>

                <div className="field">
                    <label>Email Address</label>
                    <div className="input-field-wrapper">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label>Password</label>
                    <div className="input-field-wrapper">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Processing...' : 'Continue to 2FA'}
                </button>

                <button type="button" className="help-link-btn" onClick={() => setShowSupportModal(true)}>
                    Need help signing in?
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
