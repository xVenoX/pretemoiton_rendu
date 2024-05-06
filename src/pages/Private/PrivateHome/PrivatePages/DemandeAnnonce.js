import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DemandeAnnonce = ({ show, handleClose, handleSubmit, email, setEmail, phone, setPhone, date, setDate,description,setDescription,heure,setHeure }) => {


 // Gestion des changements pour la description et l'heure
 const handleDescriptionChange = (e) => setDescription(e.target.value);
 const handleHeureChange = (e) => setHeure(e.target.value);

 // Dans DemandeAnnonce
 const handleEmailChange = (e) => setEmail(e.target.value);
 const handlePhoneChange = (e) => setPhone(e.target.value);
 const handleDateChange = (e) => setDate(e.target.value);
 
 return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Demande d'information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Entrer votre email" value={email} onChange={handleEmailChange} />
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Label>Numéro de téléphone</Form.Label>
            <Form.Control type="tel" placeholder="Entrer votre numéro de téléphone" value={phone} onChange={handlePhoneChange} />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Date de disponibilité</Form.Label>
            <Form.Control type="date" value={date} onChange={handleDateChange} />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description (100 caractères max)</Form.Label>
            <Form.Control type="text" placeholder="Entrer une description" value={description} onChange={handleDescriptionChange} maxLength={100} />
          </Form.Group>
          <Form.Group controlId="heure">
            <Form.Label>Heure</Form.Label>
            <Form.Control type="time" value={heure} onChange={handleHeureChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="primary" onClick={() => handleSubmit(email, phone, date, description, heure)}>
          Envoyer
        </Button>
      </Modal.Footer>
    </Modal>
 );
};

export default DemandeAnnonce;
