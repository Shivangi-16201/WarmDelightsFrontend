import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CONTACT_INFO } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h5>Warm Delights</h5>
            <p>Fresh, delicious, sweet, and tasty baked goods made with love and the finest ingredients.</p>
            <div className="footer-social">
              <a href={`https://wa.me/91${CONTACT_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href={`https://instagram.com/${CONTACT_INFO.instagram}`} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`}>
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/">Home</a></li>
              <li><a href="/menu">Menu</a></li>
              <li><a href="/custom-order">Custom Order</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-4">
            <h5>Contact Info</h5>
            <p>
              <i className="fas fa-phone me-2"></i>
              <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
            </p>
            <p>
              <i className="fab fa-whatsapp me-2"></i>
              <a href={`https://wa.me/91${CONTACT_INFO.whatsapp}`}>{CONTACT_INFO.whatsapp}</a>
            </p>
            <p>
              <i className="fas fa-envelope me-2"></i>
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            </p>
            <p>
              <i className="fas fa-clock me-2"></i>
              Operating Hours: 9AM to 9PM, 7 days a week
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col className="text-center">
            <hr className="my-4" />
            <p>&copy; {new Date().getFullYear()} Warm Delights. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;