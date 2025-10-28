import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import './Cart.css';

const Cart = () => {
  const cartContext = useCart();
  console.log('Cart context:', cartContext); // Check what's actually in the context
  
  const { items, total, updateQuantity, removeFromCart, clearCart } = cartContext || {};
  const { isAuthenticated } = useAuth();
  const { trackEvent } = useAnalytics();
  const [loading, setLoading] = useState(false);

  // Add this safety check at the top
  if (!items) {
    return (
      <Container className="cart-page py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="empty-cart">
              <i className="fas fa-spinner fa-spin fa-3x text-primary mb-4"></i>
              <h2 className="mb-3">Loading cart...</h2>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id, productName) => {
    removeFromCart(id);
    trackEvent({ 
      eventType: 'remove_from_cart', 
      metadata: { productId: id, productName } 
    });
  };

  const handleClearCart = () => {
    clearCart();
    trackEvent({ eventType: 'clear_cart' });
  };

  const getMinimumQuantity = (product) => {
    if (product.category === 'Cupcakes' || product.category === 'Muffins') return 4;
    if (product.category === 'Cookies' && product.unit === 'Box') return 1;
    return product.minQuantity;
  };

  if (!isAuthenticated) {
    return (
      <Container className="cart-page py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="warning" className="auth-alert">
              <i className="fas fa-shopping-cart fa-3x mb-3 text-warning"></i>
              <h3>Please Sign In</h3>
              <p>You need to be signed in to view your shopping cart.</p>
              <div className="d-grid gap-2 d-md-block">
                <Button as={Link} to="/login" variant="primary" className="me-2">
                  Sign In
                </Button>
                <Button as={Link} to="/register" variant="outline-primary">
                  Create Account
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Container className="cart-page py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <div className="empty-cart">
              <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
              <h2 className="mb-3">Your cart is empty</h2>
              <p className="text-muted mb-4">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button as={Link} to="/menu" variant="primary" size="lg">
                <i className="fas fa-utensils me-2"></i>
                Browse Our Menu
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="cart-page py-5">
      <Row>
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="cart-title">
              <i className="fas fa-shopping-cart me-3"></i>
              Shopping Cart
            </h1>
            <Button variant="outline-danger" size="sm" onClick={handleClearCart}>
              <i className="fas fa-trash me-2"></i>
              Clear Cart
            </Button>
          </div>

          <Card className="cart-card">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="cart-table mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((item) => {
                      const minQuantity = getMinimumQuantity(item.product);
                      return (
                        <tr key={item._id} className="cart-item">
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <h6 className="product-name mb-1">{item.product.name}</h6>
                                <Badge 
                                  bg="secondary" 
                                  className="product-category"
                                >
                                  {item.product.category}
                                </Badge>
                                {minQuantity > 1 && (
                                  <small className="d-block text-warning mt-1">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Min: {minQuantity} {item.product.unit}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="product-price">
                            Rs {item.price.toFixed(2)}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min={minQuantity}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                              className="quantity-input"
                              style={{ width: '80px' }}
                            />
                          </td>
                          <td className="product-total">
                            <strong>Rs {(item.price * item.quantity).toFixed(2)}</strong>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveItem(item._id, item.product.name)}
                              title="Remove item"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Minimum Order Notices */}
          {items.some(item => 
            (item.product.category === 'Cupcakes' || item.product.category === 'Muffins') && 
            item.quantity < 4
          ) && (
            <Alert variant="warning" className="mt-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Note:</strong> Minimum order for cupcakes and muffins is 4 pieces. 
              Please update your quantities.
            </Alert>
          )}

          {items.some(item => 
            item.product.category === 'Cookies' && 
            item.product.unit === 'Box' && 
            item.quantity < 1
          ) && (
            <Alert variant="warning" className="mt-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Note:</strong> Minimum order for cookies is 1 box (250g). 
              Please update your quantities.
            </Alert>
          )}
        </Col>

        <Col lg={4}>
          <Card className="summary-card">
            <Card.Body>
              <h5 className="summary-title mb-4">
                <i className="fas fa-receipt me-2"></i>
                Order Summary
              </h5>
              
              <div className="summary-item">
                <span>Subtotal:</span>
                <span className="summary-value">Rs {total.toFixed(2)}</span>
              </div>
              
              <div className="summary-item">
                <span>Delivery Fee:</span>
                <span className="text-muted">
                  {total >= 1000 ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>

              {total < 1000 && (
                <Alert variant="info" className="delivery-alert mt-3">
                  <i className="fas fa-truck me-2"></i>
                  Add <strong>Rs {(1000 - total).toFixed(2)}</strong> more for free delivery!
                </Alert>
              )}

              <hr className="my-3" />
              
              <div className="summary-total">
                <strong>Total:</strong>
                <strong className="total-amount">Rs {total.toFixed(2)}</strong>
              </div>

              <Button 
                as={Link} 
                to="/checkout" 
                variant="primary" 
                size="lg" 
                className="w-100 mb-3 checkout-btn"
                onClick={() => trackEvent({ eventType: 'proceed_to_checkout' })}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Button>

              <Button 
                as={Link} 
                to="/menu" 
                variant="outline-primary" 
                className="w-100 continue-btn"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </Button>

              <div className="delivery-info mt-4">
                <h6 className="mb-2">
                  <i className="fas fa-truck me-2"></i>
                  Delivery Information
                </h6>
                <small className="text-muted">
                  • Free delivery on orders over Rs 1000<br/>
                  • Same-day delivery available<br/>
                  • Tricity area coverage
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;