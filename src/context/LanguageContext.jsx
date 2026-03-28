import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    
    // Stub translations
    const t = {
        activeCommands: 'Active Commands',
        activeNegotiations: 'Active Negotiations',
        activeOrders: 'Active Orders',
        pointsBalance: 'Points Balance',
        completed: 'Completed',
        inProgress: 'In Progress',
        pending: 'Pending',
        cancelled: 'Cancelled',
        jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', may: 'May', jun: 'Jun',
        actNewProposal: 'New Proposal',
        actOrderCompleted: 'Order Completed',
        actPaymentReceived: 'Payment Received',
        actNegotiationStarted: 'Negotiation Started',
        statusNew: 'New',
        statusPaid: 'Paid',
        statusNegotiating: 'Negotiating',
        dashboardTitle: 'Dashboard',
        dashboardSubtitle: 'Overview of your platform performance and metrics',
        earningsOverview: 'Revenue Trend',
        monthlyEarnings: 'Monthly Revenue',
        last6Months: 'Last 6 Months',
        last12Months: 'Last 12 Months',
        thisYear: 'This Year',
        ordersByStatus: 'Orders Distribution',
        quickActions: 'Quick Actions',
        createOffer: 'Create Offer',
        browseCommands: 'Browse Commands',
        thisMonth: 'This Month',
        totalEarnings: 'Total Earnings',
        ordersCompleted: 'Orders Completed',
        avgRating: 'Average Rating',
        recentActivity: 'Recent Activity',
        orderId: 'Order ID',
        client: 'Client',
        action: 'Action',
        amount: 'Amount',
        time: 'Time',
        status: 'Status'
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
