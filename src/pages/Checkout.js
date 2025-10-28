import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../utils/api';
import { useAnalytics } from '../contexts/AnalyticsContext';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [formData, setFormData] = useState({
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    contactNumber: user?.phone || '',
    deliveryDate: '',
    deliveryInstructions: '',
    paymentMethod: 'cod'
  });

  React.useEffect(() => {
    trackEvent({ eventType: 'page_view', page: '/checkout' });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate minimum quantities
      for (const item of items) {
        if ((item.product.category === 'Cupcakes' || item.product.category === 'Muffins') && item.quantity < 4) {
          throw new Error(`Minimum order for ${item.product.name} is 4 pieces`);
        }
        if (item.product.category === 'Cookies' && item.product.unit === 'Box' && item.quantity < 1) {
          throw new Error(`Minimum order for ${item.product.name} is 1 box (250g)`);
        }
      }

      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization
        })),
        totalAmount: total,
        ...formData,
        deliveryDate: new Date(formData.deliveryDate).toISOString()
      };

      const order = await createOrder(orderData);
      
      setOrderDetails(order);
      setShowSuccess(true);
      clearCart();

      const waPhone = "9805189494"; // Replace with your WhatsApp number
      const waMessage = encodeURIComponent(
        `Cart Checkout\nName: ${user?.name || "Customer"}\nPhone: ${formData.contactNumber}\nItems:\n${items.map(item => `${item.product.name} x${item.quantity}`).join('\n')}\nTotal: Rs ${total}\nDelivery: ${formData.deliveryAddress.street}, ${formData.deliveryAddress.city}, ${formData.deliveryAddress.state} ${formData.deliveryAddress.pincode}\nInstructions: ${formData.deliveryInstructions}`
      );
      window.open(`https://wa.me/${waPhone}?text=${waMessage}`, "_blank");

      
      trackEvent({ 
        eventType: 'purchase', 
        metadata: { 
          orderId: order.orderId, 
          totalAmount: order.totalAmount,
          items: order.items.length
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Order failed. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="checkout-page py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="warning">
              <h4>Please log in to checkout</h4>
              <p>You need to be logged in to complete your purchase.</p>
              <Button href="/login" variant="primary" className="me-2">
                Login
              </Button>
              <Button href="/register" variant="outline-primary">
                Register
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (items.length === 0 && !showSuccess) {
    return (
      <Container className="checkout-page py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="info">
              <h4>Your cart is empty</h4>
              <p>Add some delicious treats to your cart first!</p>
              <Button href="/menu" variant="primary">
                Browse Menu
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="checkout-page py-5">
      <Row>
        <Col lg={8}>
          <h2 className="mb-4">Checkout</h2>

          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">Delivery Information</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="street">Street Address *</Form.Label>
                      <Form.Control
                        id="street"
                        type="text"
                        name="deliveryAddress.street"
                        value={formData.deliveryAddress.street}
                        onChange={handleInputChange}
                        required
                        autoComplete="street-address"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="city">City *</Form.Label>
                      <Form.Control
                        id="city"
                        type="text"
                        name="deliveryAddress.city"
                        value={formData.deliveryAddress.city}
                        onChange={handleInputChange}
                        required
                        autoComplete="address-level2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="state">State *</Form.Label>
                      <Form.Control
                        id="state"
                        type="text"
                        name="deliveryAddress.state"
                        value={formData.deliveryAddress.state}
                        onChange={handleInputChange}
                        required
                        autoComplete="address-level1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="pincode">Pincode *</Form.Label>
                      <Form.Control
                        id="pincode"
                        type="text"
                        name="deliveryAddress.pincode"
                        value={formData.deliveryAddress.pincode}
                        onChange={handleInputChange}
                        required
                        autoComplete="postal-code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="landmark">Landmark</Form.Label>
                  <Form.Control
                    id="landmark"
                    type="text"
                    name="deliveryAddress.landmark"
                    value={formData.deliveryAddress.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby famous place or building"
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="contactNumber">Contact Number *</Form.Label>
                  <Form.Control
                    id="contactNumber"
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    autoComplete="tel"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="deliveryDate">Delivery Date *</Form.Label>
                  <Form.Control
                    id="deliveryDate"
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Form.Text className="text-muted">
                    Please select a date at least 2 days in advance for better availability
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Delivery Instructions</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery..."
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Payment Method *</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      label="Cash on Delivery"
                      id="payment-cod"
                    />
                    <Form.Check
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                      label="Online Payment"
                      id="payment-online"
                    />
                  </div>
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Body>
              <h5 className="mb-4">Order Summary</h5>
              
              {items.map(item => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <div>
                    <span className="fw-medium">{item.product.name}</span>
                    <br />
                    <small className="text-muted">
                      {item.quantity} × Rs {item.price.toFixed(2)}
                    </small>
                  </div>
                  <span>Rs {(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>Rs {total.toFixed(2)}</strong>
              </div>

              <div className="bg-light p-3 rounded">
                <h6>Delivery Information</h6>
                <small className="text-muted">
                  • Free delivery on orders over Rs 1000<br/>
                  • Delivery charges applied below Rs 1000<br/>
                  • Same-day delivery available
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Placed Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails && (
            <>
              <p className="text-success">
                <i className="fas fa-check-circle me-2"></i>
                Thank you for your order!
              </p>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Total Amount:</strong> Rs {orderDetails.totalAmount.toFixed(2)}</p>
              <p><strong>Delivery Date:</strong> {new Date(orderDetails.deliveryDate).toLocaleDateString()}</p>
              <p>We'll send you a confirmation email shortly.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccess(false)}>
            Continue Shopping
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;