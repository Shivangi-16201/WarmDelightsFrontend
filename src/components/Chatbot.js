import React, { useState } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm Warm Delights assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { trackEvent } = useAnalytics();

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    trackEvent('chatbot_chat', { message: inputMessage });

    // Bot response (simulated)
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Greetings
    if (message.match(/\b(hi|hello|hey|hola|good morning|good afternoon|good evening)\b/)) {
      const greetings = [
        "Hello! 😊 How can I help you today?",
        "Hey there! Welcome to Warm Delights! What can I do for you?",
        "Hi! Great to see you! Need help with something?",
        "Hello! 👋 Looking for something delicious?"
      ];
      return createBotMessage(greetings[Math.floor(Math.random() * greetings.length)]);
    }

    // Cash on Delivery (COD) specific
    if (message.match(/\b(cod|cash on delivery|cash delivery|pay on delivery|payment on delivery)\b/)) {
      return createBotMessage(
        "Yes! Cash on Delivery (COD) is available! 💵\n\nYou can pay in cash when your order is delivered. Just select 'Cash on Delivery' as your payment method at checkout."
      );
    }

    // Delivery time - specific
    if (message.match(/\b(how long|how much time|delivery time|when will i get|when receive|arrive)\b/)) {
      return createBotMessage(
        "Delivery times depend on the product:\n\n⏱️ Ready items (menu products): 2-4 hours\n⏱️ Custom orders: 24-48 hours\n⏱️ Same-day delivery available for in-stock items!\n\nWe deliver within the city limits."
      );
    }

    // Advance booking for custom orders
    if (message.match(/\b(how many days|advance|in advance|before|book|notice|lead time)\b/) && 
        message.match(/\b(custom|customize|order|design)\b/)) {
      return createBotMessage(
        "For custom orders, please place your order at least 2-3 days in advance! 📅\n\nThis gives us time to:\n• Source special ingredients\n• Perfect your design\n• Ensure quality\n\nFor urgent orders, contact us on WhatsApp and we'll do our best!"
      );
    }

    // Minimum order quantity
    if (message.match(/\b(minimum|min|least|how many)\b/) && 
        message.match(/\b(order|buy|pieces|quantity)\b/)) {
      return createBotMessage(
        "Minimum order quantities:\n\n🎂 Cakes: 1 cake\n🍪 Cookies: 1 box (250g)\n🧁 Cupcakes/Muffins: 4 pieces\n\nThese minimums ensure freshness and quality!"
      );
    }

    // Same day delivery
    if (message.match(/\b(same day|today|urgent|quickly|fast|immediate)\b/) && 
        message.match(/\b(deliver|delivery|get|receive)\b/)) {
      return createBotMessage(
        "Yes! Same-day delivery is available for menu items! 🚀\n\n⏰ Place your order before 2 PM for same-day delivery\n📦 Custom orders need 24-48 hours\n\nNeed something urgently? Call or WhatsApp us!"
      );
    }

    // Free delivery
    if (message.match(/\b(free delivery|free shipping|delivery charge|delivery fee|shipping cost)\b/)) {
      return createBotMessage(
        "🎉 Free delivery on orders over ₹1000!\n\nFor orders under ₹1000:\n• Delivery charges apply based on distance\n• Usually ₹50-₹100\n\nYou'll see the exact charge at checkout!"
      );
    }

    // Cancellation/Refund
    if (message.match(/\b(cancel|cancellation|refund|return|change order)\b/)) {
      return createBotMessage(
        "Order modifications:\n\n✅ You can cancel/modify orders within 2 hours of placing them\n✅ Full refund for cancellations before preparation starts\n❌ No refunds once baking begins\n\nTo cancel/modify, contact us immediately via phone or WhatsApp!"
      );
    }

    // Bulk orders
    if (message.match(/\b(bulk|large|big|party|event|wedding|corporate|wholesale)\b/) && 
        message.match(/\b(order|quantity)\b/)) {
      return createBotMessage(
        "We LOVE bulk orders! 🎉\n\nFor events, parties, or corporate orders:\n• Special discounts available\n• Custom packaging options\n• Flexible delivery schedule\n\nPlease contact us at least 5-7 days in advance for bulk orders. WhatsApp or call us for a quote!"
      );
    }

    // Availability/Stock
    if (message.match(/\b(available|in stock|do you have|can i get)\b/)) {
      return createBotMessage(
        "Most of our menu items are available daily! 🎂\n\nFor same-day orders:\n• Check our Menu page\n• Call or WhatsApp to confirm availability\n\nFor custom designs, we can make anything - just give us 2-3 days notice!"
      );
    }

    // Preservatives/Fresh
    if (message.match(/\b(preservative|fresh|natural|additive|chemical|artificial)\b/)) {
      return createBotMessage(
        "All our products are:\n✅ 100% fresh, baked daily\n✅ No artificial preservatives\n✅ Made with natural ingredients\n✅ No artificial colors or flavors\n\nWe believe in quality and freshness! 🌿"
      );
    }

    // Shelf life/Storage
    if (message.match(/\b(shelf life|how long|expire|store|storage|keep|last)\b/)) {
      return createBotMessage(
        "Product freshness:\n\n🎂 Cakes: 2-3 days (refrigerated)\n🍪 Cookies: 7-10 days (airtight container)\n🧁 Cupcakes: 2-3 days (refrigerated)\n\nStore in fridge for best freshness. Consume within recommended time for best taste!"
      );
    }

    // Flavors available
    if (message.match(/\b(flavor|flavour|taste|variety|type)\b/)) {
      return createBotMessage(
        "Our flavors:\n\n🎂 Cakes: Vanilla, Chocolate, Strawberry, Butterscotch\n🍪 Cookies: Peanut Butter, Chocolate, Almond, Butter Cream\n🧁 Cupcakes: Chocolate, Cheesecake, Banana\n\nWe can also create custom flavors! Just ask!"
      );
    }

    // Gift wrapping/Packaging
    if (message.match(/\b(gift|wrap|package|packaging|box|present)\b/)) {
      return createBotMessage(
        "We offer beautiful packaging! 🎁\n\n• Standard packaging included\n• Premium gift boxes available\n• Custom messages/cards\n• Festive/themed packaging\n\nMention your packaging preference when ordering!"
      );
    }

    // Menu-related
    if (message.match(/\b(menu|what do you have|items|products|sell|available)\b/)) {
      return createBotMessage(
        "We have a delicious selection of:\n🍰 Cakes (Vanilla, Chocolate, Strawberry, Butterscotch)\n🍪 Cookies (Peanut Butter, Chocolate, Almond)\n🧁 Cupcakes & Muffins\n\nCheck out our Menu page for the full list with prices!"
      );
    }

    // Specific product - Cakes
    if (message.match(/\b(cake|cakes|birthday cake|celebration cake)\b/)) {
      return createBotMessage(
        "Our cakes are 100% eggless and customizable! 🎂\n\nWe offer:\n• Vanilla Cake - ₹450\n• Chocolate Cake - ₹500\n• Strawberry Cake - ₹550\n• Butterscotch Cake - ₹550\n\nWant to customize one? Use our Custom Order page!"
      );
    }

    // Specific product - Cookies
    if (message.match(/\b(cookie|cookies|biscuit)\b/)) {
      return createBotMessage(
        "Our cookies come in 250g boxes at ₹200 each! 🍪\n\nFlavors:\n• Peanut Butter\n• Chocolate Chip\n• Almond\n• Butter Cream\n\nAll freshly baked and eggless!"
      );
    }

    // Specific product - Cupcakes
    if (message.match(/\b(cupcake|cupcakes|muffin|muffins)\b/)) {
      return createBotMessage(
        "Our cupcakes & muffins are sold in packs of 4+ pieces! 🧁\n\n• Chocolate Cupcakes - ₹40/piece\n• Cheesecake Cupcakes - ₹55/piece\n• Whole Wheat Banana Muffins - ₹35/piece\n\nMinimum order: 4 pieces"
      );
    }

    // Pricing
    if (message.match(/\b(price|cost|how much|expensive|cheap|afford)\b/)) {
      return createBotMessage(
        "Here's our pricing overview:\n💰 Cakes: ₹450-₹550\n💰 Cookies: ₹200/box (250g)\n💰 Cupcakes: ₹35-₹55/piece\n\nCustom designs may have additional charges. Want details on a specific item?"
      );
    }

    // Ordering
    if (message.match(/\b(order|buy|purchase|get|want to order|place order)\b/)) {
      return createBotMessage(
        "Easy! You can order in two ways:\n\n1️⃣ Add items to cart and checkout on our website\n2️⃣ Contact us on WhatsApp for quick orders\n\nFor custom designs, use our Custom Order page. Need help placing an order?"
      );
    }

    // Custom orders
    if (message.match(/\b(custom|customize|design|personalized|special|theme)\b/)) {
      return createBotMessage(
        "We LOVE custom orders! 🎨✨\n\nYou can:\n• Choose your flavors\n• Share design ideas\n• Upload reference images\n• Add personalized messages\n\n⏰ Place custom orders 2-3 days in advance\n\nVisit our Custom Order page or WhatsApp us!"
      );
    }

    // Delivery
    if (message.match(/\b(deliver|delivery|shipping|ship)\b/)) {
      return createBotMessage(
        "Delivery info:\n🚚 Free delivery on orders over ₹1000\n⏱️ Ready items: 2-4 hours\n⏱️ Custom orders: 24-48 hours\n📍 We deliver within the city\n\nDelivery charges apply for orders under ₹1000."
      );
    }

    // Payment
    if (message.match(/\b(payment|pay|online|card|upi)\b/)) {
      return createBotMessage(
        "We accept:\n💵 Cash on Delivery (COD)\n💳 Online Payment\n📱 UPI\n\nChoose your preferred method at checkout!"
      );
    }

    // Ingredients / Dietary
    if (message.match(/\b(eggless|vegetarian|vegan|allergen|allergy|ingredient|gluten)\b/)) {
      return createBotMessage(
        "All our products are 100% EGGLESS! 🥚❌\n\nWe also offer:\n✅ Allergen-friendly options\n✅ Custom dietary requirements\n\nLet us know your needs and we'll accommodate!"
      );
    }

    // Contact
    if (message.match(/\b(contact|call|phone|email|reach|talk|speak|address|location)\b/)) {
      return createBotMessage(
        "📞 You can reach us via:\n• Phone: [Your number]\n• Email: [Your email]\n• WhatsApp: [Your WhatsApp]\n\nOr visit our Contact page for more details!"
      );
    }

    // Hours
    if (message.match(/\b(hours|open|close|timing|time|when open)\b/)) {
      return createBotMessage(
        "🕐 We're open:\nMonday - Saturday: 9 AM - 8 PM\nSunday: 10 AM - 6 PM\n\nOnline orders accepted 24/7!"
      );
    }

    // Thanks
    if (message.match(/\b(thank|thanks|appreciate)\b/)) {
      const thanks = [
        "You're very welcome! 😊",
        "Happy to help! Anything else?",
        "My pleasure! Let me know if you need anything else!",
        "Anytime! 🎂"
      ];
      return createBotMessage(thanks[Math.floor(Math.random() * thanks.length)]);
    }

    // Goodbye
    if (message.match(/\b(bye|goodbye|see you|later|thanks bye)\b/)) {
      const goodbyes = [
        "Goodbye! Come back soon! 🍰",
        "See you! Happy baking! 👋",
        "Take care! Enjoy your treats! 😊",
        "Bye! Don't forget to visit our menu!"
      ];
      return createBotMessage(goodbyes[Math.floor(Math.random() * goodbyes.length)]);
    }

    // Default fallback
    const fallbacks = [
      "I'm not sure I understand. Could you ask about our menu, prices, delivery, or custom orders?",
      "Hmm, I didn't catch that. Try asking about cakes, cookies, cupcakes, or how to place an order!",
      "I'm here to help with menu items, pricing, delivery, and custom orders. What would you like to know?",
      "Sorry, I'm still learning! You can ask me about products, orders, delivery, or contact info!"
    ];
    return createBotMessage(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
  };

  const createBotMessage = (text) => ({
    text,
    sender: 'bot',
    timestamp: new Date()
  });

  return (
    <>
      {/* Chatbot Button */}
      <div className={`chatbot-button ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="chatbot-icon">🤖</span>
        <span className="chatbot-notification"></span>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Warm Delights Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
