import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { createCustomOrder } from '../utils/api';
import { useAnalytics } from '../contexts/AnalyticsContext';
import './CustomOrder.css';

const CustomOrder = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    size: '',
    flavor: '',
    designNotes: '',
    referenceImage: null
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { trackEvent } = useAnalytics();

  const handleChange = (e) => {
    if (e.target.name === 'referenceImage') {
      setFormData({ ...formData, referenceImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'referenceImage' && formData[key]) {
          formDataToSend.append('referenceImage', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });


      
      await createCustomOrder(formDataToSend);
      
      setShowAlert(true);

      const waPhone = "9805189494"; // Replace with your WhatsApp number
      const waMessage = encodeURIComponent(
        `Custom Order Request\nName: ${formData.name}\nPhone: ${formData.phone}\nSize: ${formData.size}\nFlavor: ${formData.flavor}\nNotes: ${formData.designNotes}`
      );
      window.open(`https://wa.me/${waPhone}?text=${waMessage}`, "_blank");

      setFormData({
        name: '',
        email: '',
        phone: '',
        size: '',
        flavor: '',
        designNotes: '',
        referenceImage: null
      });
      
      // Reset file input
      document.getElementById('referenceImage').value = '';
      
      trackEvent({ 
        eventType: 'custom_order', 
        metadata: { formData: { ...formData, referenceImage: 'uploaded' } }
      });
    } catch (err) {
      const message = err.response?.data?.message || 'There was an error submitting your request. Please try again.';
      setError(message);
      console.error('Custom order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="custom-order-page py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Customize Your Treats</h1>
          
          {showAlert && (
            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
              Your custom order request has been submitted successfully! We'll contact you soon.
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}
          
          <Card className="custom-order-card">
            <Card.Body>
              <p className="lead text-center mb-4">
                We're happy to bring your vision to life! Share a reference picture along with your 
                preferences for size, flavour, and design, and we'll create a customised treat made just for you.
              </p>
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        autoComplete="name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        autoComplete="email"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Your phone number"
                    autoComplete="tel"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Size Requirements</Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="e.g., 8-inch round, serves 10-12 people"
                    autoComplete="off"
                  />
                  <Form.Text className="text-muted">
                    Please specify the size or serving quantity you need
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Flavor Preferences</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="flavor"
                    value={formData.flavor}
                    onChange={handleChange}
                    placeholder="e.g., Chocolate cake with vanilla buttercream, strawberry filling"
                    autoComplete="off"
                  />
                  <Form.Text className="text-muted">
                    Describe your preferred flavors and any specific combinations
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Design Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="designNotes"
                    value={formData.designNotes}
                    onChange={handleChange}
                    placeholder="Describe your design ideas, theme, colors, special occasion, etc."
                    autoComplete="off"
                  />
                  <Form.Text className="text-muted">
                    The more details you provide, better we can bring your vision to life
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Reference Image (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    id="referenceImage"
                    name="referenceImage"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Upload a picture that illustrates what you have in mind (max 5MB)
                  </Form.Text>
                </Form.Group>
                
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="px-5"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Additional Information */}
          <Card className="mt-4">
            <Card.Body>
              <h5>What happens after you submit?</h5>
              <ol>
                <li>We'll review your request within 24 hours</li>
                <li>We'll contact you to discuss details and provide a quote</li>
                <li>Once approved, we'll create your custom treat</li>
                <li>We'll coordinate delivery or pickup</li>
              </ol>
              
              <div className="mt-3">
                <strong>Note:</strong> For complex custom orders, we recommend placing your request 
                at least 3-5 days in advance to ensure we can accommodate your needs.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomOrder;