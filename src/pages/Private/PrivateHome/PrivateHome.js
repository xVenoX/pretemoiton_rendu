import React from 'react';
import { Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import ProfilePage from './PrivatePages/ProfilePage';
import SearchProducts from './PrivatePages/SearchProducts';
import PublishAd from './PrivatePages/PublishAd';
import Maps from './PrivatePages/Maps';
import Contact from './PrivatePages/Contact';
import Statistiques from './PrivatePages/Statistiques';
import Footer from './Footer'; // Assurez-vous que le chemin d'importation est correct


export default function PrivateHome() {
  return (
    <Container className="p-5">
      <Tab.Container defaultActiveKey="profile">
        <Row>
          <Col sm={0}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profile">Profil</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="search">Rechercher une annonce</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="publish">Publier une annonce</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="map">Carte</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="statistiques">Statistiques</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="contact">Contact</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <ProfilePage />
              </Tab.Pane>
              <Tab.Pane eventKey="search">
                <SearchProducts />
              </Tab.Pane>
              <Tab.Pane eventKey="publish">
                <PublishAd />
              </Tab.Pane>
              <Tab.Pane eventKey="map">
                <Maps />
              </Tab.Pane>
              <Tab.Pane eventKey="statistiques">
                <Statistiques />
              </Tab.Pane>
              <Tab.Pane eventKey="contact">
                <Contact />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <Footer />
    </Container>
  );
}
