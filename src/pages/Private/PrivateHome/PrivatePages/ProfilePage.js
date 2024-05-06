import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Nav, Tab, TabPane, Card, TabContainer, TabContent, Modal , Alert} from 'react-bootstrap';
import { getAuth } from 'firebase/auth';
import { getFirestore, deleteDoc , doc, getDoc, setDoc , updateDoc , collection, getDocs, query, where} from 'firebase/firestore';

export default function ProfilePage() {
 const [formData, setFormData] = useState({
    username: '',
    age: '',
    address: '',
    email: '',
    phoneNumber: '',
    bio: ''
 });

 const [myAds, setMyAds] = useState([]);
 const [appliedAds, setAppliedAds] = useState([]);
 const [key, setKey] = useState('notifications');
 const [myRequests, setMyRequests] = useState([]); // Nouvel état pour stocker les demandes de l'utilisateur
 const [notifications, setNotifications] = useState([]); // Nouvel état pour stocker les notifications
 const [activeTab, setActiveTab] = useState('#left-tab');
 const [isProfileComplete, setIsProfileComplete] = useState(false);
 const [showModal, setShowModal] = useState(false);

 useEffect(() => {
  const userId = getAuth().currentUser.uid;
  const profileRef = doc(getFirestore(), 'profiles', userId);
  getDoc(profileRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      setFormData(docSnapshot.data());
      const isMissingInfo = Object.values(docSnapshot.data()).some(value => value === '');
      setIsProfileComplete(!isMissingInfo);
    }
  }).catch((error) => {
    console.error('Erreur lors de la récupération des données du profil:', error);
  });

  // Récupérer les annonces de l'utilisateur
  const fetchUserAds = async () => {
    const db = getFirestore();
    const userId = getAuth().currentUser.uid;
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const adsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setMyAds(adsList);
      console.log("État myAds après mise à jour:", myAds);
    };

    fetchUserAds();

  const fetchUserRequests = async () => {
    const db = getFirestore();
    const userId = getAuth().currentUser.uid;
    const requestsRef = collection(db, 'demandes'); // Assurez-vous que c'est la bonne collection
    const q = query(requestsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const requestsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    
    setMyRequests(requestsList);

    // Récupérer les annonces correspondantes
    const fetchAppliedAds = async () => {
      const appliedAds = [];
      for (const request of requestsList) {
        const adRef = doc(db, 'ads', request.adId); // Assurez-vous que 'adId' est le bon champ
        const adSnapshot = await getDoc(adRef);
        if (adSnapshot.exists()) {
          appliedAds.push({ ...adSnapshot.data(), id: adSnapshot.id });
        }
      }
      setAppliedAds(appliedAds);
    };

    fetchAppliedAds();
  };

  fetchUserRequests();

  const fetchUserNotifications = async () => {
    try {
       const db = getFirestore();
       const userId = getAuth().currentUser.uid;
       const adsRef = collection(db, 'ads');
       const q = query(adsRef, where('userId', '==', userId));
       const snapshot = await getDocs(q);
       const adsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   
       const requestsRef = collection(db, 'demandes');
       const requestsSnapshot = await getDocs(requestsRef);
       const requestsList = requestsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
   
       const userRequests = requestsList.filter(request => adsList.find(ad => ad.id === request.adId));
   
       // Mettre à jour l'état avec les demandes correspondantes
       setNotifications(userRequests);
    } catch (error) {
       console.error('Erreur lors de la récupération des demandes:', error);
    }
   };
   
   

  fetchUserNotifications();
}, []);

useEffect(() => {
  if (!isProfileComplete) {
    setShowModal(true);
  }
}, [isProfileComplete]);

const handleCloseModal = () => setShowModal(false);

 const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
 };

 const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getAuth().currentUser.uid;
    const profileRef = doc(getFirestore(), 'profiles', userId);
    try {
      await setDoc(profileRef, formData);
      alert('Informations enregistrées avec succès !');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des informations :', error);
      alert('Une erreur est survenue lors de l\'enregistrement des informations.');
    }
 };

 const handleAccept = async (requestId) => {
  const db = getFirestore();
  const requestRef = doc(db, 'demandes', requestId);
  await updateDoc(requestRef, { etat: 1 }); // Mettre à jour l'état à 1 (accepté)
  console.log(`Demande acceptée: ${requestId}`);
  window.location.reload(); // Recharger la page

 };
 
 const handleReject = async (requestId) => {
  const db = getFirestore();
  const requestRef = doc(db, 'demandes', requestId);
  await updateDoc(requestRef, { etat: 2 }); // Mettre à jour l'état à 2 (refusé)
  console.log(`Demande refusée: ${requestId}`);
  window.location.reload(); // Recharger la page
 };
 

 const deleteAd = async (adId) => {
  const db = getFirestore();
  const adRef = doc(db, 'ads', adId);
  await deleteDoc(adRef);
  console.log(`Annonce supprimée: ${adId}`);
  window.location.reload(); // Recharger la page
};

const deleteRequest = async (requestId) => {
  const db = getFirestore();
  const requestRef = doc(db, 'demandes', requestId);
  await deleteDoc(requestRef);
  console.log(`Demande supprimée: ${requestId}`);
  window.location.reload(); // Recharger la page
};

 return (
  <div>
    <h2 className="text-center mb-4 text-light">Page de profil</h2>
    <Modal show={!isProfileComplete && showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Veuillez compléter votre profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning">
          Veuillez renseigner vos informations pour accéder à toutes les fonctionnalités du site.
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => {
          handleCloseModal();
          setActiveTab('#right-tab'); // Redirige vers la page de profil
        }}>
          Compléter mon profil
        </Button>
      </Modal.Footer>
    </Modal>
    <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
      <Nav.Item>
        <Nav.Link eventKey="#left-tab">Annonces</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="#right-tab">Page de profil</Nav.Link>
      </Nav.Item>
    </Nav>

    <TabContainer id="left-right-tab-container" activeKey={activeTab}>
      <TabContent>
        <TabPane eventKey="#left-tab">
          <Container className="py-4 bg-white rounded shadow">
            <h2 className="mb-4">Gestion des annonces et notifications</h2>
            <Tab.Container defaultActiveKey="notifications">
              <Nav variant="pills" className="justify-content-center mt-4">
               <Nav.Item>
                  <Nav.Link eventKey="notifications">Notifications</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                  <Nav.Link eventKey="appliedAds">Mes demandes</Nav.Link>
               </Nav.Item>
               <Nav.Item>
                  <Nav.Link eventKey="createdAds">Mes annonces</Nav.Link>
               </Nav.Item>
              </Nav>
              <TabContent>
              <Tab.Pane eventKey="notifications">
              <h3>Mes notifications</h3>
                <div className="row">
                    {notifications.map(request => {
                      const ad = myAds.find(ad => ad.id === request.adId); // Trouver l'annonce correspondante
                      let cardClass = '';
                      if (request.etat === 1) {
                        cardClass = 'bg-success text-white'; // Demande acceptée, fond vert et texte blanc
                      } else if (request.etat === 2) {
                        cardClass = 'bg-danger text-white'; // Demande refusée, fond rouge et texte blanc
                      }else if (request.etat === 0) {
                        cardClass = 'bg-warning text-dark'; // Demande en attente, fond jaune et texte foncé
                      }
                      return (
                        <div className="col-md-4 mb-4" key={request.id}>
                          <Card className={`h-100 ${cardClass}`}>
                            <Card.Body className="d-flex flex-column justify-content-center">
                              <Card.Text>
                                <h3>Vous avez une nouvelle notification !</h3>
                                Date: {request.date}
                                <br />
                                Heure: {request.heure}
                                <br />
                                Phone: {request.phone}
                                <br />
                                Email: {request.email}
                                <br />
                                Description: {request.description}
                              </Card.Text>
                              {ad && (
                                <Card.Text >
                                  <h3>Pour votre annonce:</h3>
                                  Lieu: {ad.location}
                                  <br/>
                                  Description: {ad.description}
                                </Card.Text>
                              )}
                              <div className="d-flex justify-content-end">
                                <Button variant="success" onClick={() => handleAccept(request.id)}>Accepter</Button>
                                <Button variant="danger" className="ml-2" onClick={() => handleReject(request.id)}>Refuser</Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      );
                    })}
                </div>
                </Tab.Pane>
                <Tab.Pane eventKey="appliedAds">
                <h3>Mes demandes</h3>
                  <div className="row">
                      {appliedAds.map(ad => {
                        // Déterminer la classe de couleur pour le Card en fonction de l'état de la demande
                        let cardClass = '';
                        myRequests.forEach(request => {
                          if (request.adId === ad.id) {
                            if (request.etat === 1) {
                              cardClass = 'bg-success text-white'; // Demande acceptée, fond vert et texte blanc
                            } else if (request.etat === 2) {
                              cardClass = 'bg-danger text-white'; // Demande refusée, fond rouge et texte blanc
                            } else if (request.etat === 0) {
                              cardClass = 'bg-warning text-dark'; // Demande en attente, fond jaune et texte foncé
                            }
                          }
                        });

                        return (
                          <div className="col-md-4 mb-4" key={ad.id}>
                            <Card className={`h-100 ${cardClass}`}>
                              {ad.photoUrl && <Card.Img variant="bottom" src={ad.photoUrl} className="img-fluid" style={{ objectFit: 'cover', height: '200px' }} />}
                              <Card.Body className="d-flex flex-column justify-content-center">
                                <Card.Text>
                                  <h3>Pour l'annonce</h3>
                                  Lieu: {ad.location}
                                  <br />
                                  Description: {ad.description}
                                </Card.Text>
                                {/* Afficher les détails de la demande correspondante */}
                                {myRequests.map(request => {
                                  if (request.adId === ad.id) {
                                  let statusMessage = '';
                                  if (request.etat === 1) {
                                      statusMessage = 'Statut : Demande acceptée par l\'annonceur !';
                                  } else if (request.etat === 2) {
                                      statusMessage = 'Statut : Demande refusée';
                                  } else if (request.etat === 0) {
                                      statusMessage = 'Statut : En attente';
                                  }
                                  return (
                                      <div key={request.id}>
                                        <Card.Text>
                                          <h3>Ma demande</h3>
                                          Date de la demande: {request.date}
                                          <br />
                                          Heure: {request.heure}
                                          <br />
                                          Description: {request.description}
                                          <br />
                                          Email: {request.email}
                                          <br />
                                          Phone: {request.phone}
                                          <br />
                                          <br />
                                          <small>{statusMessage}</small>
                                        </Card.Text>
                                        <div className="d-flex justify-content-end">
                                        <Button variant="danger" className="ml-2" onClick={() => deleteRequest(request.id)}>Supprimer</Button>
                                        </div>
                                      </div>
                                  );
                                  }
                                  return null;
                                })}
                              </Card.Body>
                            </Card>
                          </div>
                        );
                      })}
                  </div>
                  </Tab.Pane>

               <Tab.Pane eventKey="createdAds">
                  <h3>Mes annonces</h3>
                  <div className="row">
                    {myAds.map(ad => (
                      <div className="col-md-4 mb-4" key={ad.id}>
                        <Card className="h-100">
                          {ad.photoUrl && <Card.Img variant="bottom" src={ad.photoUrl} className="img-fluid" style={{ objectFit: 'cover', height: '200px' }} />}
                          <Card.Body className="d-flex flex-column justify-content-center">
                            <Card.Text>
                              Lieu: {ad.location}
                              <br />
                              Description: {ad.description}
                            </Card.Text>
                            <div className="d-flex justify-content-end">
                            <Button variant="danger" className="ml-2" onClick={() => deleteAd(ad.id)}>Supprimer</Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
               </Tab.Pane>
              </TabContent>
            </Tab.Container>
          </Container>
        </TabPane>
        <TabPane eventKey="#right-tab">
          <Container className="py-4 bg-white rounded shadow">
            <h2 className="mb-4">Votre profil</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="username">
               <Form.Label>Nom d'utilisateur</Form.Label>
               <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="age">
               <Form.Label>Âge</Form.Label>
               <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="address">
               <Form.Label>Ma ville et mon adresse</Form.Label>
               <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
               <Form.Label>Email</Form.Label>
               <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="phoneNumber">
               <Form.Label>Numéro de téléphone</Form.Label>
               <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="bio">
               <Form.Label>Biographie</Form.Label>
               <Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
               Enregistrer
              </Button>
            </Form>
          </Container>
        </TabPane>
      </TabContent>
    </TabContainer>
  </div>
);
}