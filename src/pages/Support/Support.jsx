import React from 'react';
import './Support.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiPhone, FiMail, FiMessageSquare, FiExternalLink, FiClock } from 'react-icons/fi';

const Support = ({ onNavigate, onLogout }) => {
    const contactMethods = [
        {
            title: 'Technical Support',
            desc: 'For issues related to the dashboard, bugs, or technical errors.',
            icon: <FiMessageSquare />,
            contact: 'i.mesbahi@esi-sba.dz',
            actionLabel: 'Send Email',
            color: 'blue'
        },
        {
            title: 'Account Manager',
            desc: 'Direct line for administrative and account-related inquiries.',
            icon: <FiPhone />,
            contact: '+213 540 26 85 13',
            actionLabel: 'Call Now',
            color: 'green'
        },
        {
            title: 'General Inquiries',
            desc: 'For feedback, partnerships, or general platform questions.',
            icon: <FiMail />,
            contact: 'info@importlink.com',
            actionLabel: 'Open Ticket',
            color: 'purple'
        }
    ];

    return (
        <DashboardLayout onNavigate={onNavigate} onLogout={onLogout} activePage="support">
            <div className="dashboard-header">
                <h1>Support Center</h1>
                <p>Contact our team for any issues or platform assistance</p>
            </div>

            <div className="support-container">
                <div className="support-hero glass-panel">
                    <div className="hero-content">
                        <h2>Need Assistance?</h2>
                        <p>Our dedicated support team is available to help you manage the platform effectively. Whether you're facing technical glitches or have administrative questions, we've got you covered.</p>
                        <div className="availability-badge">
                            <FiClock /> <span>Available: Sun - Thu, 09:00 - 18:00 (GMT+1)</span>
                        </div>
                    </div>
                    <div className="hero-illustration">
                        <div className="glow-circle"></div>
                        <FiMessageSquare className="floating-icon" />
                    </div>
                </div>

                <div className="contact-grid">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="contact-card glass-panel">
                            <div className={`method-icon ${method.color}`}>
                                {method.icon}
                            </div>
                            <h3>{method.title}</h3>
                            <p className="method-desc">{method.desc}</p>
                            <div className="method-contact">{method.contact}</div>
                            <button className={`method-btn ${method.color}`}>
                                {method.actionLabel} <FiExternalLink />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="support-footer-card glass-panel">
                    <div className="footer-info">
                        <h3>Frequently Asked Questions</h3>
                        <p>Check our documentation for quick answers to common questions.</p>
                    </div>
                    <button className="docs-btn">
                        View Documentation
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Support;
