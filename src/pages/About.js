import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { OPERATING_HOURS } from '../utils/constants';

const About = () => {
  const { trackEvent } = useAnalytics();

  React.useEffect(() => {
    trackEvent({ eventType: 'page_view', page: '/about' });
  }, [trackEvent]);

  return (
    <Container className="about-page py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary">Our Story</h1>
            <p className="lead">From a lockdown hobby to a beloved local bakery</p>
          </div>

          <Card className="mb-5">
            <Card.Body className="p-5">
              <div className="story-content">
                <p className="fs-5">
                  It all began during the COVID-19 lockdown, when online courses were becoming a trend. 
                  Out of curiosity, I signed up for a cupcake-making workshop, not realizing that it would 
                  be the starting point of my entrepreneurial journey.
                </p>
                
                <p className="fs-5">
                  My first batch of cupcakes didn't turn out well, and I felt disheartened. But thanks to 
                  my mom—my biggest supporter—I didn't give up. With her encouragement, I tried again, and 
                  this time I succeeded.
                </p>
                
                <p className="fs-5">
                  Soon after, I baked my first perfect cake for a friend's birthday. It was the first time 
                  my creation was going to be shared beyond my home, and to my delight, the feedback was 
                  overwhelmingly positive. That moment became the spark that motivated me to start my own 
                  home bakery in 2022.
                </p>
                
                <p className="fs-5">
                  Now, as we approach our third anniversary this September, I look back on a journey full of 
                  challenges, lessons, and growth. It hasn't always been easy, but it has taught me resilience 
                  and the importance of never giving up. Through it all, my mom has been my backbone—her 
                  constant support and belief in me continue to inspire everything I do.
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Our Values */}
          <Row className="mb-5">
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center value-card">
                <Card.Body>
                  <div className="value-icon mb-3">
                    <i className="fas fa-heart text-primary fa-2x"></i>
                  </div>
                  <Card.Title>Made with Love</Card.Title>
                  <Card.Text>
                    Every treat is crafted with care and passion, ensuring the highest quality and taste.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center value-card">
                <Card.Body>
                  <div className="value-icon mb-3">
                    <i className="fas fa-leaf text-success fa-2x"></i>
                  </div>
                  <Card.Title>100% Eggless</Card.Title>
                  <Card.Text>
                    All our products are completely egg-free, making them accessible to more people.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center value-card">
                <Card.Body>
                  <div className="value-icon mb-3">
                    <i className="fas fa-star text-warning fa-2x"></i>
                  </div>
                  <Card.Title>Customizable</Card.Title>
                  <Card.Text>
                    We tailor our treats to your preferences, dietary needs, and special occasions.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Operating Hours */}
          <Card className="operating-hours-card">
            <Card.Body className="text-center">
              <h3 className="mb-3">Operating Hours</h3>
              <p className="fs-4 text-primary mb-2">{OPERATING_HOURS.start} to {OPERATING_HOURS.end}</p>
              <p className="text-muted">{OPERATING_HOURS.days}</p>
              <p className="text-muted mt-3">
                We accept orders throughout our operating hours. For custom orders, 
                we recommend placing your order at least 2-3 days in advance.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;