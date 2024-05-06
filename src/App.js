import './App.css';
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignUpModals from "./components/SignUpModals";
import Private from "./pages/Private/Private";
import PrivateHome from "./pages/Private/PrivateHome/PrivateHome";
import SignInModals from "./components/SignInModals";
import PublishAd from './pages/Private/PrivateHome/PrivatePages/PublishAd'; // Ajustez le chemin d'importation selon l'emplacement de votre fichier PublishAd.js

function App() {
  useEffect(() => {
    document.title = "pretemoiton"; // Mettez ici le titre de l'onglet
  }, []);

  return (
    <>
      <SignUpModals />
      <SignInModals />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/private" element={<Private />}>
          <Route path="/private/private-home" element={<PrivateHome />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
