import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Menu.css';
import { getProducts } from '../utils/api'; // Adjust based on your API util

const Menu = () => {
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState({
    cakes: [],
    cookies: [],
    cupcakes: []
  });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products from the backend
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Get all products
        const allProducts = await getProducts(); // Fetch all products from API
        
        // Group products by category
        const cakes = allProducts.filter(p => p.category === 'cakes');
        const cookies = allProducts.filter(p => p.category === 'cookies');
        const cupcakes = allProducts.filter(p => 
          p.category === 'cupcakes' || p.category === 'muffins'
        );
        
        setProducts({ cakes, cookies, cupcakes });
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleCustomize = () => {
    navigate('/custom-order');
  };

  const handleAddToCart = (product) => {
    // Always use the real _id (ObjectId) as productId
    const qty = quantities[product._id] || product.minQuantity;
    addToCart(product, qty);
    alert(`Added ${qty} ${product.name} to cart!`);
    setQuantities(prev => ({ ...prev, [product._id]: product.minQuantity }));
  };

  const ProductCard = ({ product }) => {
    const qty = quantities[product._id] || product.minQuantity;
    const displayPrice = product.pack ? `₹${product.price}/${product.pack}` : `₹${product.price}`;

    return (
      <div className="product-card">
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="description">{product.description}</p>
          <p className="min-order">Minimum {product.minQuantity} {product.unit}</p>
          <p className="price">{displayPrice}</p>
        </div>
        <div className="product-actions">
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange(product._id, -1)}>-</button>
            <span>{qty}</span>
            <button onClick={() => handleQuantityChange(product._id, 1)}>+</button>
          </div>
          <div className="action-buttons">
            <button className="customize-btn" onClick={handleCustomize}>
              Customize
            </button>
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="menu-page">
        <div className="container">
          <h1>Loading Menu...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="container">
        <h1>Our Menu</h1>
        
        <section className="menu-section">
          <h2>Cakes</h2>
          <div className="products-grid">
            {products.cakes.length > 0 ? (
              products.cakes.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No cakes available at the moment.</p>
            )}
          </div>
        </section>

        <section className="menu-section">
          <h2>Cookies</h2>
          <div className="products-grid">
            {products.cookies.length > 0 ? (
              products.cookies.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No cookies available at the moment.</p>
            )}
          </div>
        </section>

        <section className="menu-section">
          <h2>Cupcakes & Muffins</h2>
          <div className="products-grid">
            {products.cupcakes.length > 0 ? (
              products.cupcakes.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No cupcakes or muffins available at the moment.</p>
            )}
          </div>
        </section>

        <div className="disclaimer">
          <h3>Important Information</h3>
          <ul>
            <li>All our products are 100% eggless and can be customised to your preferences.</li>
            <li>Prices may vary depending on the level of customisation; the ones mentioned here serve as a general guide.</li>
            <li>We also offer allergen-friendly options to suit your dietary needs.</li>
            <li>We also offer a wide range of bakery products such as breads, doughnuts, and dry cakes, prepared fresh on demand.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
