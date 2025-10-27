import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch gallery items from your backend
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response Data:', data); // Debug log
        setGalleryItems(data);
      } catch (error) {
        console.error('Error loading gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, [API_URL]);

  // Filter items based on selected category
  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const handleImageError = (itemId, imageUrl) => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // Function to get image source URL
  const getImageSource = (item) => {
    if (imageErrors[item._id]) {
      return 'https://via.placeholder.com/400x300/ffd1dc/000000?text=Image+Not+Found';
    }

    if (item.imagePath) {
      return `${API_URL}${item.imagePath}`;
    }
    if (item.image) {
      return `${API_URL}${item.image}`;
    }
    if (item.filename) {
      return `${API_URL}/uploads/${item.filename}`;
    }
    if (item.imageUrl) {
      return item.imageUrl;
    }
    return 'https://via.placeholder.com/400x300/ffd1dc/000000?text=Cake+Image';
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1>Our Gallery</h1>
        <p>Browse through our delicious creations and get inspired for your next celebration</p>
      </header>
      
      <div className="gallery-grid">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-cake"></i>
            <h3>No Cakes Available</h3>
            <p>There are no cakes in this category yet. Please check back later!</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item._id} className="gallery-item">
              <div className="gallery-image-container">
                <img 
                  src={getImageSource(item)}
                  alt={item.title} 
                  className="gallery-image" 
                  onError={() => handleImageError(item._id, getImageSource(item))}
                  loading="lazy"
                />
              </div>
              
              <div className="gallery-info">
                <h3 className="gallery-title">{item.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;