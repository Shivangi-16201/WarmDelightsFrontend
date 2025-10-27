import React from 'react';
import { Offcanvas, ListGroup, Button, Form, Badge, Alert } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const CartSidebar = ({ show, onHide }) => {
  const { items, total, updateQuantity, removeFromCart, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    onHide();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onHide();
    navigate('/menu');
  };

  const getMinimumQuantity = (product) => {
    if (product.category === 'Cupcakes' || product.category === 'muffins') return 4;
    if (product.category === 'Cookies' && product.unit === 'box') return 1;
    return product.minQuantity;
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="cart-sidebar">
      <Offcanvas.Header closeButton className="cart-header">
        <Offcanvas.Title className="cart-title">
          <i className="fas fa-shopping-cart me-2"></i>
          Shopping Cart
          {getCartCount() > 0 && (
            <Badge bg="primary" className="cart-badge">
              {getCartCount()}
            </Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="cart-body">
        {items.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h5>Your cart is empty</h5>
            <p className="text-muted">Add some delicious treats to get started!</p>
            <Button variant="primary" onClick={handleContinueShopping} className="w-100">
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <ListGroup variant="flush" className="cart-items">
              {items.map((item) => {
                const minQuantity = getMinimumQuantity(item.product);
                return (
                  <ListGroup.Item key={item._id} className="cart-item">
                    <div className="cart-item-content">
                      <div className="cart-item-details">
                        <h6 className="item-name">{item.product.name}</h6>
                        <p className="item-category">{item.product.category}</p>
                        <p className="item-price">Rs {item.price.toFixed(2)} each</p>
                        
                        <div className="item-controls">
                          <Form.Control
                            type="number"
                            min={minQuantity}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                            className="quantity-input"
                          />
                          
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCart(item._id)}
                            className="remove-btn"
                            title="Remove item"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                          
                          <span className="item-total">Rs {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {minQuantity > 1 && (
                          <small className="text-muted min-quantity">
                            Minimum: {minQuantity} {item.product.unit}
                          </small>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>

            {/* Order Summary */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span className="summary-value">Rs {total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span className="text-muted">Delivery:</span>
                <span className="text-muted">
                  {total >= 1000 ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>

              {total < 1000 && (
                <Alert variant="info" className="delivery-alert">
                  <i className="fas fa-info-circle me-1"></i>
                  Add Rs {(1000 - total).toFixed(2)} more for free delivery!
                </Alert>
              )}

              <hr className="summary-divider" />
              
              <div className="summary-row total-row">
                <strong>Total:</strong>
                <strong className="total-amount">Rs {total.toFixed(2)}</strong>
              </div>

              <Button 
                variant="primary" 
                className="checkout-btn w-100 mb-2"
                onClick={handleCheckout}
                size="lg"
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Button>
              
              <Button 
                variant="outline-primary" 
                className="continue-btn w-100"
                onClick={handleContinueShopping}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </Button>
              
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="clear-cart-btn w-100 mt-3"
                onClick={clearCart}
              >
                <i className="fas fa-trash me-2"></i>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartSidebar;