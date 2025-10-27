// src/pages/admin/LiveDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import { getAnalytics, getRecentActivity } from '../../utils/api';

const LiveDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Real-time updates every 30 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, activityData] = await Promise.all([
          getAnalytics({ 
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          }),
          getRecentActivity()
        ]);
        
        setStats(analyticsData);
        setRecentActivity(activityData);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (eventType) => {
    const icons = {
      'order_created': 'fas fa-shopping-cart text-success',
      'login_attempt': 'fas fa-sign-in-alt text-primary',
      'page_view': 'fas fa-eye text-info',
      'add_to_cart': 'fas fa-cart-plus text-warning',
      'custom_order_request': 'fas fa-paint-brush text-purple'
    };
    return icons[eventType] || 'fas fa-circle text-secondary';
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <Container className="live-dashboard py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Live Dashboard</h2>
        <div className="d-flex align-items-center">
          <span className="badge bg-success me-2">Live</span>
          <small className="text-muted">Updates every 30 seconds</small>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="stat-icon text-primary mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="text-primary">{stats.totalVisitors || 0}</h3>
              <p className="text-muted mb-0">Visitors Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="stat-icon text-success mb-2">
                <i className="fas fa-shopping-cart fa-2x"></i>
              </div>
              <h3 className="text-success">{stats.totalOrders || 0}</h3>
              <p className="text-muted mb-0">Orders Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="stat-icon text-warning mb-2">
                <i className="fas fa-rupee-sign fa-2x"></i>
              </div>
              <h3 className="text-warning">Rs {stats.totalRevenue?.toFixed(2) || '0.00'}</h3>
              <p className="text-muted mb-0">Revenue Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="stat-icon text-info mb-2">
                <i className="fas fa-percentage fa-2x"></i>
              </div>
              <h3 className="text-info">
                {stats.conversionRate ? `${(stats.conversionRate * 100).toFixed(1)}%` : '0%'}
              </h3>
              <p className="text-muted mb-0">Conversion Rate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <i className="fas fa-activity me-2"></i>
            Live Activity Feed
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Event</th>
                  <th>User</th>
                  <th>Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.slice(0, 20).map((activity, index) => (
                  <tr key={index}>
                    <td>
                      <i className={getEventIcon(activity.eventType)}></i>
                      <span className="ms-2">{activity.eventType.replace('_', ' ')}</span>
                    </td>
                    <td>
                      {activity.userId ? (
                        <span>
                          {activity.userId.name}
                          <Badge bg="secondary" className="ms-1">
                            {activity.userRole}
                          </Badge>
                        </span>
                      ) : (
                        <span className="text-muted">Guest</span>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">{activity.page}</small>
                      {activity.ecommerce && (
                        <Badge bg="success" className="ms-1">
                          Rs {activity.ecommerce.value}
                        </Badge>
                      )}
                    </td>
                    <td>
                      <small>{new Date(activity.timestamp).toLocaleString()}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LiveDashboard;
