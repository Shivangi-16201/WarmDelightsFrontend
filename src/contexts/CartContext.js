import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

// Get initial state from localStorage with better error handling
const getInitialCartState = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedCart = localStorage.getItem('cart');
      console.log('Raw localStorage cart:', storedCart);
      
      if (!storedCart || storedCart === 'undefined' || storedCart === 'null') {
        console.log('No valid cart in localStorage, returning default');
        return { items: [], totalPrice: 0, totalItems: 0 };
      }
      
      const parsedCart = JSON.parse(storedCart);
      console.log('Parsed cart:', parsedCart);
      
      // Validate the parsed cart structure
      if (!parsedCart || typeof parsedCart !== 'object' || !Array.isArray(parsedCart.items)) {
        console.log('Invalid cart structure, returning default');
        return { items: [], totalPrice: 0, totalItems: 0 };
      }
      
      return {
        items: parsedCart.items || [],
        totalPrice: parsedCart.totalPrice || 0,
        totalItems: parsedCart.totalItems || 0
      };
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      // Clear corrupted cart data
      localStorage.removeItem('cart');
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  }
  return { items: [], totalPrice: 0, totalItems: 0 };
};

const cartReducer = (state, action) => {
  console.log('Cart Action:', action.type, action.payload);
  
  let newState = { ...state };

  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id || item._id === action.payload.id
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newState.items = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newState.items = [...state.items, action.payload];
      }
      break;

    case 'REMOVE_FROM_CART':
      newState.items = state.items.filter(item => 
        item.id !== action.payload && item._id !== action.payload
      );
      break;

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        // Remove item if quantity is 0 or less
        newState.items = state.items.filter(item =>
          item.id !== action.payload.id && item._id !== action.payload.id
        );
      } else {
        // Update quantity
        newState.items = state.items.map(item =>
          (item.id === action.payload.id || item._id === action.payload.id)
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;

    case 'CLEAR_CART':
      newState = { items: [], totalPrice: 0, totalItems: 0 };
      break;

    case 'LOAD_CART':
      // Action to load cart from external source (like after login)
      newState = action.payload;
      break;

    default:
      console.warn('Unknown cart action:', action.type);
      return state;
  }

  // Calculate totals
  newState.totalItems = newState.items.reduce((total, item) => total + (item.quantity || 0), 0);
  newState.totalPrice = newState.items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);

  console.log('Updated Cart State:', newState);
  return newState;
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, getInitialCartState());

  // Save to localStorage whenever cartState changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(cartState));
        console.log('Saved cart to localStorage:', cartState);
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartState]);

  const addToCart = (product, quantity) => {
    try {
      console.log('Adding to cart:', product.name, 'Quantity:', quantity);
      
      // Validate inputs
      if (!product) {
        console.error('Product is required');
        toast.error('Invalid product');
        return;
      }

      if (!quantity || quantity <= 0) {
        console.error('Valid quantity is required');
        toast.error('Please enter a valid quantity');
        return;
      }

      // Ensure we have a valid product ID
      const productId = product._id;
      if (!productId || typeof productId !== 'string') {
        console.error('Product missing ID:', product);
        toast.error('Error adding product to cart');
        return;
      }

      // Validate minimum quantities based on your business rules
      let minQuantity = product.minQuantity || 1;
      if (product.category === 'Cupcakes' || product.category === 'muffins') {
        minQuantity = Math.max(minQuantity, 4);
      } else if (product.category === 'Cookies' && product.unit === 'box') {
        minQuantity = Math.max(minQuantity, 1);
      }

      if (quantity < minQuantity) {
        toast.error(`Minimum order for ${product.name} is ${minQuantity} ${product.unit || 'pieces'}`);
        return;
      }

      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          _id: productId,
          id: productId,
          name: product.name,
          price: parseFloat(product.price) || 0,
          image: product.image || '/images/placeholder-food.jpg',
          quantity: parseInt(quantity),
          product: product
        }
      });

      toast.success(`Added ${quantity}x ${product.name} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = (productId) => {
    try {
      if (!productId) {
        console.error('Product ID is required for removal');
        return;
      }

      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId
      });
      
      toast.info('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      if (!productId) {
        console.error('Product ID is required for update');
        return;
      }

      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        console.error('Invalid quantity:', quantity);
        return;
      }

      if (parsedQuantity === 0) {
        removeFromCart(productId);
        return;
      }
      
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity: parsedQuantity }
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      toast.info('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartCount = () => {
    return cartState.totalItems || 0;
  };

  const getCartItemsCount = () => {
    return cartState.totalItems || 0;
  };

  // Helper function to get item by ID
  const getCartItem = (productId) => {
    return cartState.items.find(item => 
      item.id === productId || item._id === productId
    );
  };

  // Helper function to check if item exists in cart
  const isInCart = (productId) => {
    return cartState.items.some(item => 
      item.id === productId || item._id === productId
    );
  };

  const total = cartState.totalPrice || 0;

  const value = {
    items: cartState.items || [],
    total: total,
    totalItems: cartState.totalItems || 0,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartItemsCount,
    getCartItem,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
