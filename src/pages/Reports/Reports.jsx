import React, { useState } from 'react';
import './Reports.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiBarChart2, FiCalendar, FiChevronDown, FiDownload } from 'react-icons/fi';

const Reports = ({ onNavigate }) => {
    // State to simulate date picking/dropdowns
    const [reportType, setReportType] = useState('Revenue');
    const [dateFrom, setDateFrom] = useState('2024-01-01');
    const [dateTo, setDateTo] = useState('2024-02-15');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleRunReport = () => {
        setIsGenerating(true);
        // Simulate network delay
        setTimeout(() => setIsGenerating(false), 1500);
    };

    return (
        <DashboardLayout onNavigate={onNavigate} activePage="reports">
            <div className="dashboard-header">
                <h1>Reports</h1>
                <p>Generate and export platform reports</p>
            </div>

            <div className="reports-container">
                <div className="report-generator-card glass-panel">
                    <h2 className="card-title">Report Generator</h2>
                    
                    <div className="generator-controls">
                        {/* Report Type Dropdown */}
                        <div className="control-group">
                            <label>Report Type</label>
                            <div className="select-wrapper">
                                <select 
                                    className="dark-input dark-select" 
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    <option value="Revenue">Revenue</option>
                                    <option value="User Activity">User Activity</option>
                                    <option value="Escrow Transactions">Escrow Transactions</option>
                                    <option value="Inspections">Inspections</option>
                                </select>
                                <FiChevronDown className="select-icon" />
                            </div>
                        </div>

                        {/* Date From */}
                        <div className="control-group">
                            <label>Date From</label>
                            <div className="input-wrapper">
                                <FiCalendar className="input-icon" />
                                <input 
                                    type="date" 
                                    className="dark-input date-input" 
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Date To */}
                        <div className="control-group">
                            <label>Date To</label>
                            <div className="input-wrapper">
                                <FiCalendar className="input-icon" />
                                <input 
                                    type="date" 
                                    className="dark-input date-input"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Run Button */}
                        <div className="control-group action-group">
                            <button 
                                className={`run-btn ${isGenerating ? 'generating' : ''}`}
                                onClick={handleRunReport}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="spinner"></div> Generating...
                                    </>
                                ) : (
                                    <>
                                        <FiBarChart2 /> Run Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Placeholder Cards for styling out the dark dashboard */}
                <div className="reports-recent-grid">
                     <div className="recent-report-card glass-panel">
                        <div className="r-icon-box blue-box"><FiDownload /></div>
                        <div className="r-info">
                            <h4>Q4 Revenue Summary</h4>
                            <span className="text-secondary">Generated on Feb 10, 2024</span>
                        </div>
                        <button className="download-btn">Export PDF</button>
                    </div>

                    <div className="recent-report-card glass-panel">
                        <div className="r-icon-box purple-box"><FiDownload /></div>
                        <div className="r-info">
                            <h4>Active User Demographics</h4>
                            <span className="text-secondary">Generated on Feb 05, 2024</span>
                        </div>
                        <button className="download-btn">Export CSV</button>
                    </div>

                    <div className="recent-report-card glass-panel">
                        <div className="r-icon-box green-box"><FiDownload /></div>
                        <div className="r-info">
                            <h4>Escrow Release Latency</h4>
                            <span className="text-secondary">Generated on Jan 28, 2024</span>
                        </div>
                        <button className="download-btn">Export XLS</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Reports;
