import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './statistiques.css'; // Assurez-vous d'importer vos styles CSS

const StatisticsPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [adCount, setAdCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      const users = await countUsers();
      const ads = await countAds();
      const requests = await countRequests();
      setUserCount(users);
      setAdCount(ads);
      setRequestCount(requests);
    };

    fetchStatistics();
  }, []);

  const countUsers = async () => {
    const db = getFirestore();
    const usersRef = collection(db, 'profiles');
    const snapshot = await getDocs(usersRef);
    return snapshot.size;
  };

  const countAds = async () => {
    const db = getFirestore();
    const adsRef = collection(db, 'ads');
    const snapshot = await getDocs(adsRef);
    return snapshot.size;
  };

  const countRequests = async () => {
    const db = getFirestore();
    const adsRef = collection(db, 'demandes');
    const snapshot = await getDocs(adsRef);
    return snapshot.size;
  };

  // Fonction pour créer le graphique à barres
  const createBarchart = (percentageArray, answerArray) => {
    return (
      <ul className="bar-chart">
        {answerArray.map((answer, index) => (
          <li className={`answer-${index}`} key={index}>
            <span className="label white">{answer}</span>
            <span className="percentage white">{`${percentageArray[index].toFixed(2)}%`}</span>
            <span className="bar-track">
              <span className="bar" style={{ width: `${percentageArray[index]}%`, backgroundColor: index === 0 ? '#007bff' : index === 1 ? '#28a745' : '#ff0000' }}></span>
            </span>
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    drawPieChart();
  }, [userCount, adCount, requestCount]);

  const drawPieChart = () => {
    const canvas = document.getElementById('pie-chart-canvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2;

    const data = [userCount, adCount, requestCount];
    const colors = ['#007bff', '#28a745', '#ff0000'];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pie chart
    let startAngle = 0;
    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (2 * Math.PI * data[i]) / data.reduce((a, b) => a + b, 0);
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      startAngle += sliceAngle;
    }
  };

  return (
    <div className="statistics-container">
      <h2 className="mb-4" style={{ color: 'white' }}>Statistiques du site</h2>
      {/* Ajoutez le graphique à camembert ici */}
      <canvas id="pie-chart-canvas" width="200" height="200"></canvas>
      <div className="stat-bar">
        <div className="bar">
          <div className="bar-inner user" style={{ width: `${userCount}%` }}></div>
        </div>
        <div className="bar-label white" style={{ color: 'white' }}>Nombre d'utilisateurs : {userCount}</div>
      </div>
      <div className="stat-bar">
        <div className="bar">
          <div className="bar-inner ad" style={{ width: `${adCount}%` }}></div>
        </div>
        <div className="bar-label white" style={{ color: 'white' }}>Nombre d'annonces : {adCount}</div>
      </div>
      <div className="stat-bar">
        <div className="bar">
          <div className="bar-inner request" style={{ width: `${requestCount}%` }}></div>
        </div>
        <div className="bar-label white" style={{ color: 'white' }}>Nombre de demandes : {requestCount}</div>
      </div>
      <div className="bar-chart-container" style={{ color: 'white' }}>
        {createBarchart([(userCount / (userCount + adCount + requestCount)) * 100, (adCount / (userCount + adCount + requestCount)) * 100, (requestCount / (userCount + adCount + requestCount)) * 100], ["Nombre  d'utilisateurs","Nombre  d'annonces", "Nombre  de demandes"])}
      </div>
    </div>
  );
};

export default StatisticsPage;
