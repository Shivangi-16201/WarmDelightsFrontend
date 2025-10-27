import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Spinner } from 'react-bootstrap';
import { getAnalytics, getRecentActivity } from '../../utils/api';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    fetchAnalytics();
    fetchRecentActivity();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics({
        startDate: new Date(dateRange.start).toISOString(),
        endDate: new Date(dateRange.end + 'T23:59:59').toISOString()
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const data = await getRecentActivity();
      setRecentActivity(data);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const refreshData = () => {
    fetchAnalytics();
    fetchRecentActivity();
    trackEvent({ eventType: 'admin_analytics_refresh' });
  };

  if (loading) {
    return (
      <Container className="admin-analytics py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-analytics py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Analytics Dashboard</h2>
            <Button variant="outline-primary" onClick={refreshData}>
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </Button>
          </div>
          
          <div className="d-flex gap-3 align-items-center mt-3">
            <Form.Group>
              <Form.Label>From</Form.Label>
              <Form.Control
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>To</Form.Label>
              <Form.Control
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-primary mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <Card.Title>Total Visitors</Card.Title>
              <h2 className="text-primary">{analytics.totalVisitors || 0}</h2>
              <small className="text-muted">Unique visitors</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-success mb-2">
                <i className="fas fa-shopping-cart fa-2x"></i>
              </div>
              <Card.Title>Total Orders</Card.Title>
              <h2 className="text-success">{analytics.totalOrders || 0}</h2>
              <small className="text-muted">Completed orders</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-info mb-2">
                <i className="fas fa-percentage fa-2x"></i>
              </div>
              <Card.Title>Conversion Rate</Card.Title>
              <h2 className="text-info">
                {analytics.conversionRate ? `${(analytics.conversionRate * 100).toFixed(1)}%` : '0%'}
              </h2>
              <small className="text-muted">Visitor to order</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body className="text-center">
              <div className="stat-icon text-warning mb-2">
                <i className="fas fa-rupee-sign fa-2x"></i>
              </div>
              <Card.Title>Revenue</Card.Title>
              <h2 className="text-warning">Rs {analytics.totalRevenue?.toFixed(2) || '0.00'}</h2>
              <small className="text-muted">Total sales</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Analytics */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Top Products</h5>
            </Card.Header>
            <Card.Body>
              {analytics.topProducts?.length > 0 ? (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.orders}</td>
                        <td>Rs {product.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No product data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Traffic Sources</h5>
            </Card.Header>
            <Card.Body>
              {analytics.trafficSources && Object.keys(analytics.trafficSources).length > 0 ? (
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Visitors</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analytics.trafficSources).map(([source, data]) => (
                      <tr key={source}>
                        <td>{source || 'Direct'}</td>
                        <td>{data.visitors}</td>
                        <td>
                          {data.conversionRate !== undefined && data.conversionRate !== null
                            ? (data.conversionRate * 100).toFixed(1) + '%'
                            : '0%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No traffic data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              {recentActivity.length > 0 ? (
                <div className="activity-feed">
                  {recentActivity.slice(0, 10).map((activity, index) => (
                    <div key={index} className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-icon me-3">
                        <i className={`fas ${
                          activity.eventType === 'purchase' ? 'fa-shopping-cart text-success' :
                          activity.eventType === 'page_view' ? 'fa-eye text-primary' :
                          activity.eventType === 'add_to_cart' ? 'fa-cart-plus text-warning' :
                          'fa-star text-info'
                        }`}></i>
                      </div>
                      <div className="activity-content flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <span>
                            {activity.userId ? `User ${activity.userId.name}` : 'Guest'} • 
                            {activity.eventType.replace('_', ' ')}
                          </span>
                          <small className="text-muted">
                            {new Date(activity.createdAt).toLocaleString()}
                          </small>
                        </div>
                        <small className="text-muted">{activity.page}</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No recent activity</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;