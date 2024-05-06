import React, { useState } from 'react';
import { Button, Form ,Container, Row, Col, Alert } from 'react-bootstrap';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { auth, db, storage } from '../../../../firebase'; // Assurez-vous que le chemin d'importation est correct

const PublishAd = () => {
 const [adData, setAdData] = useState({
    photo: null,
    type: '',
    location: '',
    description: '',
 });

 const [charCount, setCharCount] = useState(100);
 const [errorMessage, setErrorMessage] = useState('');


 const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData({ ...adData, [name]: value });
 };

 const handlePhotoChange = (e) => {
    setAdData({ ...adData, photo: e.target.files[0] });
 };

 const handleDescriptionChange = (e) => {
  const { name, value } = e.target;
  const newCharCount = 100 - value.length;
  setAdData({ ...adData, [name]: value });
  setCharCount(newCharCount);
};

 const handleSubmit = async (e) => {
  e.preventDefault();
 
  if (!adData.type || !adData.location || !adData.description || adData.description.length > 100) {
    alert('Veuillez remplir tous les champs requis et assurez-vous que la description ne dépasse pas 100 caractères.');
    return;
  }
 
  try {
     if (adData.photo && adData.photo.name) {
       const storageRef = ref(storage, 'ads/' + adData.photo.name);
       const snapshot = await uploadBytes(storageRef, adData.photo);
 
       const photoURL = await getDownloadURL(snapshot.ref);
 
       const adDataToFirestore = {
         ...adData,
         userId: getAuth().currentUser.uid, // Obtenez l'UID de l'utilisateur actuellement connecté
         photoUrl: photoURL, // Utilisez l'URL de l'image obtenue
       };
 
       delete adDataToFirestore.photo;
 
       const adRef = collection(db, 'ads');
       await addDoc(adRef, adDataToFirestore);
     } else {
       const adDataToFirestore = {
         ...adData,
         userId: getAuth().currentUser.uid, // Obtenez l'UID de l'utilisateur actuellement connecté
       };
 
       const adRef = collection(db, 'ads');
       await addDoc(adRef, adDataToFirestore);
     }
 
     alert('Annonce publiée avec succès !');
     window.location.reload();
  } catch (error) {
     console.error('Erreur lors de la publication de l\'annonce :', error);
     alert('Une erreur est survenue lors de la publication de l\'annonce.');
  }
 };
 

 return (
  <Container className="mt-4">
      <Row className="justify-content-center text-light">
        <Col md={8}>
          <h2 className="text-center mb-4">Publier une annonce</h2>
          {errorMessage && <Alert variant="danger" className="mb-3">{errorMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="photo" className="mb-3">
              <Form.Label>Photo</Form.Label>
              <Form.Control type="file" onChange={handlePhotoChange} />
            </Form.Group>
            <Form.Group controlId="type" className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Check type="radio" label="Prête moi ton matériel" name="type" value="material" onChange={handleChange} />
              <Form.Check type="radio" label="Prête moi ton savoir" name="type" value="knowledge" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="location" className="mb-3">
              <Form.Label>Lieu</Form.Label>
              <Form.Control type="text" name="location" value={adData.location} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={adData.description} onChange={handleDescriptionChange} />
              <p>{charCount} caractères restants</p>
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
              Publier
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
 );
};

export default PublishAd;