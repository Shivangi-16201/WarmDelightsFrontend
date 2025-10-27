import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getOrders, getProducts, getAnalytics } from '../../utils/api';
import './AdminHome.css';

const AdminHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalProducts: 0,
    todayRevenue: 0,
    visitorsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // --- FIX START ---
        const ordersResponse = await getOrders();
        // Normalize: supports [] or { orders: [] }
        const ordersList = Array.isArray(ordersResponse)
          ? ordersResponse
          : Array.isArray(ordersResponse?.orders)
          ? ordersResponse.orders
          : [];
        // --- FIX END ---

        const pendingOrders = ordersList.filter(order =>
          order.status === 'pending' || order.status === 'confirmed'
        ).length;

        // Calculate today's revenue
        const today = new Date().toDateString();
        const todayRevenue = ordersList
          .filter(order => new Date(order.createdAt).toDateString() === today)
          .reduce((sum, order) => sum + order.totalAmount, 0);

        const productsResponse = await getProducts();
        const productsList = Array.isArray(productsResponse)
          ? productsResponse
          : Array.isArray(productsResponse?.products)
          ? productsResponse.products
          : [];
        const totalProducts = productsList.length;

        const analytics = await getAnalytics({
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        });
        const visitorsToday = analytics?.totalVisitors || 0;

        setStats({
          pendingOrders,
          totalProducts,
          todayRevenue,
          visitorsToday
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s for "more real-time"
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-home">
      <div className="admin-hero">
        <div className="container">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your bakery operations from the admin dashboard</p>
          <Link to="/admin/dashboard" className="cta-button">
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className="admin-features">
        <div className="container">
          <h2>What you can do:</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Product Management</h3>
              <p>Add, edit, and manage your bakery products and menu items</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Order Management</h3>
              <p>View and process customer orders, update order status</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>Gallery Management</h3>
              <p>Upload and manage product images for your gallery</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Reports</h3>
              <p>Track sales, visitors, and business performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-quick-stats">
        <div className="container">
          <h2>Quick Overview</h2>
          {loading ? (
            <p>Loading stats...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.pendingOrders}</span>
                <span className="stat-label">Pending Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalProducts}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Rs {stats.todayRevenue.toFixed(2)}</span>
                <span className="stat-label">Today's Revenue</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.visitorsToday}</span>
                <span className="stat-label">Visitors Today</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
