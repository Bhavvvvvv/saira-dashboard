import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface HeroProps {
  title: string;
  subtitle: string;
}

const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
}) => {
  return (
    <div className="bg-light py-5 mb-5">
      <Container>
        <Row className="py-4">
          <Col md={8} className="mx-auto text-left">
            <h1 className="display-4">{title}</h1>
            <p className="lead mb-4">{subtitle}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero; 