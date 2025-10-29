import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import './RealTimeAnalytics.css';

const RealTimeAnalytics = () => {
  const { analytics, resetAnalytics } = useAnalytics();
  const [whatsAppOrdersCount, setWhatsAppOrdersCount] = useState(0);

    useEffect(() => {
      const fetchWhatsAppCount = async () => {
        const res = await fetch('/api/analytics/whatsapp-orders/count');
        const data = await res.json();
        setWhatsAppOrdersCount(data.count);
      };
      fetchWhatsAppCount();
      const interval = setInterval(fetchWhatsAppCount, 15000); // auto-refresh every 15s
      return () => clearInterval(interval);
    }, []);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTopPages = () => {
    return Object.entries(analytics.pageViews || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  return (
    <div className="real-time-analytics">
      <div className="analytics-header">
        <h2>📊 Real-Time Analytics</h2>
        <button onClick={resetAnalytics} className="reset-btn">
          Reset Data
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card realtime">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{formatNumber(analytics.totalVisitors)}</h3>
            <p>Total Visitors</p>
            <span className="stat-sub">{formatNumber(analytics.todayVisitors)} today</span>
          </div>
        </div>

        <div className="stat-card realtime">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{formatNumber(analytics.cartAdditions)}</h3>
            <p>Cart Additions</p>
            <span className="stat-sub">Active shoppers</span>
          </div>
        </div>

        <div className="stat-card realtime">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{formatNumber(analytics.whatsappOrders)}</h3>
            <p>WhatsApp Orders</p>
            <span className="stat-sub">Direct messages</span>
          </div>
        </div>

        <div className="stat-card realtime">
          <div className="stat-icon">🤖</div>
          <div className="stat-content">
            <h3>{formatNumber(analytics.chatbotChats)}</h3>
            <p>Chatbot Chats</p>
            <span className="stat-sub">Customer inquiries</span>
          </div>
        </div>

        <div className="stat-card realtime">
          <div className="stat-icon">📸</div>
          <div className="stat-content">
            <h3>{formatNumber(analytics.imagesUploaded)}</h3>
            <p>Images Uploaded</p>
            <span className="stat-sub">Admin uploads</span>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="live-activity">
        <h3>⚡ Live Activity</h3>
        <div className="activity-feed">
          <div className="activity-item live">
            <div className="activity-badge"></div>
            <p>Real-time tracking active</p>
            <span className="activity-time">Now</span>
          </div>
          <div className="activity-item">
            <p>Data persists across sessions</p>
            <span className="activity-time">Local storage</span>
          </div>
          <div className="activity-item">
            <p>Daily auto-reset at midnight</p>
            <span className="activity-time">Automatic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics;