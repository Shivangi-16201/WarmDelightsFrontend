import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import RealTimeAnalytics from '../../components/RealTimeAnalytics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { trackEvent, analytics } = useAnalytics(); // Added analytics here

  useEffect(() => {
    trackEvent('admin_dashboard_visited');
  }, [trackEvent]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      {/* Add RealTime Analytics Component */}
      <RealTimeAnalytics />

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/products" className="action-card">
            <div className="action-icon">📦</div>
            <h3>Product Management</h3>
            <p>Add, edit, or remove products from your menu</p>
          </Link>

          <Link to="/admin/orders" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Order Management</h3>
            <p>View and manage customer orders</p>
          </Link>

          <Link to="/admin/gallery" className="action-card">
            <div className="action-icon">🖼️</div>
            <h3>Gallery Management</h3>
            <p>Upload and manage product images</p>
          </Link>

          <Link to="/admin/analytics" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Analytics</h3>
            <p>View detailed reports and insights</p>
          </Link>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="quick-stats-summary">
        <h2>Quick Overview</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-number">{analytics.todayVisitors || 0}</span>
            <span className="summary-label">Today's Visitors</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{analytics.cartAdditions || 0}</span>
            <span className="summary-label">Cart Additions</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{analytics.whatsappOrders || 0}</span>
            <span className="summary-label">WhatsApp Orders</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{analytics.imagesUploaded || 0}</span>
            <span className="summary-label">Images Uploaded</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;