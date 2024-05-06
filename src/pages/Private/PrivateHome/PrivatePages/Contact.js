import React, { useState } from 'react';

export default function Contact() {
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Vous pouvez ajouter ici la logique d'envoi du message
    // Pour cet exemple, nous allons simplement définir messageSent à true
    setMessageSent(true);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="contact-container text-white">
            <h2>Contactez-nous</h2>
            <div className="contact-info">
              <p>Adresse : 31000 Albi</p>
              <p>Téléphone : +33 1 23 45 67 89</p>
              <p>Email : contact@exemple.com</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Envoyez-nous un message</h3>
              <div className="form-group">
                <label htmlFor="name">Votre nom d'utilisateur (adresse mail) :</label>
                <input type="text" className="form-control" id="name" name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message :</label>
                <textarea className="form-control" id="message" name="message" rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Envoyer</button>
              {messageSent && <p className="text-success">Le message a bien été envoyé</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

