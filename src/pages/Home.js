import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../contexts/AnalyticsContext';

const Home = () => {
  const { trackEvent } = useAnalytics();

  React.useEffect(() => {
    trackEvent({ eventType: 'page_view', page: '/' });
  }, [trackEvent]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col md={6}>
              <h1 className="hero-title">Warm Delights</h1>
              <p className="hero-subtitle">Delicious, homemade baked goods made with love</p>
              <Button 
                as={Link} 
                to="/menu" 
                variant="primary" 
                size="lg" 
                className="mt-3"
                onClick={() => trackEvent({ eventType: 'click', element: 'hero_cta' })}
              >
                Explore Our Menu
              </Button>
            </Col>
            <Col md={6}>
              <div className="hero-image">
                
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="featured-section py-5">
        <Container>
          <h2 className="text-center mb-5">Our Specialties</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 product-card">
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>Cakes</Card.Title>
                  <Card.Text>
                    Delicious, moist cakes perfect for any occasion. Custom designs available.
                  </Card.Text>
                  <Button 
                    as={Link} 
                    to="/menu#cakes" 
                    variant="outline-primary"
                    onClick={() => trackEvent({ eventType: 'click', element: 'cakes_cta' })}
                  >
                    View Cakes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 product-card">
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>Cookies</Card.Title>
                  <Card.Text>
                    Freshly baked cookies with a minimum order of 1 box (250g).
                  </Card.Text>
                  <Button 
                    as={Link} 
                    to="/menu#cookies" 
                    variant="outline-primary"
                    onClick={() => trackEvent({ eventType: 'click', element: 'cookies_cta' })}
                  >
                    View Cookies
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 product-card">
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>Cupcakes & Muffins</Card.Title>
                  <Card.Text>
                    Minimum order of 4 pieces for our delicious cupcakes and muffins.
                  </Card.Text>
                  <Button 
                    as={Link} 
                    to="/menu#cupcakes" 
                    variant="outline-primary"
                    onClick={() => trackEvent({ eventType: 'click', element: 'cupcakes_cta' })}
                  >
                    View Cupcakes
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Custom Orders CTA */}
      <section className="cta-section py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h2>Customize Your Treats</h2>
              <p>
                We're happy to bring your vision to life! Share a reference picture along with your 
                preferences for size, flavour, and design.
              </p>
            </Col>
            <Col md={4} className="text-md-right">
              <Button 
                as={Link} 
                to="/custom-order" 
                variant="primary" 
                size="lg"
                onClick={() => trackEvent({ eventType: 'click', element: 'custom_order_cta' })}
              >
                Order Custom Treat
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Brand Story */}
      <section className="brand-story py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <h2 className="text-center mb-4">Our Story</h2>
              <div className="story-content">
                <p>
                  It all began during the COVID-19 lockdown, when online courses were becoming a trend. 
                  Out of curiosity, I signed up for a cupcake-making workshop, not realizing that it would 
                  be the starting point of my entrepreneurial journey.
                </p>
                <p>
                  My first batch of cupcakes didn't turn out well, and I felt disheartened. But thanks to 
                  my mom—my biggest supporter—I didn't give up. With her encouragement, I tried again, and 
                  this time I succeeded.
                </p>
                <p>
                  Soon after, I baked my first perfect cake for a friend's birthday. It was the first time 
                  my creation was going to be shared beyond my home, and to my delight, the feedback was 
                  overwhelmingly positive. That moment became the spark that motivated me to start my own 
                  home bakery in 2022.
                </p>
                <p>
                  Now, as we approach our third anniversary, I look back on a journey full of challenges, 
                  lessons, and growth. It hasn't always been easy, but it has taught me resilience and the 
                  importance of never giving up.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;