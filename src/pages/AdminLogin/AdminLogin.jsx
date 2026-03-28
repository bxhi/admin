import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRTL, setIsRTL] = useState(false);

    const toggleRTL = () => {
        setIsRTL(!isRTL);
        document.body.dir = isRTL ? 'ltr' : 'rtl';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        if (onLogin) onLogin();
    };

    return (
        <div className={`admin-login-wrapper ${isRTL ? 'rtl' : ''}`}>
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

                <button type="submit" className="submit-btn">
                    Continue to 2FA
                </button>

                <a href="#" className="help-link">Need help signing in?</a>
            </form>
        </div>
    );
};

export default AdminLogin;
