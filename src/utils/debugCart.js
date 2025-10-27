export const debugCart = {
  logState: () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    console.log('📦 Current Cart State:', cart);
    return cart;
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    console.log('🧹 Cart cleared from localStorage');
  },
  
  testAddItem: () => {
    const testProduct = {
      _id: 'test-product-1',
      name: 'Test Vanilla Cake',
      price: 450,
      image: '/images/placeholder-food.jpg',
      category: 'cakes',
      minQuantity: 1,
      unit: 'pc'
    };
    
    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    
    // Add item in the same format used by CartContext
    cart.items.push({
      id: testProduct._id,
      name: testProduct.name,
      price: testProduct.price,
      image: testProduct.image,
      quantity: 1,
      product: testProduct
    });
    
    // Recalculate totals
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('✅ Test product added to cart:', testProduct.name);
    return cart;
  }
};