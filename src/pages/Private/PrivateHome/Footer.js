import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css'; // Assurez-vous d'importer vos styles CSS

const Footer = () => {
  return (
    <footer className="footer mt-auto py-5 bg-dark text-white">
      
      <Container>
        <Row>
          <Col md={6}>
            <h5>À propos de nous</h5>
            <p>Nous sommes une plateforme innovante qui connecte les gens autour de partages et d'échanges.</p>
          </Col>
          <Col md={6}>
            <h5>Contactez-nous</h5>
            <p>Email: pierrick.selas@example.com</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <p className="text-center">© 2024 SELAS. Tous droits réservés.</p>
          </Col>
        </Row>
      </Container>

    </footer>
  );
};

export default Footer;