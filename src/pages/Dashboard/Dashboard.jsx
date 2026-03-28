import React from 'react';
import './Dashboard.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { FiUsers, FiActivity, FiBox, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = ({ onNavigate }) => {
    const statCards = [
        { title: 'Total Users', value: '12,483', trend: '+12.5%', isPositive: true, icon: <FiUsers />, colorClass: 'blue' },
        { title: 'Active Importators', value: '3,247', trend: '+8.2%', isPositive: true, icon: <FiActivity />, colorClass: 'green' },
        { title: 'Total Orders', value: '8,921', trend: '+15.3%', isPositive: true, icon: <FiBox />, colorClass: 'orange' },
        { title: 'Escrow Balance', value: '$2.4M', trend: '+22.1%', isPositive: true, icon: <FiDollarSign />, colorClass: 'purple' },
        { title: 'Revenue', value: '$456.8K', trend: '+18.7%', isPositive: true, icon: <FiTrendingUp />, colorClass: 'blue' }
    ];

    const pieData = [
        { name: 'Completed', value: 40, color: '#10b981' },
        { name: 'In Progress', value: 30, color: '#3b82f6' },
        { name: 'Pending', value: 15, color: '#f59e0b' },
        { name: 'Cancelled', value: 15, color: '#ef4444' }
    ];

    const lineData = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: 68000 },
        { month: 'Jul', revenue: 74000 },
    ];

    const recentActivity = [
        { user: 'John Smith', action: 'Verification Approved', time: '5 minutes ago', status: 'success' },
        { user: 'Sarah Johnson', action: 'Escrow Released', time: '12 minutes ago', status: 'success' },
        { user: 'Mike Wilson', action: 'Verification Rejected', time: '23 minutes ago', status: 'danger' },
        { user: 'Emily Davis', action: 'New Registration', time: '35 minutes ago', status: 'info' },
        { user: 'Robert Brown', action: 'Inspection Completed', time: '1 hour ago', status: 'success' }
    ];

    return (
        <DashboardLayout onNavigate={onNavigate} activePage="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Overview of your platform performance and metrics</p>
            </div>

            <div className="stat-cards-container five-cols">
                {statCards.map((card, index) => (
                    <div key={index} className="stat-card glass-panel flex-stat">
                        <div className="stat-top-row">
                            <div className={`icon-container small-icon ${card.colorClass}`}>{card.icon}</div>
                            <div className={`trend-badge ${card.isPositive ? 'positive' : 'negative'}`}>
                                {card.trend}
                            </div>
                        </div>
                        <div className="stat-content-bottom">
                            <p>{card.title}</p>
                            <h3>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-charts-row">
                <div className="chart-card line-chart-card glass-panel">
                    <div className="chart-header">
                        <h2>Revenue Trend</h2>
                    </div>
                    <div className="line-chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.5} />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={{ stroke: '#334155' }} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={{ stroke: '#334155' }} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                    tickFormatter={(v) => `${v}`} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line 
                                    name="revenue"
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#0a0f1e', strokeWidth: 2, stroke: '#3b82f6' }} 
                                    activeDot={{ r: 6, fill: '#fff' }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="chart-legend-bottom">
                            <span className="legend-dot blue-dot"></span>
                            <span className="legend-text">revenue</span>
                        </div>
                    </div>
                </div>

                <div className="chart-card pie-chart-card glass-panel">
                    <h2>Orders Distribution</h2>
                    <div className="pie-chart-content distribute">
                        <div className="pie-chart-wrapper large">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie 
                                        data={pieData} 
                                        innerRadius={60} 
                                        outerRadius={100} 
                                        paddingAngle={2} 
                                        dataKey="value" 
                                        stroke="rgba(15,15,23,0.8)"
                                        strokeWidth={3}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="custom-legend right-side">
                            {pieData.map((item, index) => (
                                <div key={index} className="legend-item plain">
                                    <span className="legend-dot" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}></span>
                                    <span className="legend-label" style={{ color: item.color }}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-section-card recent-activity-card glass-panel">
                <div className="activity-header">
                    <h2>Recent Activity</h2>
                    <a href="#" className="view-all-link">View All</a>
                </div>
                <div className="table-container">
                    <table className="activity-table neat-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>Time</th>
                                <th className="center-cell">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.map((activity, index) => (
                                <tr key={index}>
                                    <td className="user-cell">{activity.user}</td>
                                    <td>{activity.action}</td>
                                    <td className="time-cell">{activity.time}</td>
                                    <td className="center-cell">
                                        <span className={`status-pill ${activity.status}`}>
                                            {activity.status === 'danger' ? 'danger' : activity.status === 'info' ? 'info' : 'success'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default Dashboard;
