import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState(() => {
    // Load from localStorage or initialize
    const saved = localStorage.getItem('warmDelightsAnalytics');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      totalVisitors: 0,
      todayVisitors: 0,
      cartAdditions: 0,
      whatsappOrders: 0,
      chatbotChats: 0,
      galleryViews: 0,
      imagesUploaded: 0,
      pageViews: {},
      lastReset: new Date().toDateString()
    };
  });

  // Reset daily visitors at midnight
  useEffect(() => {
    const checkReset = () => {
      const today = new Date().toDateString();
      if (analytics.lastReset !== today) {
        setAnalytics(prev => ({
          ...prev,
          todayVisitors: 0,
          lastReset: today
        }));
      }
    };

    checkReset();
    const interval = setInterval(checkReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [analytics.lastReset]);

  // Save to localStorage whenever analytics change
  useEffect(() => {
    localStorage.setItem('warmDelightsAnalytics', JSON.stringify(analytics));
  }, [analytics]);

  const trackEvent = useCallback((eventType, data = {}) => {
    setAnalytics(prev => {
      const newStats = { ...prev };
      const today = new Date().toDateString();
      
      // Reset today's visitors if it's a new day
      if (newStats.lastReset !== today) {
        newStats.todayVisitors = 0;
        newStats.lastReset = today;
      }

      switch (eventType) {
        case 'page_view':
          newStats.totalVisitors += 1;
          newStats.todayVisitors += 1;
          newStats.pageViews[data.page] = (newStats.pageViews[data.page] || 0) + 1;
          break;
        
        case 'cart_add':
          newStats.cartAdditions += 1;
          break;
        
        case 'whatsapp_order':
          newStats.whatsappOrders += 1;
          break;
        
        case 'chatbot_chat':
          newStats.chatbotChats += 1;
          break;
        
        case 'gallery_view':
          newStats.galleryViews += 1;
          break;
        
        case 'image_upload':
          newStats.imagesUploaded += 1;
          break;
        
        case 'admin_dashboard_visited':
          // Special admin event - no counter needed
          break;
        
        default:
          console.log('Unknown event type:', eventType);
      }

      return newStats;
    });

    // Log to console for debugging
    console.log('Tracked event:', eventType, data);
  }, []); // Empty dependency array - trackEvent never changes

  const resetAnalytics = useCallback(() => {
    setAnalytics({
      totalVisitors: 0,
      todayVisitors: 0,
      cartAdditions: 0,
      whatsappOrders: 0,
      chatbotChats: 0,
      galleryViews: 0,
      imagesUploaded: 0,
      pageViews: {},
      lastReset: new Date().toDateString()
    });
  }, []);

  const value = {
    analytics,
    trackEvent,
    resetAnalytics
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
