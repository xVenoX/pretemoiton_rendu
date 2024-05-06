import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { getFirestore, doc, getDoc,collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const GoogleMapsConfig = () => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = {
    lat: 46.603354,
    lng: 1.888334,
  };

  const defaultZoom = 12;

  const [ads, setAds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null); // Pour stocker l'emplacement de l'utilisateur
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [filteredAds, setFilteredAds] = useState([]);
  const [userCity, setUserCity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const adsCollection = collection(db, 'ads');
      const adsSnapshot = await getDocs(adsCollection);
      const adsData = adsSnapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
      setAds(adsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (ads.length > 0) {
        const places = ads.map(ad => ad.location);
        try {
          const placeDetails = await Promise.all(places.map(async (place) => {
            try {
              const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${place}&limit=1`);
              if (response.data.length > 0) {
                return {
                  lat: parseFloat(response.data[0].lat),
                  lng: parseFloat(response.data[0].lon)
                };
              } else {
                console.error('Aucun résultat trouvé pour cet emplacement :', place);
                return null;
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des détails du lieu :', error);
              return null;
            }
          }));
          setLocations(placeDetails.filter(detail => detail!== null));
        } catch (error) {
          console.error('Erreur lors de la récupération des détails du lieu :', error);
        }
      }
    };

    fetchPlaceDetails();
  }, [ads]);

  useEffect(() => {
    const userId = getAuth().currentUser.uid;
    const profileRef = doc(getFirestore(), 'profiles', userId);
    getDoc(profileRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const userProfile = docSnapshot.data();
        if (userProfile && userProfile.address) {
          const response = axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${userProfile.address}&limit=1`);
          response.then((response) => {
            if (response.data.length > 0) {
              setUserLocation({
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon)
              });
            } else {
              console.error('Aucun résultat trouvé pour cet emplacement :', userProfile.address);
            }
          }).catch((error) => {
            console.error('Erreur lors de la récupération de l"emplacement de l"utilisateur :', error);
          });
        }
      }
    }).catch((error) => {
      console.error('Erreur lors de la récupération des données du profil:', error);
    });
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Utilisez l'emplacement de l'utilisateur pour centrer la carte
      const defaultCenter = {
        lat: userLocation.lat,
        lng: userLocation.lng,
      };
      console.log('Emplacement de l"utilisateur:', userLocation);
    }
  }, [userLocation]);

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  useEffect(() => {
    const fetchUserCity = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnapshot = await getDoc(profileRef);
        if (profileSnapshot.exists()) {
          const userProfile = profileSnapshot.data();
          if (userProfile && userProfile.address) {
            const city = userProfile.address.split(' ')[0]; // Prendre le premier mot comme ville
            setUserCity(city);
          }
        }
      }
    };

    fetchUserCity();
  }, []);

  useEffect(() => {
    const fetchAdsByCity = async () => {
      if (userCity) {
        const db = getFirestore();
        const adsRef = collection(db, 'ads');
        const snapshot = await getDocs(adsRef);
        const adsList = snapshot.docs.map(doc => ({...doc.data(), id: doc.id }));
        const filteredAds = adsList.filter(ad => ad.location.toLowerCase().includes(userCity.toLowerCase()));
        setFilteredAds(filteredAds);
      }
    };

    fetchAdsByCity();
  }, [userCity]);

  useEffect(() => {
    return () => {
      setFilteredAds([]);
    };
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDR9LWmlf3ph7wBP6H2DoJkQN-zzl6gYZs"
      libraries={["places"]}
    >
    <h2 className="text-center my-4 text-light">Carte des annonces</h2>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={defaultZoom}
        center={userLocation ? userLocation : defaultCenter} // Utilisez userLocation s'il est disponible, sinon utilisez defaultCenter
      >
        {ads.map((ad) => (
          <Marker
            key={ad.id}
            position={{ lat: ad.location.lat, lng: ad.location.lng }}
          />
        ))}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={location}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
        ))}       
         {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={1000} // rayon en mètres
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
              }}
            />
            <InfoWindow
              position={userLocation}
              onCloseClick={handleInfoWindowClose}
              options={{ maxWidth: 200 }}
            >
              <div>
                <p>Vous êtes ici!</p>
              </div>
            </InfoWindow>
          </>
        )}
        
      </GoogleMap>
      <div className="container">
        <h2 className="text-center my-4 text-light">Annonces proches de votre adresse :</h2>
        <div className="row">
            {filteredAds.length > 0? (
            filteredAds.map(ad => (
                <div key={ad.id} className="col-md-4 mb-4">
                <div className="card">
                    <img src={ad.photoUrl} alt={ad.title} className="card-img-top" style={{objectFit: 'cover', height: '200px', width: '100%'}} />
                    <div className="card-body">
                    <h5 className="card-title">{ad.title}</h5>
                    <p className="card-text">Lieu: {ad.location}</p>
                    <p className="card-text">{ad.description}</p>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <div className="col-12 text-center">
                <p className="lead text-light">Nous sommes désolés, il n'y a aucune annonce disponible près de chez vous.</p>
            </div>
            )}
        </div>
        </div>

    </LoadScript>
  );
};

export default GoogleMapsConfig;
