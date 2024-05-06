import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";

export default function NavBar() {
    const { currentUser, toggleModals } = useContext(UserContext);
    const navigate = useNavigate();

    const logOut = async () => {
        const confirmLogout = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
        if (!confirmLogout) {
            return;
        }

        try {
            await signOut(auth);
            navigate("/");
            window.location.reload();
        } catch {
            alert("Pour plusieurs raisons, nous ne pouvons vous déconnecter.");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link to='/' className="navbar-brand">
                    Prêtemoiton
                </Link>
                <div className="d-flex justify-content-end">
                    {!currentUser && (
                        <>
                            <button onClick={() => toggleModals("SignUp")} className="btn btn-outline-light me-2">
                                Inscription
                            </button>
                            <button onClick={() => toggleModals("SignIn")} className="btn btn-outline-light me-2">
                                Connexion
                            </button>
                        </>
                    )}
                    {currentUser && (
                        <button onClick={logOut} className="btn btn-outline-danger">
                            Déconnexion
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
