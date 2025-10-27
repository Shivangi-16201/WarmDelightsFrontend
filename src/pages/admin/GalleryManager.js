import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { 
  getGalleryImages, 
  uploadGalleryImage, 
  deleteGalleryImage 
} from '../../utils/api';
import './GalleryManager.css';

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState({
    title: '',
    description: '',
    category: 'cakes'
  });
  const { trackEvent } = useAnalytics();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Load images from backend
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const galleryImages = await getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error('Error loading images:', error);
      alert('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    if (!imageData.title.trim()) {
      alert('Please enter a title for the image');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', imageData.title);
      formData.append('description', imageData.description);
      formData.append('category', imageData.category);

      const newImage = await uploadGalleryImage(formData);
      
      setImages(prev => [newImage, ...prev]);
      trackEvent('image_upload', { 
        title: imageData.title,
        category: imageData.category 
      });

      // Reset form
      setPreviewUrl('');
      setSelectedFile(null);
      setImageData({
        title: '',
        description: '',
        category: 'cakes'
      });
      document.getElementById('file-input').value = '';

      alert('Image uploaded successfully!');

    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        setImages(prev => prev.filter(img => img._id !== id));
        alert('Image deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete image. Please try again.');
      }
    }
  };

  const categories = ['Cakes', 'Cookies', 'Cupcakes', 'Custom', 'Events'];

  if (loading) {
    return (
      <div className="gallery-manager">
        <div className="loading">Loading gallery images...</div>
      </div>
    );
  }

  return (
    <div className="gallery-manager">
      <div className="gallery-header">
        <h1>Gallery Management</h1>
        <p>Upload and manage your product images</p>
      </div>

      <div className="gallery-content">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>Upload New Image</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Image *</label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required
                />
                <span className="file-help">Max 5MB, JPG/PNG/WebP</span>
              </div>

              {previewUrl && (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={imageData.title}
                  onChange={(e) => setImageData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Chocolate Birthday Cake"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={imageData.category}
                  onChange={(e) => setImageData(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={imageData.description}
                onChange={(e) => setImageData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the image, ingredients, or special features..."
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className="upload-btn"
              disabled={uploading || !selectedFile}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery Images */}
        <div className="images-section">
          <h2>Gallery Images ({images.length})</h2>
          
          {images.length === 0 ? (
            <div className="empty-gallery">
              <p>No images uploaded yet. Upload your first image above!</p>
            </div>
          ) : (
            <div className="images-grid">
              {images.map(image => (
                <div key={image._id} className="gallery-item">
                  <img 
                    src={`http://localhost:5000${image.imageUrl}`} 
                    alt={image.title}
                    onError={(e) => {
                      // Use a simple data URI or existing image instead
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThkNWI1IiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM3YjNmMDAiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                  <div className="image-info">
                    <h4>{image.title}</h4>
                    <p className="image-category">{image.category}</p>
                    <p className="image-description">{image.description}</p>
                    <div className="image-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(image._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;