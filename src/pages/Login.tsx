import React, { useState } from "react";
import {
  IonPage, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonIcon
} from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { useAuth } from "../context/AuthContext";
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const ok = login(email, password);
    if (!ok) setError("Correo o contraseña incorrectos");
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-wrapper">
          <div className="login-header">
            <img src="/Logo.png" className="login-logo" alt="Blum" />
            <p className="login-tagline">Beauty Collection</p>
          </div>

          <div className="login-card">
            <h2 className="login-title">Bienvenid@ 🌸</h2>

            <IonItem lines="none" className="login-item">
              <IonLabel position="stacked">Correo</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                placeholder="correo@ejemplo.com"
              />
            </IonItem>

            <IonItem lines="none" className="login-item">
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                placeholder="••••••"
              />
            </IonItem>

            {error && <p className="login-error">{error}</p>}

            <IonButton expand="block" className="login-btn" onClick={handleLogin}>
              <IonIcon icon={logInOutline} slot="start" />
              Ingresar
            </IonButton>

            <div className="login-hints">
              <p><b>Vendedor:</b> admin@app.com / 1234</p>
              <p><b>Cliente:</b> cliente@app.com / 1234</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;