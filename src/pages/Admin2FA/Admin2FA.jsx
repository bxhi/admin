import React, { useState, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import '../AdminLogin/AdminLogin.css';
import './Admin2FA.css';

const Admin2FA = ({ onBack, onVerify }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isRTL, setIsRTL] = useState(false);
    const inputRefs = useRef([]);

    const toggleRTL = () => {
        setIsRTL(!isRTL);
        document.body.dir = isRTL ? 'ltr' : 'rtl';
    };

    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        if (value.length > 1) {
            // Handle paste
            const pastedText = value.slice(0, 6).split('');
            const newCode = [...code];
            pastedText.forEach((char, i) => {
                if (index + i < 6) newCode[index + i] = char;
            });
            setCode(newCode);
            // Focus last filled
            const focusIndex = Math.min(index + pastedText.length, 5);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // move to next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('2FA attempt:', code.join(''));
        if (onVerify) onVerify();
    };

    return (
        <div className={`admin-login-wrapper ${isRTL ? 'rtl' : ''}`}>
            {/* Subtle Neon Background from Dark Theme */}
            <div className="dark-theme-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            <form className="login-card-form two-factor-card glass-panel" onSubmit={handleSubmit}>
                <div className="lock-icon-badge green-badge">
                    <FiLock size={32} color="#fff" />
                </div>
                
                <h1>Two-Factor<br/>Authentication</h1>
                <p className="desc subtitle-2fa">Enter the 6-digit code from your authenticator app</p>

                <div className="otp-container">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="6" /* Actually we handle paste manually, so 6 is good */
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                <div className="btn-group">
                    <button type="submit" className="submit-btn verify-btn">
                        Verify & Login
                    </button>
                    
                    <button type="button" className="back-btn" onClick={onBack}>
                        Back to Login
                    </button>
                </div>

                <a href="#" className="help-link">Need help signing in?</a>
            </form>

        </div>
    );
};

export default Admin2FA;
