import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface FeatureCardProps {
  title: string;
  description: string;
  imgSrc: string;
  buttonText: string;
  buttonLink: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  imgSrc,
  buttonText,
  buttonLink
}) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imgSrc} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="outline-primary" href={buttonLink}>
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FeatureCard; 