import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Contact form submitted:', { email, message });
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div id="contact" className="py-5" style={{ backgroundColor: '#0a2e52', color: 'white' }}>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10} className="px-4">
            <h2 className="text-center mb-5">Contact Us</h2>
            <Row>
              <Col lg={5} className="mb-4 mb-lg-0">
                <div className="p-4 h-100 d-flex flex-column">
                  <h3 className="mb-4">Get in Touch</h3>
                  <p className="lead">Have questions about Saira or need help?</p>
                  <p>Our team is ready to assist you with any questions or issues you might have regarding our lead management system.</p>
                  <div className="mt-4 mb-4">
                    <p><strong>Email:</strong> vaibhav.arora@voltmoney.in</p>
                    <p><strong>Phone:</strong>+91-9818794003</p>
                    <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                  </div>
                  <div className="mt-auto">
                    <Button 
                      variant="outline-light" 
                      href="mailto:vaibhav.arora@voltmoney.in" 
                      className="mt-3 px-4 py-2"
                      size="lg"
                    >
                      Email Us Directly
                    </Button>
                  </div>
                </div>
              </Col>
              <Col lg={7}>
                <Card className="border-0 shadow">
                  <Card.Body className="p-4 p-lg-5">
                    {submitted ? (
                      <div className="text-center p-4">
                        <div className="mb-4">
                          <span className="text-success display-4">✓</span>
                        </div>
                        <h4 className="text-success mb-3">Message Sent!</h4>
                        <p className="text-dark">Thank you for contacting us. We'll get back to you shortly.</p>
                      </div>
                    ) : (
                      <>
                        <h3 className="card-title mb-4 text-dark">Send Us a Message</h3>
                        <Form onSubmit={handleSubmit}>
                          <Form.Group className="mb-4">
                            <Form.Label className="text-dark">Email address</Form.Label>
                            <Form.Control 
                              type="email" 
                              placeholder="Enter your email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="p-3"
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-4">
                            <Form.Label className="text-dark">Message</Form.Label>
                            <Form.Control 
                              as="textarea" 
                              rows={6} 
                              placeholder="Your message"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="p-3"
                              required
                            />
                          </Form.Group>
                          <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 py-3"
                            style={{ backgroundColor: '#0a2e52', borderColor: '#0a2e52' }}
                            onClick={() => {
                              const mailtoLink = `mailto:bhavna.haritsa@voltmoney.in?subject=Contact Form Submission&body=${encodeURIComponent(message)}`;
                              window.location.href = mailtoLink;
                            }}
                          >
                            Send Message
                          </Button>
                        </Form>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact; 