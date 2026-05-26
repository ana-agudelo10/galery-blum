import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import PhotoGallery from '../components/PhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <div className="blum-header">
            <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
            <span className="blum-subtitle">AGREGAR PRODUCTO</span>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <PhotoGallery />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;