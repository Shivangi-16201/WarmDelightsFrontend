import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { CONTACT_INFO, OPERATING_HOURS } from '../utils/constants';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackEvent } = useAnalytics();

  React.useEffect(() => {
    trackEvent({ eventType: 'page_view', page: '/contact' });
  }, [trackEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setShowAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      
      trackEvent({ 
        eventType: 'contact_form', 
        metadata: { ...formData } 
      });
    }, 1000);
  };

  return (
    <Container className="contact-page py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary">Get in Touch</h1>
            <p className="lead">We'd love to hear from you! Reach out with any questions or special requests.</p>
          </div>

          {showAlert && (
            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className="mb-4">
              Thank you for your message! We'll get back to you as soon as possible.
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Card className="contact-form-card">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Send us a Message</h4>
                  <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="contact-name">Name *</Form.Label>
                        <Form.Control
                          type="text"
                          id="contact-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          autoComplete="name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="contact-email">Email *</Form.Label>
                        <Form.Control
                          type="email"
                          id="contact-email"
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
                    <Form.Label htmlFor="contact-subject">Subject *</Form.Label>
                    <Form.Control
                      type="text"
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                      autoComplete="off"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label htmlFor="contact-message">Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help you..."
                      autoComplete="off"
                    />
                  </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="contact-info-card h-100">
                <Card.Body className="p-4">
                  <h4 className="mb-4">Contact Information</h4>
                  
                  <div className="contact-item mb-4">
                    <div className="contact-icon text-primary mb-2 d-flex align-items-center gap-2">
                      <i className="fas fa-phone fa-md"></i>
                      <h5>Phone</h5>
                    </div>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-decoration-none">
                      {CONTACT_INFO.phone}
                    </a>
                  </div>

                  <div className="contact-item mb-4">
                    <div className="contact-icon text-success mb-2 d-flex align-items-center gap-2">
                      <i className="fab fa-whatsapp fa-lg"></i>
                      <h5>WhatsApp</h5>
                    </div>
                    <a 
                      href={`https://wa.me/91${CONTACT_INFO.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {CONTACT_INFO.whatsapp}
                    </a>
                  </div>

                  <div className="contact-item mb-4">
                    <div className="contact-icon text-danger mb-2 d-flex align-items-center gap-2">
                      <i className="fas fa-envelope fa-lg"></i>
                      <h5>Email</h5>
                    </div>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-decoration-none">
                      {CONTACT_INFO.email}
                    </a>
                  </div>

                  <div className="contact-item mb-4">
                    <div className="contact-icon text-info mb-2 d-flex align-items-center gap-2">
                      <i className="fab fa-instagram fa-lg"></i>
                      <h5>Instagram</h5>
                    </div>
                    <a 
                      href={`https://instagram.com/${CONTACT_INFO.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      @{CONTACT_INFO.instagram}
                    </a>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon text-warning mb-2 d-flex align-items-center gap-2">
                      <i className="fas fa-clock fa-lg"></i>
                      <h5>Operating Hours</h5>
                    </div>
                    <p className="mb-1">{OPERATING_HOURS.start} - {OPERATING_HOURS.end}</p>
                    <small className="text-muted">{OPERATING_HOURS.days}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Delivery Information */}
          <Card className="mt-5">
            <Card.Body className="p-4 delivery-info">
              <h4 className="mb-3">Delivery Information</h4>
              <div>
                <h6>Delivery Areas</h6>
                <p>We offer delivery across the Tricity (Chandigarh, Mohali, Panchkula) through multiple parcel options.</p>
              </div>
              <div>
                <h6>Delivery Charges</h6>
                <p>Delivery charges may vary depending on the mode of delivery and your address.</p>
              </div>
              <div>
                <h6>Same-Day Delivery</h6>
                <p>Available under certain conditions. Contact us for availability.</p>
              </div>
              <div className="mt-3">
                <strong>Recommendation:</strong> For a hassle-free experience, we recommend placing your order 
                at least 2–3 days in advance.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;