import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
import PhotoGallery from '../components/PhotoGallery';
import { UserPhoto } from '../hooks/usePhotoGallery';
import './Tab2.css';

interface Props {
  addPhoto: (photo: UserPhoto) => void;
}

const Tab2: React.FC<Props> = ({ addPhoto }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
         <div className="blum-header">
  <img src="/Logo.png" className="blum-logo-img" alt="Blum" />
  <span className="blum-subtitle">BEAUTY COLLECTION</span>
</div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <PhotoGallery addPhoto={addPhoto} />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;