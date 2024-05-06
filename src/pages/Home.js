import React, { useContext } from 'react';
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

export default function Home() {
 const { currentUser } = useContext(UserContext);

 return (
    <div className="container-fluid p-5 bg-dark text-center">
      <Alert variant="info" dismissible onClose={() => {}} className="mt-3">
        <Alert.Heading>Important!</Alert.Heading>
        <p>
          N'oubliez pas de vous inscrire ou de vous connecter pour accéder aux fonctionnalités de notre plateforme.
        </p>
      </Alert>
      <h1 className="display-3 text-light mb-5">
        Bienvenue sur Prêtemoiton...
      </h1>
      {currentUser ? (
        <div className="mt-5">
          <h2 className="display-4 text-light">
            Oh, tu es de retour. Bienvenue, mon ami !
          </h2>
          <Link to="/private/private-home" className="btn btn-primary btn-lg mt-3">
            C'est reparti !
          </Link>
        </div>
      ) : (
        <Container>
          <Row className="justify-content-center mt-5">
            <Col md={8}>
              <div className="jumbotron text-light">
                <h1 className="display-4">Bienvenue sur notre plateforme d'échange</h1>
                <p className="lead">Partagez vos compétences et votre matériel avec la communauté.</p>
                <hr className="my-4" />
                <p>Découvrez les annonces récentes ou publiez la vôtre dès maintenant.</p>
                <Button variant="primary" href="#services">Voir les services</Button>
              </div>
            </Col>
          </Row>
          <Row id="services" className="justify-content-center mt-5">
            <Col>
              <h2 className="text-light">Nos Services</h2>
              <Row className="mt-4">
                <Col md={4}>
                 <div className="p-3 bg-secondary text-light rounded">
                    <h3>Échange de Compétences</h3>
                    <p>
                      Mettez vos compétences à profit en les partageant avec d'autres membres de la communauté.
                    </p>
                 </div>
                </Col>
                <Col md={4}>
                 <div className="p-3 bg-secondary text-light rounded">
                    <h3>Prêt de Matériel</h3>
                    <p>
                      Besoin d'un outil ou d'un équipement spécifique ? Empruntez-le à un autre membre près de chez vous.
                    </p>
                 </div>
                </Col>
                <Col md={4}>
                 <div className="p-3 bg-secondary text-light rounded">
                    <h3>Publication d'Annonces</h3>
                    <p>
                      Publiez vos besoins ou ce que vous avez à offrir, et trouvez des correspondances sur la carte interactive.
                    </p>
                 </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="justify-content-center mt-5 text-light">
            <Col>
              <h2>À propos de notre plateforme</h2>
              <p>
                Notre plateforme a pour objectif de faciliter les échanges entre les membres de la communauté. Que vous ayez des compétences à partager ou que vous cherchiez à emprunter du matériel, notre site vous permet de trouver rapidement ce dont vous avez besoin.
              </p>
              <p>
                Nous croyons en la force de la communauté et en la solidarité entre ses membres. En utilisant notre plateforme, vous contribuez à créer un réseau d'entraide et de partage.
              </p>
              <p>
                Rejoignez-nous dès aujourd'hui et faites partie d'une communauté engagée à aider les uns les autres.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mt-5 text-light">
            <Col>
              <h2>Inscrivez-vous ou connectez-vous</h2>
              <p>
                Pour accéder aux différentes fonctionnalités, veuillez vous inscrire ou vous connecter.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mt-5 text-light">
            <Col>
              <h2>Contactez-nous</h2>
              <p>
                Pour toute demande ou question, n'hésitez pas à nous contacter:
              </p>
              <p>
               pierrickselas@gmail.com  
               <br></br>  
               06 12 34 56 78        
              </p>
            </Col>
          </Row>
        </Container>
      )}
    </div>
 );
}
