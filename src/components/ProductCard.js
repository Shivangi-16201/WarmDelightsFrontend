import React, { useState } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(product.minQuantity);
  const { addToCart } = useCart();

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value);
    
    // Validate minimum quantities
    if (product.category === 'Cupcakes' || product.category === 'muffins') {
      newQuantity = Math.max(newQuantity, 4);
    } else if (product.category === 'Cookies' && product.unit === 'box') {
      newQuantity = Math.max(newQuantity, 1);
    } else {
      newQuantity = Math.max(newQuantity, product.minQuantity);
    }
    
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
  console.log('ProductCard: Adding to cart:', product.name, 'Quantity:', quantity);
  console.log('Product object:', product);
  
  addToCart(product, quantity);

  // Show immediate feedback
  const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"total":0}');
  console.log('Cart after addition:', cart);
  };

  return (
    <Card className="h-100 product-card">
      <div className="product-image-container">
        <Card.Img
          variant="top"
          src={product.image || '/images/placeholder-food.jpg'}
          alt={product.name}
          className="product-image"
        />
        {product.category === 'Cookies' && product.unit === 'box' && (
          <Badge bg="info" className="product-badge">1 box = 250g</Badge>
        )}
        {(product.category === 'Cupcakes' || product.category === 'muffins') && (
          <Badge bg="warning" className="product-badge">Min. 4 pieces</Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-primary">{product.name}</Card.Title>
        <Card.Text className="flex-grow-1">{product.description}</Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success mb-0">Rs {product.price.toFixed(2)}</h5>
          {product.minQuantity > 1 && (
            <small className="text-muted">
              Min: {product.minQuantity} {product.unit}
            </small>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <Form.Group className="quantity-selector">
            <Form.Label srOnly>Quantity</Form.Label>
            <Form.Control
              type="number"
              min={product.category === 'Cupcakes' || product.category === 'muffins' ? 4 : 
                   (product.category === 'Cookies' && product.unit === 'box' ? 1 : product.minQuantity)}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '80px' }}
            />
          </Form.Group>
          
          <Button
            variant="primary"
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;