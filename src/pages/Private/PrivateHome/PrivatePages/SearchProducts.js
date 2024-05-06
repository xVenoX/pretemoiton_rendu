import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { Card, Button, Nav , Form, FormControl} from 'react-bootstrap';
import DemandeAnnonce from './DemandeAnnonce'; // Assurez-vous que le chemin d'importation est correct
import { getAuth } from 'firebase/auth';

const SearchProducts = () => {
 const [ads, setAds] = useState([]);
 const [key, setKey] = useState('material');
 const [showDemandeAnnonce, setShowDemandeAnnonce] = useState(false);
 const [selectedAdId, setSelectedAdId] = useState(null);
 const [email, setEmail] = useState('');
 const [phone, setPhone] = useState('');
 const [date, setDate] = useState('');
 const [description, setDescription] = useState(''); // Ajout de l'état pour la description
 const [heure, setHeure] = useState(''); // Ajout de l'état pour l'heure
 const [searchTerm, setSearchTerm] = useState(''); // Ajout de l'état pour la recherche
 const [locationTerm, setLocationTerm] = useState(''); 

 const auth = getAuth();
 const currentUserId = auth.currentUser?.uid;
 
 useEffect(() => {
    const fetchAds = async () => {
      const db = getFirestore();
      const adsRef = collection(db, 'ads');
      const snapshot = await getDocs(adsRef);
      const adsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAds(adsList);
    };

    fetchAds();
 }, []);

 const filteredAds = ads.filter(ad => 
   ad.type === key && 
   ad.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
   ad.location.toLowerCase().includes(locationTerm.toLowerCase())
 );
 const handleShowDemandeAnnonce = (adId) => {
    setSelectedAdId(adId);
    setShowDemandeAnnonce(true);
 };

 const handleCloseDemandeAnnonce = () => {
    setShowDemandeAnnonce(false);
 };

 const handleSubmitDemandeAnnonce = async () => {
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Date:", date);
    console.log("Description:", description);
    console.log("Heure:", heure);

    if (!email.trim() || !phone.trim() || !date.trim() || !description.trim() || !heure.trim()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const db = getFirestore();
    const demandeRef = collection(db, 'demandes');
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await addDoc(demandeRef, {
        adId: selectedAdId,
        email: email,
        phone: phone,
        date: date,
        description: description, // Inclure la description
        heure: heure, // Inclure l'heure
        userId: user.uid,
        etat: 0, // Initialiser l'état à 0
        // Ajoutez d'autres informations pertinentes
      });
      alert('Votre demande a été soumise avec succès'); 
    } else {
      alert('Veuillez vous connecter pour soumettre une demande.');
      return;
    }

    handleCloseDemandeAnnonce();
    window.location.reload();

 };

 console.log("Valeur de filteredAds:", filteredAds);

 return (
  <div className="container mt-4">
              <h2 className="text-center mb-4 text-light">Rechercher une annonce</h2>
      <Form inline className="mb-4">
      <FormControl
          type="text"
          placeholder="Rechercher par localisation"
          className="mx-auto mr-sm-2"
          onChange={(e) => setLocationTerm(e.target.value)}
          style={{ maxWidth: '500px',  marginBottom: '10px'}}
        />
        <FormControl
          type="text"
          placeholder="Rechercher par description"
          className="mx-auto mr-sm-2"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '500px', marginBottom:'50px' }}
        />
        </Form>
      <Nav variant="pills" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav.Item>
          <Nav.Link eventKey="material" href="#material">Prête moi ton Matériel</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="knowledge" href="#knowledge">Prête moi ton Savoir</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="row mt-4">
        {filteredAds.map(ad => (
          <div className="col-md-4 mb-4" key={ad.id}>
            <Card className="h-100">
              {ad.photoUrl && <Card.Img variant="top" src={ad.photoUrl} className="img-fluid" style={{ objectFit: 'cover', height: '200px' }} />}
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title>{ad.title}</Card.Title>
                <Card.Text>
                 Lieu: {ad.location}
                 <br />
                 Description: {ad.description}
                </Card.Text>
                {ad.userId !== currentUserId && (
                 <Button onClick={() => handleShowDemandeAnnonce(ad.id)}>Faire une demande</Button>
                )}
        </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <DemandeAnnonce
        show={showDemandeAnnonce}
        handleClose={handleCloseDemandeAnnonce}
        handleSubmit={handleSubmitDemandeAnnonce}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        date={date}
        setDate={setDate}
        description={description} // Passer l'état de la description
        setDescription={setDescription} // Passer la fonction de mise à jour de la description
        heure={heure} // Passer l'état de l'heure
        setHeure={setHeure} // Passer la fonction de mise à jour de l'heure
      />
    </div>
 );
}

export default SearchProducts;
